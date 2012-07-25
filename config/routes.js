exports.routes = function (map) {
    map.resources('logs', {path: 'admin/logs'});
    map.resources('leads', {path: 'admin/leads'});
    map.resources('projects', {path: 'admin/projects'});
    map.resources('users', {path: 'admin/users'});
    map.resources('jobs', {path: 'admin/jobs'});
    map.resources('categories', {path: 'admin/categories'});

    // Generic routes. Add all your routes below this line
    // feel free to remove generic routes
    //map.all(':controller/:action');
    //map.all(':controller/:action/:id');
    map.get('/', 'pages#index');
    map.get('logout', 'pages#logout');
    map.get('login', 'pages#login');
    map.post('login', 'pages#loginPost');
    map.get('signup', 'pages#signup');
    map.post('signup', 'pages#signupPost');
    map.get('admin', 'users#index');
    map.get('contractor', 'contractor#index');
    map.get('ajax/getCategories', 'categories#getCategories');
    map.get('ajax/getJobs', 'jobs#getJobs');
    map.get('ajax/getJobsInCategory', 'jobs#getJobsInCategory');
    map.get('ajax/searchContractors', 'users#nearbyContractors');
    map.get('ajax/createProject', 'projects#createProject');
};