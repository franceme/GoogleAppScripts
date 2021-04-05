function getTasks(now) {
  var output = [];

  var optionalArgs = {
    showHidden: true,
    maxResults: 500  
  };

  var taskListID = PropertiesService.getScriptProperties().getProperty('taskListID');
  var tasks = Tasks.Tasks.list(taskListID,optionalArgs);
  
  if (!tasks) {
    return output;
  }
  function alter(task, completed_date, completed_time) {
      return {
        id: task.getId(),
        title: task.getTitle(),
        notes: task.getNotes(),
        due:task.getDue(),
        completed: task.updated,
        completedDay: completed_date,
        completedTime: completed_time,
        etag:task.etag,
        selfLink:task.selfLink,
        kind:task.kind,
        status:task.status
      };
    }
  for (var itr = 0;itr < tasks.items.length;itr++)
  {
    var current_task = tasks.items[itr];
    var task_date = new Date(current_task.updated);

    var today = now.getUTCDate() == task_date.getUTCDate();
    var completed = Boolean(current_task.completed);

    if (completed && today)
    {
      function prepend(string) {
        if (parseInt(string) < 10)
        {
          return "0"+string;
        }
        return string;
      }
    
      //var string_date = prepend(task_date.getUTCFullYear())+"/"+prepend(task_date.getUTCMonth()+1)+"/"+prepend(task_date.getUTCDate());
      //var string_time = prepend(task_date.getUTCHours())+":"+prepend(task_date.getUTCMinutes())+":"+prepend(task_date.getUTCSeconds());
      var string_date = Utilities.formatDate(task_date, "EST", "YYYY-MM-dd");
      var string_time = Utilities.formatDate(task_date, "EST", "HH:mm:ss");
      output.push(alter(current_task, string_date, string_time));
    }

  }
  return output;
}

function getCompletedTasks(tasks) {
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty('sheetID');
  var SHEET = SpreadsheetApp.openById(spreadsheetId).getSheetByName('Tracking');
  
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    SHEET.appendRow([
      task.id,
      task.title,
      task.notes,
      task.due,
      task.completed,
      task.completedDay,
      task.completedTime,
      task.etag,
      task.selfLink,
      task.kind,
      task.status
    ]);
  }
}

function getCompletedTasksDoc(currentDate, tasks) {
  var docID = PropertiesService.getScriptProperties().getProperty('docID');
  var DOC = DocumentApp.openById(docID);
  
  var section = DOC.addHeader();
  section.setText(currentDate);

  
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    var current_task = section.insertListItem(task.id);
    
    current_task.insertListItem(task.id);
    current_task.insertListItem(task.title);
    current_task.insertListItem(task.notes);
    current_task.insertListItem(task.due);
    current_task.insertListItem(task.completed);
    current_task.insertListItem(task.completedDay);
    current_task.insertListItem(task.completedTime);
    current_task.insertListItem(task.etag);
    current_task.insertListItem(task.selfLink);
    current_task.insertListItem(task.kind);
    current_task.insertListItem(task.status);
  }
}

function myFunction() {
  var now = new Date();
  var todayTasks = getTasks(now);
  getCompletedTasks(todayTasks);
  getCompletedTasksDoc(now, todayTasks);
}
