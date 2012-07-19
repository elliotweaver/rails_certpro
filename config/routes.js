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
    map.get('admin', 'users#index');
    map.get('ajax/getCategories', 'categories#getCategories');
    map.get('ajax/getJobs', 'jobs#getJobs');
    map.get('ajax/getJobsInCategory', 'jobs#getJobsInCategory');
    map.get('ajax/searchContractors', 'users#nearbyContractors');
    map.get('ajax/createProject', 'projects#createProject');
};