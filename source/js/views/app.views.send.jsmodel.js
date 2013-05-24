/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 *
 */
app.views.send = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing send view');
        this.load();
    },

    /** click event for start training **/
    events: {
        'click #btnSend':           'send',
        'click #btnDelete':         'send_delete',
        'click #btnDashboard':      'send_dashboard'
    },

    send_dashboard: function() {
        app.routers.router.prototype.dashboard();
    },

    /** reload activity and user data if he has not performed logout **/
    load: function() {
        app.global.userModel = app.models.user.first();
        app.global.trainingModel = app.models.training.last();
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());
        if ( app.models.training.all().length > 0) {
            this.$("#btnSend").html('trasferisci ('+app.models.training.all().length+')');
            this.$("#btnDelete").html('elimina ('+app.models.training.all().length+')');
        }
        else {
            app.routers.router.prototype.dashboard();
        }
        return this;
    },

    send: function() {
        var xhr = $.ajax({
            type: "POST",
            url: app.const.apiurl() + "training",
            data: JSON.stringify(app.global.trainingModel.attributes),
            crossDomain: true,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "authkey" : app.global.userModel.attributes.auth.authkey
            },
            dataType: "json",
            contentType: 'application/json'
        });

        xhr.done(function(data, textStatus, jqXHR) {
            if (data.success) {
                app.global.trainingModel.destroy();
                alert('Allenamento trasferito');
                app.routers.router.prototype.dashboard();
            }
            else {
                alert('error: ' + data.error);
            }
        });

        xhr.fail(function(jqXHR, textStatus) {
            alert('error: ' + textStatus);
        });
    },

    send_delete: function() {
        app.global.trainingModel.destroy();
        app.routers.router.prototype.send();
    },

    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        app.global.sendView = null;
    }
});
