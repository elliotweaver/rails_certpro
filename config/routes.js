exports.routes = function (map) {
    map.resources('logs');
    map.resources('transactions');
    map.resources('leads');
    map.resources('projects');
    map.resources('users');
    map.resources('jobs');
    map.resources('categories');

    // Generic routes. Add all your routes below this line
    // feel free to remove generic routes
    map.all(':controller/:action');
    map.all(':controller/:action/:id');
};