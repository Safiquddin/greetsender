// function autoReply() {
//   var threads = GmailApp.getInboxThreads();
//   for (var i = 0; i < threads.length; i++) {
//     var message = "Thank you for your email. I will get back to you shortly.";
//     threads[i].reply(message);
//   }
// }  message.getFrom();

function autoReply() {
  var sentEmails = []; // Store sent email-IDs
  var threads = GmailApp.getInboxThreads();
  var allowedDomains = ["gmail.com", "outlook.com", "siemens.com", "amdocs.com", "tcs.com", "iserveu.in", "capgemini.com", "myworkday.com"];
  var allowedSenders = ["mdkutubuddin33@gmail.com", "khanjordan440@gmail.com"];

  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      var messageId = message.getId(); // Get the email ID
      // Check if the message has already been replied to thread
      if (message.isInRepliedState()) {
        continue;
      }
      var senderEmail = message.getFrom();
      var senderDomain = senderEmail.substring(senderEmail.lastIndexOf("@") + 1);
      // Check if we have already replied to this email
      if (!sentEmails[senderEmail]) {
        if (allowedDomains.indexOf(senderDomain) !== -1 && allowedSenders.includes(senderEmail)) {
          var getsenderName = senderEmail.substring(0, senderEmail.indexOf('<')).trim();
          var senderName = getsenderName || sender(senderEmail);
          
          var replyMessage = "Hi " + senderName + ",\n\n";
          replyMessage += "Thank you for your email. I have received it and will respond shortly.\n\n";
          replyMessage += "In the meantime, you can reach out to me at +91 9776109078 if you have any urgent inquiries or questions.\n\n";
          replyMessage += "Sincerely,\nSafiquddin Khan";

          message.reply(replyMessage);
          sentEmails.push(senderName);
        }
      }
    }
  }
  var sentEmailslist = ccAddresses.join('\n');
  Logger.log("Reply Email sent successfully to:" + sentEmailslist);
}

function sender(email) {
  var name = email.split("@")[0]; // Get the part before the @ symbol
  name = name.replace(/[0-9]+/g, ''); // Remove any numbers
  name = name.replace(/[^a-zA-Z ]/g, ''); // Remove any special characters
  name = name.trim(); // Remove leading and trailing spaces
  name = name.charAt(0).toUpperCase() + name.slice(1); // Capitalize the first letter
  return name;
}

