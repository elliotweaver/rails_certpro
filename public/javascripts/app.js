

/**************************
 * Application
 **************************/
var Findpro = Em.Application.create();

Findpro.zipTextField = Em.TextField.extend({});
Findpro.nameTextField = Em.TextField.extend({});
Findpro.phoneTextField = Em.TextField.extend({});
Findpro.emailTextField = Em.TextField.extend({});
Findpro.descriptionTextArea = Em.TextArea.extend({});


/**************************
 * Models
 **************************/

//category
Findpro.Category = Em.Object.extend({
  id: null,
  name: null
});

//job
Findpro.Job = Em.Object.extend({
  id: null,
  name: null
});

/**************************
 * Views
 **************************/

//category
Findpro.CategoryView = Em.View.extend({
  selectCategory: function() {
    var me = this;
    Findpro.finderController.setCategory(me.content.key);
  }
});

//job
Findpro.JobView = Em.View.extend({
  selectJob: function() {
    var me = this;
    Findpro.finderController.setJob(me.content.key);
  }
});

/**************************
 * Controllers
 **************************/

//category
Findpro.categoryController = Em.ArrayController.create({
  content: [],
  getCategories: function() {
    var me = this;
    $.ajax({
      url: "/ajax/getCategories",
      success: function(data) {
        me.set('content', data);
        Findpro.finderController.set('isLoading', false);
      }
    });
  }
});

//job
Findpro.jobController = Em.ArrayController.create({
  content: [],
  getJobs: function() {
    var me = this;
    $.ajax({
      url: "/ajax/getJobsInCategory?category="+Findpro.finderController.get('category'),
      success: function(data) {
        me.set('content', data);
        Findpro.finderController.set('isLoading', false);
      }
    });
  }
});

//main finder
Findpro.finderController = Em.ArrayController.create({
  content: [],
  zip: null,
  category: null,
  job: null,
  name: null,
  phone: null,
  email: null,
  description: null,
  address: null,
  address2: null,
  city: null,
  state: null,
  step: 'zip',
  isLoading: false,
  isStepZip: true,
  isStepCategory: false,
  isStepJob: false,
  isStepSearch: false,
  isStepInfo: false,
  isStepSuccess: false,
  isStepFailed: false,
  submitZip: function() {
    var me = this;
    me.set('isStepZip', false);
    me.set('isStepCategory', true);
    me.set('step', 'category');
    me.set('isLoading', true);
    Findpro.categoryController.getCategories();
  },
  setCategory: function(val) {
    var me = this;
    me.set('category', val);
    me.set('isStepCategory', false);
    me.set('isStepJob', true);
    me.set('step', 'job');
    me.set('isLoading', true);
    Findpro.jobController.getJobs();
  },
  setJob: function(val) {
    var me = this;
    me.set('job', val);
    me.set('isStepJob', false);
    me.set('isStepSearch', true);
    me.set('step', 'search');
    me.search();
  },
  search: function() {
    var me = this;
    $.ajax({
      url: "/ajax/searchContractors?zip=" + me.get('zip')+"&job="+me.get('job'),
      success: function(data) {
        if (data) {
          me.set('isStepSearch', false);
          me.set('isStepInfo', true);
          me.set('step', 'info'); 
        }
        else {
          me.set('isStepSearch', false);
          me.set('isStepFailed', true);
          me.set('step', 'failed');
        }
      }
    });
  },
  sendRequest: function() {
    var me = this;
    
  }
});