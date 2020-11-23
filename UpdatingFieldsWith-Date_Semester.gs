function myFunction() {
  var current_time = new Date();
  var available_options = getFutureOptions(current_time);

  var props = PropertiesService.getScriptProperties();
  var form = FormApp.openById(props.getProperty('Form_ID'));

  var form_items = form.getItems();
  for (var itr = 0;itr < form_items.length; itr++)
  {
    var current= form_items[itr];
    var type = current.getType().toString();
    var title = current.getTitle().toString();
    if (type == "CHECKBOX" && title.startsWith("Match Me"))
    {
      var raw_choices = new Array();

      for (var choice_itr;choice_itr<=available_options.length;choice_itr++) {
         raw_choices.push(current.asCheckboxItem().createChoice(available_options[choice_itr]));
      }
      current.asCheckboxItem().setChoiceValues(available_options);

    }
  }
}
function getFutureOptions(current_date) {
   var return_strings = new Array();
   var semesters = ["Spring","Summer","Fall"];

   var cur_month = current_date.getMonth();
  var cur_year = current_date.getFullYear();


  if (cur_month < 5)
    cur_month = 1;
  else if (cur_month < 7)
    cur_month = 5;
  else
    cur_month = 8;

  var base_starting = semesters.indexOf(getSemesterByTime(cur_month));
  for (var current_itr = 0;current_itr < 6;current_itr ++) {
      var current_selection = semesters[(base_starting + current_itr) % semesters.length];
      return_strings.push(current_selection + " " + cur_year);
      if (return_strings[return_strings.length-1].startsWith("Fall"))
        cur_year+=1;
  }
  return return_strings;
}
function getSemesterByTime(month) {
  switch(month) {
    case 1:case 2:case 3:case 4:
      return "Spring";
      break;
    case 5:case 6:case 7:
      return "Summer";
      break;
    case 8:case 9:case 10:case 11:case 12:default:
      return "Fall";
  }
}