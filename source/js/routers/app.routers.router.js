/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.09
 * To change this template use File | Settings | File Templates.
 */
app.routers.router = Backbone.Router.extend({
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

        app.utils.loadActivities();

        if (!app.global.indexView) {
            app.global.indexView = new app.views.index();
            app.global.indexView.render();
        } else {
            console.log('reusing index view');
            app.global.indexView.delegateEvents(); // delegate events when the view is recycled
        }
        $('#content').html(app.global.indexView.el);
        $('#version').text('Versione ' + app.const.version);
        this.navigate('#', { trigger : false });
    },
    login: function() {
        /** reload user data if he has not performed logout **/
        if (app.models.user.all().length > 0) {
            app.routers.router.prototype.dashboard();
        }
        else {
            if (!app.global.loginView) {
                app.global.loginView = new app.views.login();
                app.global.loginView.render();
            } else {
                console.log('reusing login view');
                app.global.loginView.delegateEvents(); // delegate events when the view is recycled
            }
            $('#content').html(app.global.loginView.el);
            this.navigate('#login', { trigger : false });
        }
    },
    logout: function() {
        if (app.models.user.all().length != 0) {
            app.models.user.each(function() {
                //app.models.user.remove(this);
                app.global.userModel = app.models.user.first();
                app.global.userModel.destroy();
            });
            //app.global.userModel = app.models.user.first();
            //app.global.userModel.destroy();
        }
        if (app.models.activities.all().length != 0) {
            app.models.activities.each(function() {
                //app.models.activities.remove(this);
                app.global.activitiesModel = app.models.activities.first();
                app.global.activitiesModel.destroy();
            });
            //app.global.activitiesModel = app.models.activities.first();
            //app.global.activitiesModel.destroy();
        }
        app.utils.destroyViews();
        this.index();
    },
    registration: function() {
        if (!app.global.registrationView) {
            app.global.registrationView = new app.views.registration();
            app.global.registrationView.render();
        } else {
            console.log('reusing registration view');
            app.global.registrationView.delegateEvents(); // delegate events when the view is recycled
        }
        //app.global.registration = new app.views.registration();
        $('#content').html(app.global.registrationView.el);
        this.navigate('#registration', { trigger : false });
    },
    profile: function() {
        if (!app.global.profileView) {
            app.global.profileView = new app.views.profile();
            app.global.profileView.render();
        } else {
            console.log('reusing profile view');
            app.global.profileView.delegateEvents(); // delegate events when the view is recycled
        }
        //app.global.profile = new app.views.profile();
        $('#content').html(app.global.profileView.el);
        this.navigate('#profile', { trigger : false });
    },
    dashboard: function() {
        if (!app.global.dashboardView) {
            app.global.dashboardView = new app.views.dashboard();
            app.global.dashboardView.render();
        } else {
            console.log('reusing dashboard view');
            app.global.dashboardView.delegateEvents(); // delegate events when the view is recycled
        }
        //app.global.dashboard = new app.views.dashboard();
        $('#content').html(app.global.dashboardView.el);
        this.navigate('#dashboard', { trigger : false });
    },
    activity: function() {
        if (!app.global.activityView) {
            app.global.activityView = new app.views.activity();
            app.global.activityView.render();
        } else {
            console.log('reusing activity view');
            app.global.activityView.delegateEvents(); // delegate events when the view is recycled
        }
        //app.global.activity = new app.views.activity();
        $('#content').html(app.global.activityView.el);
        this.navigate('#activity', { trigger : false });
    },
    training: function(activity) {
        /*
        if (!app.global.trainingView) {
            app.global.trainingView = new app.views.training({opt : activity});
            app.global.trainingView.render();
        } else {
            console.log('reusing training view');
            app.global.trainingView.delegateEvents(); // delegate events when the view is recycled
        }
        */
        app.global.trainingView = new app.views.training({opt : activity});
        app.global.trainingView.render();
        $('#content').html(app.global.trainingView.el);
        this.navigate('#training/'+activity, { trigger : false });
    },
    send: function() {
        if (!app.global.sendView) {
            app.global.sendView = new app.views.send();
            app.global.sendView.render();
        } else {
            console.log('reusing send view');
            app.global.sendView.delegateEvents(); // delegate events when the view is recycled
        }
        //app.global.send = new app.views.send();
        $('#content').html(app.global.sendView.el);
        this.navigate('#send', { trigger : false });
    }
});
