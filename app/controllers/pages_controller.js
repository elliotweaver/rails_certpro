load('application');

layout('pages');

before(testLogin, {only: ['login']});

var bcrypt = require('bcrypt');

action('index', function () {
    this.title = 'Home Page';
    render();
});

action('login', function () {
  this.title = 'User Login';
  render();
});

action('loginPost', function () {
  this.title = 'User Login';
  Muser.find({}).where('username', body.username).exec(function(err, docs) {
    if (err) {
      flash('error', err);
      render('login');
    }
    else {
      if (!docs.length) {
        flash('error', 'Invalid username or password');
        render('login');
      }
      else {
        var hash = bcrypt.hashSync(body.password, docs[0].salt);
        if (hash != docs[0].password) {
          flash('error', 'Invalid username or password');
          render('login');
        }
        else {
          req.session.user_id = docs[0]._id;
          req.session.user_role = docs[0].role;
          if (docs[0].role == 'contractor') {
            redirect('/contractor');
          }
          else if (docs[0].role == 'admin') {
            redirect('/admin');
          }
        }
      }
    }
  });
  
});

action('logout', function () {
  req.session.user_id = null;
  req.session.user_role = null;
  redirect('/login');
});

function testLogin() {
  if (req.session.user_id && req.session.user_role) {
    redirect('/'+req.session.user_role);
  }
  else {
     next();
  }
}