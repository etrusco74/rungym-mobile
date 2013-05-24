/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.07
 * To change this template use File | Settings | File Templates.
 */
app.models.training = Backbone.Model.extend({
    defaults: {

        "username" :  "",
        "activity_id" : "",

        "total_event": 0,
        "total_meters": 0,
        "speed_average_ms": 0,
        "speed_average_kmh": 0,
        "duration_sec": 0,
        "duration_min": 0,
        "duration_str": "00:00:00",
        "burned_calories": 0,
        "lose_gr": 0,
        "start_date": "",
        "end_date": "",

        "events": [],
        "loc": {
            "type" : "LineString",
            "coordinates" : []
        }
    },
    initialize: function(){
        console.log("initializing training model");
    }

});
