jQuery(function ($) {
  $("#Job_categories").fcbkcomplete({json_url: "http://localhost:8888/ajax/getCategories"});
});