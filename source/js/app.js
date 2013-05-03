/** app namespace **/
App = {
    Models: {},
    Collections: {},
    Routers: {},
    Views: {},

    init: function () {
        App.Utils.loadTemplate(['Index', 'Login', 'Registration', 'Profile', 'Dashboard', 'Activity', 'Training', 'Send'], function() {
            App.router = new App.Routers.Router();
            Backbone.history.start();
        });
    },

    /** App config **/
    Const: {
        debug : true,
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

        version : '0.0.1'
    },

    /** global training variables **/
    Global: {
        user : {},
        training : {},
        activities : {},

        timer : null,
        training_active : false,
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
    },

    Utils: {
        loadTemplate: function(views, callback) {
            var deferreds = [];
            $.each(views, function(index, view) {
                if (App.Views[view]) {
                    deferreds.push($.get('js/templates/App.Templates.' + view + '.html', function(data) {
                        App.Views[view].prototype.template = _.template(data);
                    }));
                } else {
                    alert(view + " not found");
                }
            });
            $.when.apply(null, deferreds).done(callback);
        }
    }
};