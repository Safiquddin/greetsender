// function autoReply() {
//   var threads = GmailApp.getInboxThreads();
//   for (var i = 0; i < threads.length; i++) {
//     var message = "Thank you for your email. I will get back to you shortly.";
//     threads[i].reply(message);
//   }
// }  message.getFrom();
function autoReply() {
  var sentEmails = [];
  var successFlag = false;
  // var threads = GmailApp.getInboxThreads(0, 100);
  var threads = GmailApp.search('is:unread');
  var allowedDomains = ["gmail.com", "outlook.com", "siemens.com", "amdocs.com", "tcs.com", "iserveu.in", "capgemini.com", "myworkday.com"];
  var allowedSenders = ["mdkutubuddin33@gmail.com", "khanjordan440@gmail.com"];
  var hoursAgo = new Date();
  hoursAgo.setDate(hoursAgo.getDate() - 1);

  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    var lastMessage = thread.getLastMessageDate();

    if (lastMessage >= hoursAgo) {
      var messages = thread.getMessages();

      for (var j = 0; j < messages.length; j++) {
        var message = messages[j];
        if (message.isInChats()) continue;

        var senderEmail = message.getFrom();
        var senderDomain = senderEmail.substring(senderEmail.lastIndexOf("@") + 1);

        if (!sentEmails.includes(senderEmail)) {
          if (allowedDomains.indexOf(senderDomain) !== -1 && allowedSenders.includes(senderEmail)) {
            var senderName = getSenderName(senderEmail);
            var replyMessage = "Hi " + senderName + ",\n\n";
            replyMessage += "Thank you for your email. I have received it and will respond shortly.\n\n";
            replyMessage += "In the meantime, you can reach out to me at +91 9776109078 if you have any urgent inquiries or questions.\n\n";
            replyMessage += "Sincerely,\nSafiquddin Khan";
            message.reply(replyMessage);
            message.markRead();
            sentEmails.push(senderEmail);
            successFlag = true;
          }
        }
      }
    }
  }
  var sentEmailsList = sentEmails.join('\n');
  if (successFlag) {
    Logger.log("Reply Email sent successfully to:\n" + sentEmailsList);
  } else {
    Logger.log('No Unread Emails Found' );
  }
}

function getSenderName(email) {
  var name = email.split('@')[0];
  name = name.split('.').join(' ');
  name = name.replace(/[0-9]+/g, '');
  name = name.replace(/[^a-zA-Z ]/g, '');
  name = name.trim();
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return name;
}


function getSenderName(email) {
  var name = email.split('@')[0]; // Get the part before the @ symbol
  name = name.split('.').join(' '); // Replace dots with spaces
  name = name.replace(/[0-9]+/g, ''); // Remove any numbers
  name = name.replace(/[^a-zA-Z ]/g, ''); // Remove any special characters
  name = name.trim(); // Remove leading and trailing spaces
  name = name.charAt(0).toUpperCase() + name.slice(1); // Capitalize the first letter
  return name;
}
