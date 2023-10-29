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
  // var ureadMsgsCount = GmailApp.getInboxUnreadCount();
  // var threads = GmailApp.getInboxThreads(0, ureadMsgsCount);
  var threads = GmailApp.search('is:unread in:inbox');
  var allowedDomains = ["gmail.com", "outlook.com", "hotmail.com"];
  var allowedSenders = ["mdkutubuddin33@gmail.com", "khanjordan440@gmail.com"];
  var minutesAgo = new Date();
  minutesAgo.setMinutes(minutesAgo.getMinutes() - 16);
  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    var lastMessage = thread.getLastMessageDate();

    if (lastMessage >= minutesAgo) {
      var messages = thread.getMessages();

      for (var j = 0; j < messages.length; j++) {
        var message = messages[j];
        if (message.isInChats()) {
        continue;
        }
        var senderEmail = message.getFrom();
        var senderDomain = senderEmail.substring(senderEmail.lastIndexOf("@") + 1).split('>')[0];
        console.log(senderDomain);
        if (!sentEmails.includes(senderEmail)) {
          if (allowedDomains.includes(senderDomain) || allowedSenders.includes(senderEmail)) {
            var getsenderName = senderEmail.substring(0, senderEmail.indexOf('<')).trim();
            var senderName = getsenderName || getSender(senderEmail) ;
            var subject = message.getSubject(); // not required bdw to get the subject of the email
            var replyMessage = `Hi ${senderName}, ${getTimeOfDay()} <br><br>`;
            replyMessage += `Thank you for your email. I have received it and will respond shortly.<br><br>`;
            replyMessage += `In the meantime, you can reach out to me at  &#128241; <a href='tel:+919776109078'>+91 9776109078</a> if you have any urgent inquiries or questions.<br><br>`;
            replyMessage += `Sincerely &#128522;,<br>Safiquddin Khan`;
            message.reply(subject, { htmlBody: replyMessage });
            // message.markRead();
            thread.markRead();
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
    Logger.log('No Unread Emails Found');
  }
}

function getSender(email) {
  var name = email.split('@')[0]; // Get the part before the @ symbol
  name = name.split('.').join(' '); // Replace dots with spaces
  name = name.replace(/[0-9]+/g, ''); // Remove any numbers
  name = name.replace(/[^a-zA-Z ]/g, ''); // Remove any special characters
  name = name.trim(); // Remove leading and trailing spaces
  name = name.charAt(0).toUpperCase() + name.slice(1); // Capitalize the first letter
  return name;
}

function getTimeOfDay() {
  var currentTime = new Date();
  var hours = currentTime.getHours();
  if (hours >= 5 && hours < 12) {
    return " Good Morning &#127748;";
  } else if (hours >= 12 && hours < 17) {
    return " Good Afternoon &#127774;";
  } else if (hours >= 17 && hours < 21) {
    return " Good Evening  &#127751;";
  } else {
    return " Good Night &#127747;";
  }
}


function deleteOldEmails() {
  var currentDate = new Date();
  var yearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
  var categories = ["Promotions", "Social", "Updates"];
  var batchSize = 20; // Set your batch size
  var zone = Session.getScriptTimeZone();
  Logger.log('Deleting Old Emails ' + yearAgo);
  categories.forEach(function(category) {
    // Define the search query for each category and the cutoff date
    var searchQuery = "category:" + category + " before:" + Utilities.formatDate(yearAgo, zone, "yyyy-MM-dd");
    var threads = GmailApp.search(searchQuery);
    for (var i = 0; i < threads.length; i += batchSize) {
      var batch = threads.slice(i, i + batchSize);
      
      batch.forEach(function(thread) {
        thread.moveToTrash();
        Logger.log("Deleted email in category: " + category + " with subject: " + thread.getFirstMessageSubject());
      });
      
      // Pause briefly to avoid hitting execution time limits for Quota
      Logger.log('Waiting for 7 Minutes');
      Utilities.sleep(1000); // Wait for 1 mins
    }
  });
}
