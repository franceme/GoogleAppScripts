function getTasks() {
  var now = new Date();
  var output = [];

  var optionalArgs = {
    showHidden: false,
    maxResults: 100000000  
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

      var string_date = prepend(task_date.getUTCFullYear())+"/"+prepend(task_date.getUTCMonth()+1)+"/"+prepend(task_date.getUTCDate());
      var string_time = prepend(task_date.getUTCHours())+":"+prepend(task_date.getUTCMinutes())+":"+prepend(task_date.getUTCSeconds());
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


function myFunction() {
  getCompletedTasks(getTasks());
}
