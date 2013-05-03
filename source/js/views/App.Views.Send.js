/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 *
 */
App.Views.Send = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('Initializing Send View');
        this.load();
        this.render();
    },

    /** click event for start training **/
    events: {
        'click #btnSend':       'send',
        'click #btnDelete':     'delete'
    },

    /** reload activity and user data if he has not performed logout **/
    load: function() {

        App.Models.User.load(function() {
            App.Global.user = App.Models.User.first();
        });

        App.Models.Training.load(function() {
            App.Global.training = App.Models.Training.last();
        });
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());
        if ( App.Models.Training.all().length > 0) {
            this.$("#btnSend").html('trasferisci ('+App.Models.Training.all().length+')');
            this.$("#btnDelete").html('elimina ('+App.Models.Training.all().length+')');
        }
        else {
            this.$("#send").remove();
            this.$("#del").remove();
        }
        return this;
    },

    send: function() {
        var xhr = $.ajax({
            type: "POST",
            url: App.Const.apiurl() + "training",
            data: JSON.stringify(App.Global.training.attributes),
            crossDomain: true,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "authkey" : App.Global.user.attributes.auth.authkey
            },
            dataType: "json",
            contentType: 'application/json'
        });

        xhr.done(function(data, textStatus, jqXHR) {
            if (data.success) {
                App.Global.training.destroy();
                alert('Allenamento trasferito');
                Backbone.history.navigate('#dashboard');
                window.location.reload();
            }
            else {
                alert('error: ' + data.error);
            }
        });

        xhr.fail(function(jqXHR, textStatus) {
            alert('error: ' + textStatus);
        });
    },

    delete: function() {
        App.Global.training.destroy();
        window.location.reload();
    }
});