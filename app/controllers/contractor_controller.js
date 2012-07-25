load('application');

layout('contractor');

before(use('requireLogin'));

action('index', function () {
    this.title = 'Contractor';
    Mlead.find({}).where('contractor', req.session.user_id).exec(function(err, leads) {
      
    });
    render();
});

