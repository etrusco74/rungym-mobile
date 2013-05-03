/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 */
App.Views.Logout = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('Initializing Logout View');
        this.load();
        this.render();
    },

    /** reload user data and destroy it **/
    load: function() {
        App.Models.User.load(function() {
            if (App.Models.User.all().length != 0) {
                App.Global.user = App.Models.User.first();
                App.Global.user.destroy();
            }
        });

        App.Models.Activities.load(function() {
            if (App.Models.Activities.all().length != 0) {
                App.Global.activities = App.Models.Activities.first();
                App.Global.activities.destroy();
            }
        });
    },

    /** back to index **/
    render: function() {
        Backbone.history.navigate('#');
        window.location.reload();
    }
});