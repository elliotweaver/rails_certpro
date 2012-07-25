load('application');

layout('admin');

before(use('requireAdmin'), {except: 'getCategories'});
before(loadCategory, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.title = 'New category';
    this.category = new Category;
    render();
});

action(function create() {
    
    //will become the data feed for the model
    var data = req.body.Category;
    //update the timestamp
    data['created'] = data['updated'] = new Date().getTime();
    
    Category.create(data, function (err, category) {
        if (err) {
            flash('error', 'Category can not be created');
            render('new', {
                category: category,
                title: 'New category'
            });
        } else {
            flash('info', 'Category created');
            redirect(path_to.categories());
        }
    });
});

action(function index() {
    this.title = 'Categorys index';
    Category.all(function (err, categories) {
        render({
            categories: categories
        });
    });
});

action(function show() {
    this.title = 'Category show';
    render();
});

action(function edit() {
    this.title = 'Category edit';
    render();
});

action(function update() {
    
    //will become the data feed for the model
    var data = req.body.Category;
    //update the timestamp
    data['updated'] = new Date().getTime();
    
    this.category.updateAttributes(data, function (err) {
        if (!err) {
            flash('info', 'Category updated');
            redirect(path_to.category(this.category));
        } else {
            flash('error', 'Category can not be updated');
            this.title = 'Edit category details';
            render('edit');
        }
    }.bind(this));
});

action(function destroy() {
    this.category.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy category');
        } else {
            flash('info', 'Category successfully removed');
        }
        send("'" + path_to.categories() + "'");
    });
});

action(function getCategories() {
  Category.all(function (err, categories) {
    var items = [];
    categories.forEach(function(category) {
      items.push({key: category.id, value: category.name});
    });
    send(items);
  });
});

function loadCategory() {
    Category.find(params.id, function (err, category) {
        if (err || !category) {
            redirect(path_to.categories());
        } else {
            this.category = category;
            next();
        }
    }.bind(this));
}
