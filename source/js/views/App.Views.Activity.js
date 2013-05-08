/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 *
 */
App.Views.Activity = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('Initializing Activity View');
        this.render();
    },

    /** click event for start training **/
    events: {
        'click #btnGo':   'start_training'
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
            App.Routers.Router.prototype.training(activity);
            //Backbone.history.navigate('#training/' + activity);
            //window.location.reload();
        }
    },

    /** render activities model data to select **/
    activity_modelToForm: function() {
        var data =  App.Models.Activities.first().attributes;
        for( var i=0 in data ) {
            this.$('#activity')
                .append($("<option></option>")
                    .attr("value",data[i]._id)
                    .text(data[i].description));
        }
    }
});