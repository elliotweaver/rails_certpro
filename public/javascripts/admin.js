jQuery(function ($) {
  
  //Auto Complete Fields
  $("#Job_categories").fcbkcomplete({json_url: "http://localhost:8888/ajax/getCategories"});
  $("#User_jobs").fcbkcomplete({json_url: "http://localhost:8888/ajax/getJobs"});
  
  //DataTable init
  $(".data-table").dataTable({
    "bJQueryUI": true,
    "sPaginationType": "full_numbers"
  });
  
});