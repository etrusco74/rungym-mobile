/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.07
 * To change this template use File | Settings | File Templates.
 */
app.collections.activities = Backbone.Collection.extend({
    initialize: function(){
        console.log("initializing activities collection");
    },
    model: app.models.activity,
    url: app.const.apiurl() + "activities"
});