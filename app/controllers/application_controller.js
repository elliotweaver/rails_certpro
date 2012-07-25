before('protect from forgery', function () {
    protectFromForgery('bd7f58077cafe9b1a5a61c068d028a813949b38a');
});

function requireAdmin() {
  if (req.session.user_id && req.session.user_role == 'admin') {
    next();
  }
  else { 
    redirect('/login');
  }
}
publish('requireAdmin', requireAdmin);

function requireLogin() {
  if (req.session.user_id) {
    User.find(req.session.user_id, function (err, user) {
      if (err || !user) {
          req.session.user_id = null;
          req.session.user_role = null;
          redirect('/login');
      } else {
          this.user = user;
          Mjob.find({}).where('_id').in(user.jobs).exec(function(err, docs) {
            this.jobs = docs;
            next();
          }.bind(this));
      }
    }.bind(this));
  }
  else {
     redirect('/login');
  }
}
publish('requireLogin', requireLogin);