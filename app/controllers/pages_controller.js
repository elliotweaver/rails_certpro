load('application');

layout('pages');

action('index', function () {
    this.title = 'New log';
    this.log = new Log;
    render();
});