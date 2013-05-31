/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.07
 * To change this template use File | Settings | File Templates.
 */
app.collections.trainings = Backbone.Collection.extend({
    initialize: function(){
        console.log("initializing trainings collection");
    },
    model: app.models.training,
    localStorage: new Backbone.LocalStorage("trainings")
});