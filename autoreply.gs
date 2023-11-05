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
  var threads = GmailApp.search('is:unread category:primary in:inbox');
  var ignoredSenders = ["khanjordan440@gmail.com"];
  var ignoredDomains = ["hdfcbank.net", "naukri.com"];
  // var hoursAgo = new Date();
  // hoursAgo.setHours(hoursAgo.getHours() - 1);
  var minutesAgo = new Date();
  minutesAgo.setMinutes(minutesAgo.getMinutes() - 10);
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
        var senderDomain = senderEmail.split('@')[1].split('>')[0];
        debugger;
        if (ignoredSenders.includes(senderEmail)) {
          continue;
        }
        if (ignoredDomains.includes(senderDomain)) {
          continue;
        }
        if (!sentEmails.includes(senderEmail)) {
          var getsenderName = senderEmail.substring(0, senderEmail.indexOf('<')).trim();
          var senderName = getsenderName || getSender(senderEmail) ;
          Logger.log(senderName)
          var subject = message.getSubject(); // not required bdw to get the subject of the email
          var replyMessage = `Hi ${senderName}, ${getDay()} <br><br>`;
          replyMessage += `Thank you for your email. I have received it and will respond shortly.<br><br>`;
          replyMessage += `In the meantime, you can reach out to me at  &#128241; <a href='tel:+919776109078'>+91 9776109078</a> if you have any urgent inquiries or questions.<br><br>`;
          replyMessage += `Sincerely &#128522;,<br>Safiquddin Khan<br><br>`;
          replyMessage += `<font color="yellow">auto-reply from system</font>`;
          message.reply(subject, { htmlBody: replyMessage });
          message.markRead();
          thread.markRead();
          sentEmails.push(senderEmail);
          successFlag = true;
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

function getDay() {
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
  var yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  var categories = ["Promotions", "Social", "Updates"];
  var batchSize = 25; // Set your batch size
  var zone = 'GMT' || Session.getScriptTimeZone() || 'Asia/Kolkata';
  var deletedThreadCount = 0;
  var totalThreadCount = 0;
  Logger.log('Deleting Old Emails ' + yearAgo);
  categories.forEach(function(category) {
    // Define the search query for each category and the cutoff date
    var searchQuery = "category:" + category + " before:" + Utilities.formatDate(yearAgo, zone, 'yyyy-MM-dd');
    var threads = GmailApp.search(searchQuery);
    totalThreadCount += threads.length;
    for (var i = 0; i < threads.length; i += batchSize) {
      var batch = threads.slice(i, i + batchSize);
      batch.forEach(function(thread) {
        var arrivalTime = Utilities.formatDate(thread.getLastMessageDate(), zone, "yyyy-MM-dd"); // Format the arrival time
        thread.moveToTrash();
        deletedThreadCount++;
        Logger.log("(Arrival time: " + arrivalTime + ") " +"Deleted email in: " + category + " with subject: " + thread.getFirstMessageSubject());
      });
      
      // Pause briefly to avoid hitting execution time limits for Quota
      Logger.log('Waiting for 5 seconds');
      Utilities.sleep(500); // Wait for 5 seconds (5000 milliseconds)
    }
    Logger.log('Total threads deleted in category ' + category + ': ' + deletedThreadCount + ' out of ' + totalThreadCount);
  });
}
