/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.09
 * To change this template use File | Settings | File Templates.
 */
App.Routers.Router = Backbone.Router.extend({
    routes: {
        '':                 'index',
        'login':            'login',
        'logout':           'logout',
        'registration':     'registration',
        'profile':          'profile',
        'dashboard':        'dashboard',
        'activity':         'activity',
        'training/:activity':         'training',
        'send':             'send'
    },
    index: function() {
        if (!this.Index) {
            this.Index = new App.Views.Index();
        }
        $('#content').html(this.Index.el);
    },
    login: function() {
        /** reload user data if he has not performed logout **/
        if (App.Models.User.all().length > 0) {
            App.Routers.Router.prototype.dashboard();
        }
        else {
            if (!this.Login) {
                this.Login = new App.Views.Login();
            }
            $('#content').html(this.Login.el);
        }
    },
    logout: function() {
        if (!this.Logout) {
            this.Logout = new App.Views.Logout();
        }
        this.index();
    },
    registration: function() {
        if (!this.Registration) {
            this.Registration = new App.Views.Registration();
        }
        $('#content').html(this.Registration.el);
    },
    profile: function() {
        if (!this.Profile) {
            this.Profile = new App.Views.Profile();
        }
        $('#content').html(this.Profile.el);
    },
    dashboard: function() {
        if (!this.Dashboard) {
            this.Dashboard = new App.Views.Dashboard();
        }
        $('#content').html(this.Dashboard.el);
    },
    activity: function() {
        if (!this.Activity) {
            this.Activity = new App.Views.Activity();
        }
        $('#content').html(this.Activity.el);
    },
    training: function(activity) {
        if (!this.Training) {
            this.Training = new App.Views.Training({opt : activity});
        }
        $('#content').html(this.Training.el);
    },
    send: function() {
        if (!this.Send) {
            this.Send = new App.Views.Send();
        }
        $('#content').html(this.Send.el);
    }
});