/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 *
 */
App.Views.Index = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('Initializing Index View');
        this.load();
        this.render();
    },

    /** reload activity data if he has not performed logout **/
    load: function() {
        App.Models.Activities.load(function() {
            if (App.Models.Activities.all().length == 0) {
                $.getJSON(App.Const.apiurl() + "activities",
                    function (data) {
                        App.Global.activities = new App.Models.Activities(data);
                        App.Global.activities.save();
                    });
            }
        });
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());
        this.$('#version').text('Versione ' + App.Const.version);
        return this;
    }
});