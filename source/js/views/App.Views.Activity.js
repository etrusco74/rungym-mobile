/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 *
 */
app.views.activity = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing activity view');
    },

    /** click event for start training **/
    events: {
        'click #btnGo':             'start_training',
        'click #btnDashboard':      'activity_dashboard'
    },

    activity_dashboard: function() {
        app.routers.router.prototype.dashboard();
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());
        this.activity_modelToForm();
        return this;
    },

    start_training: function() {
        if (this.$("#activity").val() == 0)
            alert("selezionare l'attività sportiva");
        else    {
            var activity = this.$("#activity :selected").val();
            app.routers.router.prototype.training(activity);
        }
    },

    /** render activities model data to select **/
    activity_modelToForm: function() {
        var data =  app.models.activities.first().attributes;
        for( var i=0 in data ) {
            this.$('#activity')
                .append($("<option></option>")
                    .attr("value",data[i]._id)
                    .text(data[i].description));
        }
    },
    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        app.global.activityView = null;
    }
});