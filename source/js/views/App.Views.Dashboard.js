/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 *
 */
app.views.dashboard = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing dashboard view');
    },

    /** dashboard event **/
    events: {
        'click #btnAllenamento':        'dashboard_training',
        'click #btnProfilo':            'dashboard_profile',
        'click #btnTrasferimento':      'dashboard_send',
        'click #btnLogout':             'dashboard_logout'
    },

    dashboard_training: function() {
        app.routers.router.prototype.activity();
    },
    dashboard_profile: function() {
        app.routers.router.prototype.profile();
    },
    dashboard_send: function() {
        app.routers.router.prototype.send();
    },
    dashboard_logout: function() {
        app.routers.router.prototype.logout();
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template({name : app.models.user.first().attributes.first_name}));
        if ( app.models.training.all().length == 0) {this.$("#trasf").remove();}
        return this;
    },

    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        app.global.dashboardView = null;
    }
});