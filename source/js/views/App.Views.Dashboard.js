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
        this.load();
        this.render();
    },

    /** reload user data if he has not performed logout and training data if he has not been transferred **/
    load: function() {

        App.Models.User.load(function() {
            if (App.Models.User.all().length == 0) {
                alert('è necessario effettuare il login');
                Backbone.history.navigate('#login');
                window.location.reload();
            }
            else {
                App.Global.user = App.Models.User.first();
            }
        });

        App.Models.Training.load(function() {
            if ( App.Models.Training.all().length > 0) {
                if (confirm('Attenzione! ci sono ancora ' +  App.Models.Training.all().length +' allenamenti da trasferire sul server centrale. Vuoi farlo ora?')) {
                    Backbone.history.navigate('#send');
                    window.location.reload();
                }
            }
        });
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template({name : App.Global.user.attributes.first_name}));
        if ( App.Models.Training.all().length == 0) {this.$("#trasf").remove();}
        return this;
    }
});