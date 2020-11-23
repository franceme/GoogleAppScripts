function SyncGoogleDocsActionItems() {

  var props = PropertiesService.getScriptProperties();


 var google_doc_url = "docs.google.com/document/d/"
var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
var regex = new RegExp(expression);


var email="@"+props.getProperty('email');
var task_description = /@ <EMAIL HERE> /gi;
var taskregex = RegExp(task_description);

var end_of_task_desc = "_Assigned to you";

  var taskListID=props.getProperty('taskListID');

var threads = GmailApp.getInboxThreads();
var messages = GmailApp.getMessagesForThreads(threads);
  messages.forEach( function(message) {
    message.forEach(function(mail){
      var from = mail.getFrom();
      var subject = mail.getSubject();
      var plainMail = mail.getPlainBody();
      if (from.includes("<comments-noreply@docs.google.com>")){
        var body = mail.getBody();
        var set_url = null;

        var urls = body.match(regex);
        for (var itr_url = 0;itr_url<urls.length;itr_url++) {
            current_url = urls[itr_url];
          if (current_url.startsWith(google_doc_url) && current_url.includes("/edit")) {
            set_url = current_url;
            itr_url = urls.length;
          }
        }


        //var tasks = [];
        var index_of = plainMail.indexOf(email);
        var rolling_itr = 0;
        while (index_of != -1)
        {
         rolling_itr = index_of;
          var current_length = plainMail.indexOf(end_of_task_desc,rolling_itr);
          var current_string = plainMail.substring(rolling_itr, current_length).replace(email,"").trim();
          //tasks.push(current_string);
          index_of = plainMail.indexOf(email,current_length);
          var now = new Date();
          var deadline = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));


          var taskDetails = {
            title: 'Assigned: ' + current_string + ' in document: ' + subject,
            notes: "https://"+set_url,
            due: Utilities.formatDate(deadline, "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'")
          };
          Tasks.Tasks.insert(taskDetails, taskListID);
        }
        mail.moveToTrash();
      }
  });
  });
}