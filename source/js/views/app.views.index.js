/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 */
app.views.index = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing index view');
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());
        return this;
    },

    /** click event for start app **/
    events: {
        'click #btnLogin':          'index_login',
        'click #btnRegistrati':     'index_registrazione'
    },

    /** login **/
    index_login: function() {
        app.routers.router.prototype.login();
    },

    /** registration **/
    index_registrazione: function() {
            app.routers.router.prototype.registration();
    }
});
