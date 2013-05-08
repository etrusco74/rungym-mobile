/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 *
 */
App.Views.Dashboard = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('Initializing Dashboard View');
        this.render();
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template({name : App.Models.User.first().attributes.first_name}));
        if ( App.Models.Training.all().length == 0) {this.$("#trasf").remove();}
        return this;
    }
});