/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 *
 */
app.views.training = Backbone.View.extend({

    /** init view **/
    initialize: function(options) {
        console.log('initializing training view');
        this.load();
    },

    /** click event for start training **/
    events: {
        'click #btnStart':      'training_start',
        'click #btnEnd':        'training_end'
    },

    /** load user data and create training **/
    load: function() {

        var activity_id = this.options.opt;

        /** reset global var **/
        app.global.training_active = false;
        app.global.different_latlon = true;
        app.global.i_emulation = 0;

        app.global.index = 0;
        app.global.secondi_totali = 0;
        app.global.minuti_totali = 0;
        app.global.tempo_str = '00:00:00';

        app.global.total_distance_str = '0';
        app.global.total_distance_km = 0;
        app.global.total_distance_m = 0;
        app.global.distance_two_point_km = 0;

        app.global.velocita_istantanea_ms = 0;
        app.global.somma_velocita_istantanea_ms = 0;
        app.global.velocita_media_ms = 0;

        app.global.velocita_istantanea_kmh = 0;
        app.global.velocita_media_kmh = 0;

        app.global.calorie = 0;
        app.global.gr_persi = 0;

        app.global.trainingModel = new app.models.training({
            "username" :  app.global.usersCollection.first().get("username"),
            "activity_id" : activity_id,
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
    training_start: function() {
        var that = this;
        if (app.global.training_active) {
            app.global.training_active = false;
            $("#btnStart").html('riprendi');

            app.global.trainingModel.set("end_date", new Date());
            clearInterval(app.global.timer);
        }
        else    {
            app.global.training_active = true;
            $("#btnStart").html('ferma');

            if (app.global.trainingModel.get("start_date") == "") {
                app.global.trainingModel.set("start_date", new Date());
            }

            if (app.const.debug) {
                $.getJSON(app.const.testJsonUrl, this.emulation);
            }
            else
            {
                app.global.timer = setInterval(function() {
                    //navigator.geolocation.getCurrentPosition(app.views.training.prototype.refreshUI, app.views.training.prototype.noLocation);
                    navigator.geolocation.getCurrentPosition(that.refreshUI, that.noLocation);
                }, app.global.speed_timer);
            }
        }
    },

    /** end training **/
    training_end: function() {
        if (app.global.training_active) {
            app.global.training_active = false;

            app.global.trainingModel.set("end_date", new Date());
            clearInterval(app.global.timer);
        }

        if (app.global.trainingModel.get("events").length > 1) {
            //app.global.trainingsCollection = new app.collections.trainings([app.global.trainingModel]);
            app.global.trainingsCollection.add([app.global.trainingModel]);
            app.global.trainingModel.save();

            app.routers.router.prototype.send();
        }
        else {
            app.global.trainingModel = null;
            app.routers.router.prototype.dashboard();
        }
    },

    /** gps refresh **/
    refreshUI: function(event) {

        if (!(typeof event === 'undefined'))       {

            app.global.i_emulation ++;
            
            /** first event **/
            if (app.global.index==0)    {
                
                /** set lat/lon to json obj **/
                var pos = [];
                pos.push(event.coords.longitude);
                pos.push(event.coords.latitude);
                app.global.trainingModel.get("loc").coordinates.push(pos);
                app.global.trainingModel.get("events").push(event);
                
            }    
            else {
            
                /** verify current and previous lat/lon coordinates **/
                app.global.different_latlon = app.views.training.prototype.is_different_lat_lon(
                        event.coords.latitude,
                        event.coords.longitude,
                        app.global.trainingModel.get("events")[app.global.trainingModel.get("events").length - 1].coords.latitude,
                        app.global.trainingModel.get("events")[app.global.trainingModel.get("events").length - 1].coords.longitude);
                
                /** add event only if current and previous lat/lon are different - fix mongodb spatial error **/
                if (app.global.different_latlon) {
    
                    /** set lat/lon to json obj **/
                    var pos = [];
                    pos.push(event.coords.longitude);
                    pos.push(event.coords.latitude);
                    app.global.trainingModel.get("loc").coordinates.push(pos);
                    app.global.trainingModel.get("events").push(event);
                    
                    app.global.distance_two_point_km = app.views.training.prototype.getDistanceFromLatLonInKm(  app.global.trainingModel.get("events")[app.global.trainingModel.get("events").length - 2].coords.latitude,
                        app.global.trainingModel.get("events")[app.global.trainingModel.get("events").length - 2].coords.longitude,
                        app.global.trainingModel.get("events")[app.global.trainingModel.get("events").length - 1].coords.latitude,
                        app.global.trainingModel.get("events")[app.global.trainingModel.get("events").length - 1].coords.longitude
                    );      // in km
    
                    app.global.total_distance_km = app.global.total_distance_km + app.global.distance_two_point_km;
                    app.global.total_distance_km = Math.round(app.global.total_distance_km * 1000) / 1000;
                    app.global.total_distance_m  = app.global.total_distance_km * 1000;
                    app.global.total_distance_str = app.global.total_distance_km.toString().replace('.', ',');
                    
                }
                
                /** training variables **/
                app.global.secondi_totali = app.global.secondi_totali + app.global.speed_timer/1000;
                app.global.tempo_str = app.views.training.prototype.get_elapsed_time_string(app.global.secondi_totali);
                app.global.minuti_totali = Math.floor(app.global.secondi_totali / 60);

                /*  
                //CALORIE = ORE * PESO * MET
                calorie =  Math.round ((minuti_totali / 60) * user.attributes.story_weight[user.attributes.story_weight.length - 1].weight * training.attributes.activity_value);
                gr_persi = Math.round (calorie/8);
                */

                app.global.velocita_istantanea_ms = Math.round(event.coords.speed);                 //velocità del gps in m/s
                app.global.somma_velocita_istantanea_ms = app.global.somma_velocita_istantanea_ms + app.global.velocita_istantanea_ms;
                app.global.velocita_media_ms = Math.round( app.global.somma_velocita_istantanea_ms / app.global.index );

                app.global.velocita_istantanea_kmh = Math.round(event.coords.speed * 3.6);      //moltiplico per 3.6 per sapere i Km/h
                app.global.velocita_media_kmh = Math.round(app.global.velocita_media_ms * 3.6);

                //CALORIE = PESO * KM
                app.global.calorie =  Math.round ( app.global.usersCollection.first().get("story_weight")[ app.global.usersCollection.first().get("story_weight").length - 1].weight * app.global.total_distance_km);
                app.global.gr_persi = Math.round(( app.global.calorie / 2 ) / 9);
        
            }

            app.global.index++;

            /** training values to model **/
            app.global.trainingModel.set("total_event",  app.global.index);
            app.global.trainingModel.set("total_meters", app.global.total_distance_m);
            app.global.trainingModel.set("speed_average_ms", app.global.velocita_media_ms);
            app.global.trainingModel.set("speed_average_kmh", app.global.velocita_media_kmh);
            app.global.trainingModel.set("duration_sec", app.global.secondi_totali);
            app.global.trainingModel.set("duration_min", app.global.minuti_totali);
            app.global.trainingModel.set("duration_str", app.global.tempo_str);
            app.global.trainingModel.set("burned_calories", app.global.calorie);
            app.global.trainingModel.set("lose_gr", app.global.gr_persi);

            /** refresh training values **/
            $("#durata").text(app.global.tempo_str);
            $("#distanza_percorsa").text(app.global.total_distance_str);
            $("#velms").text(app.global.velocita_istantanea_ms);
            $("#velkmh").text(app.global.velocita_istantanea_kmh);
            $("#velmediams").text(app.global.velocita_media_ms);
            $("#velmediakmh").text(app.global.velocita_media_kmh);
            $("#cal").text(app.global.calorie);
            $("#gr").text(app.global.gr_persi);
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

        app.global.timer = setInterval(function() {
            (app.global.i_emulation < event.event.length) ? app.views.training.prototype.refreshUI(event.event[app.global.i_emulation]) : clearInterval(app.global.timer);
        }, app.global.speed_timer);

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
    },

    /** return true if current and prev coords are different **/
    is_different_lat_lon: function(cur_lat, cur_lon, prev_lat, prev_lon) {
        return ((cur_lat != prev_lat) && (cur_lon != prev_lon));
    },

    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        app.global.trainingView = null;
    }
});




