load('application');

layout('contractor');

before(use('requireLogin'));

action('index', function () {
    this.title = 'Contractor';
    Lead.all({where: {contractor: req.session.user_id}},function (err, leads) {
      var left = leads.length,
        data = [];
      leads.forEach(function(lead) {
        Project.find(lead.project, function(err, project) {
          lead.info = project;
          data[leads.length - left] = lead;
          if (--left == 0) {
            render({leads: data});
          }
        });
      });
    });
});

