//https://stackoverflow.com/questions/14415752/google-calendar-app-script-to-pull-data-into-a-spreadsheet-periodically
function getCalendarEvents(){
  var cal = CalendarApp.getCalendarById(PropertiesService.getScriptProperties().getProperty('calID'));
  var eventslog = [];
  var now = new Date();
  var twentyfourHoursBeforeNow = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  //https://developers.google.com/apps-script/reference/calendar/calendar#getEvents(Date,Date)
  var calendarEvents = cal.getEvents(twentyfourHoursBeforeNow, now);

  function alter(event) {
    event.get
    var rawSDuration = (event.getEndTime() - event.getStartTime())/1000;
    var subTitles = event.getTitle().split("/");
    var output = [];
    for (var itr=0;itr < subTitles.length;itr++)
    {
      output.push(
        {
            id: event.getId(),
            title: subTitles[itr],
            startTime: event.getStartTime(),
            endTime: event.getEndTime(),
            runningTime: (rawSDuration/60)/subTitles.length
        }
      );
    }
    return output;
  }

  for (var itr = 0;itr < calendarEvents.length;itr ++) {
    var containerEvents = alter(calendarEvents[itr]);
    for (var subItr = 0;subItr<containerEvents.length;subItr++)
    {
      eventslog.push(
        containerEvents[subItr]
      );
    }
  }

  return eventslog;
}

function addCalEvents(calendarEvents)  {
  var SHEET = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('sheetID')).getSheetByName(PropertiesService.getScriptProperties().getProperty('sheetName'));

  for (var i = 0; i < calendarEvents.length; i++) {
    var event = calendarEvents[i];
    SHEET.appendRow([
      event.id,
      event.title,
      event.startTime,
      event.endTime,
      event.runningTime
    ]);
  }
}

function entry() {
  var todayEvents = getCalendarEvents();
  addCalEvents(todayEvents);
}