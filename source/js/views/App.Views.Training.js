/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 *
 */
App.Views.Training = Backbone.View.extend({

    /** init view **/
    initialize: function(options) {
        console.log('Initializing Training View');
        this.load();
        this.render();
    },

    /** click event for start training **/
    events: {
        'click #btnStart':      'start_training',
        'click #btnEnd':        'end_training'
    },

    /** load user data and create training **/
    load: function() {

        App.Models.User.load(function() {
            App.Global.user = App.Models.User.first();
        });

        App.Global.training = new App.Models.Training({
            "username" :  App.Global.user.attributes.username,
            "activity_id" : this.options.opt,
            "events": [],
            "loc": {
                "type" : "LineString",
                "coordinates" : []
            }
        });
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());
        navigator.geolocation.getCurrentPosition(this.refreshUI, this.noLocation);
        return this;
    },

    /** start training **/
    start_training: function() {
        if (App.Global.training_active) {
            App.Global.training_active  = false;
            $("#btnStart").html('riprendi');

            App.Global.training.attributes.end_date = new Date();
            clearInterval(App.Global.timer);
        }
        else    {
            App.Global.training_active = true;
            $("#btnStart").html('ferma');

            if (typeof App.Global.training.attributes.start_date === 'undefined') {
                App.Global.training.attributes.start_date = new Date();
            }

            if (App.Const.debug) {
                $.getJSON(App.Const.testJsonUrl, this.emulation);
            }
            else
            {
                App.Global.timer = setInterval(function() {
                    navigator.geolocation.getCurrentPosition(App.Views.Training.prototype.refreshUI, App.Views.Training.prototype.noLocation);
                }, App.Global.speed_timer);
            }
        }
    },

    /** end training **/
    end_training: function() {
        if (App.Global.training_active) {
            App.Global.training_active  = false;

            App.Global.training.attributes.end_date = new Date();
            clearInterval(App.Global.timer);
        }

        if (App.Global.training.attributes.events.length > 1) {
            App.Global.training.save();
            Backbone.history.navigate('#send');
            window.location.reload();
        }
        else {
            App.Global.training.destroy();
            Backbone.history.navigate('#dashboard');
            window.location.reload();
        }
    },

    /** gps refresh **/
    refreshUI: function(event) {

        if (!(typeof event === 'undefined'))       {

            App.Global.i_emulation ++;

            /** set lat/lon to json obj **/
            var pos = [];
            pos.push(event.coords.longitude);
            pos.push(event.coords.latitude);
            App.Global.training.attributes.loc.coordinates.push(pos);
            App.Global.training.attributes.events.push(event);

            if (App.Global.index>0)    {

                /** calcolo training variables **/
                App.Global.secondi_totali = App.Global.secondi_totali + App.Global.speed_timer/1000;
                App.Global.tempo_str = App.Views.Training.prototype.get_elapsed_time_string(App.Global.secondi_totali);
                App.Global.minuti_totali = Math.floor(App.Global.secondi_totali / 60);

                //CALORIE = ORE * PESO * MET
                /*
                 calorie =  Math.round ((minuti_totali / 60) * user.attributes.story_weight[user.attributes.story_weight.length - 1].weight * training.attributes.activity_value);
                 gr_persi = Math.round (calorie/8);
                 */

                App.Global.velocita_istantanea_ms = Math.round(event.coords.speed);             //velocità del gps in m/s
                App.Global.somma_velocita_istantanea_ms = App.Global.somma_velocita_istantanea_ms + App.Global.velocita_istantanea_ms;
                App.Global.velocita_media_ms = Math.round( App.Global.somma_velocita_istantanea_ms / App.Global.index);

                App.Global.velocita_istantanea_kmh = Math.round(event.coords.speed * 3.6);      //moltiplico per 3.6 per sapere i Km/h
                App.Global.velocita_media_kmh = Math.round(App.Global.velocita_media_ms * 3.6);

                App.Global.distance_two_point_km = App.Views.Training.prototype.getDistanceFromLatLonInKm(  App.Global.training.attributes.events[App.Global.training.attributes.events.length - 2].coords.latitude,
                    App.Global.training.attributes.events[App.Global.training.attributes.events.length - 2].coords.longitude,
                    App.Global.training.attributes.events[App.Global.training.attributes.events.length - 1].coords.latitude,
                    App.Global.training.attributes.events[App.Global.training.attributes.events.length - 1].coords.longitude
                );      // in Km

                App.Global.total_distance_km = App.Global.total_distance_km + App.Global.distance_two_point_km;
                App.Global.total_distance_km = Math.round(App.Global.total_distance_km * 1000) / 1000;
                App.Global.total_distance_m  = App.Global.total_distance_km * 1000;
                App.Global.total_distance_str = App.Global.total_distance_km.toString().replace('.', ',');

                //CALORIE = PESO * KM
                App.Global.calorie =  Math.round ( App.Global.user.attributes.story_weight[ App.Global.user.attributes.story_weight.length - 1].weight * App.Global.total_distance_km);
                App.Global.gr_persi = Math.round((App.Global.calorie / 2 ) / 9);
            }

            /** training values to model **/
            App.Global.training.attributes.total_event = App.Global.index;
            App.Global.training.attributes.total_meters = App.Global.total_distance_m;
            App.Global.training.attributes.speed_average_ms = App.Global.velocita_media_ms;
            App.Global.training.attributes.speed_average_kmh = App.Global.velocita_media_kmh;
            App.Global.training.attributes.duration_sec = App.Global.secondi_totali;
            App.Global.training.attributes.duration_min = App.Global.minuti_totali;
            App.Global.training.attributes.duration_str = App.Global.tempo_str;
            App.Global.training.attributes.burned_calories = App.Global.calorie;
            App.Global.training.attributes.lose_gr = App.Global.gr_persi;

            /** refresh training values **/
            $("#durata").text(App.Global.tempo_str);
            $("#distanza_percorsa").text(App.Global.total_distance_str);
            $("#velms").text(App.Global.velocita_istantanea_ms);
            $("#velkmh").text(App.Global.velocita_istantanea_kmh);
            $("#velmediams").text(App.Global.velocita_media_ms);
            $("#velmediakmh").text(App.Global.velocita_media_kmh);
            $("#cal").text(App.Global.calorie);
            $("#gr").text(App.Global.gr_persi);

            App.Global.index++;
        }
    },

    /** no gps location **/
    noLocation: function(error)	{
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    },

    /** emulate training **/
    emulation: function(event) {

        App.Global.timer = setInterval(function() {
            (App.Global.i_emulation < event.event.length) ? App.Views.Training.prototype.refreshUI(event.event[App.Global.i_emulation]) : clearInterval(App.Global.timer);
        }, App.Global.speed_timer);

    },

    /** second to string 00:00:00 **/
    get_elapsed_time_string: function(total_seconds) {
        function pretty_time_string(num) {
            return ( num < 10 ? "0" : "" ) + num;
        }

        var hours = Math.floor(total_seconds / 3600);
        total_seconds = total_seconds % 3600;

        var minutes = Math.floor(total_seconds / 60);
        total_seconds = total_seconds % 60;

        var seconds = Math.floor(total_seconds);

        // Pad the minutes and seconds with leading zeros, if required
        hours = pretty_time_string(hours);
        minutes = pretty_time_string(minutes);
        seconds = pretty_time_string(seconds);

        // Compose the string for display
        var currentTimeString = hours + ":" + minutes + ":" + seconds;

        return currentTimeString;
    },

    /** calculate distance between two point **/
    getDistanceFromLatLonInKm: function(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2-lon1);
        var a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                        Math.sin(dLon/2) * Math.sin(dLon/2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        return d;
    },

    deg2rad: function(deg) {
        return deg * (Math.PI/180)
    }

});




