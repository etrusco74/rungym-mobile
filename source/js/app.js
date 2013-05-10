/** app namespace **/
app = {
    models: {},
    collections: {},
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
            app.models.activities.load(function() {
                if (app.models.activities.all().length == 0) {
                    $.getJSON(app.const.apiurl() + "activities",
                        function (data) {
                            app.global.activitiesModel = new app.models.activities(data);
                            app.global.activitiesModel.save();
                        });
                }
            });
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

        version : '0.0.2'
    },

    /** app global variables **/
    global: {

        timer : null,
        training_active : false,
        different_latlon : true,
        index : 0,
        i_emulation : 0,
        speed_timer : 1000,

        secondi_totali : 0,
        minuti_totali : 0,
        tempo_str : '00:00:00',

        total_distance_str : '0',
        total_distance_km : 0,
        total_distance_m : 0,
        distance_two_point_km : 0,

        velocita_istantanea_ms : 0,
        somma_velocita_istantanea_ms : 0,
        velocita_media_ms : 0,

        velocita_istantanea_kmh : 0,
        velocita_media_kmh : 0,

        calorie : 0,
        gr_persi : 0
    }
};