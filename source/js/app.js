/** app namespace **/
app = {
    /** phonegap startup **/
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        this.utils.init();
    },

    /** namespaces **/
    collections: {},
    models: {},
    routers: {},
    views: {},

    /** app utils **/
    utils: {

        init: function () {
            app.utils.loadTemplate(['index', 'login', 'registration', 'profile', 'dashboard', 'activity', 'training', 'send'], function() {
                app.router = new app.routers.router();
                Backbone.history.start();
            });
        },

        loadActivities: function(){
            app.global.activitiesCollection = new app.collections.activities();
            app.global.activitiesCollection.fetch();
        },

        loadTrainings: function(){
            app.global.trainingsCollection = new app.collections.trainings();
            app.global.trainingsCollection.fetch();
        },

        loadUsers: function(){
            app.global.usersCollection = new app.collections.users();
            app.global.usersCollection.fetch();
        },

        destroyViews: function(){
            if (app.global.dashboardView) { app.global.dashboardView.destroy_view(); }
            if (app.global.activityView) { app.global.activityView.destroy_view();  }
            if (app.global.profileView) { app.global.profileView.destroy_view();  }
            if (app.global.sendView) { app.global.sendView.destroy_view(); }
            if (app.global.trainingView) { app.global.trainingView.destroy_view();}
        },

        loadTemplate: function(views, callback) {
            var deferreds = [];
            $.each(views, function(index, view) {
                if (app.views[view]) {
                    deferreds.push($.get('js/templates/app.templates.' + view + '.html', function(data) {
                        app.views[view].prototype.template = _.template(data);
                    }));
                } else {
                    alert(view + " not found");
                }
            });
            $.when.apply(null, deferreds).done(callback);
        }
    },

    /** app config **/
    const: {
        debug : false,
        //env : 'development',
        env : 'production',

        apiurl : function() {
            var url;
            return (this.env == 'development') ? url = 'http://rungym.etrusco.c9.io/api/' : url = 'http://www.rungym.com/api/';
        },

        testJsonUrl_OLD : function() {
            var url;
            return (this.env == 'development') ? url = 'http://rungym.etrusco.c9.io/mob/events.json' : url = 'http://www.rungym.com/mob/events.json';
        },

        testJsonUrl : 'js/events.json',

        version : '0.0.4'
    },

    /** app global namespace **/
    global: {
        timer : null,
        speed_timer : 1000,
        training_active : false,
        different_latlon : true,
        i_emulation : 0
    }
};