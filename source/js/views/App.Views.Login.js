/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 */
App.Views.Login = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('Initializing Login View');
        this.render();
    },

    /** submit event for login **/
    events: {
        'submit':   'login'
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());

        /** validate form **/
        this.$("#loginForm").validate({
            rules: {
                username: {
                    required: true,
                    maxlength: 12
                },
                password: {
                    required: true,
                    maxlength: 12
                }
            },
            messages: {
                username: "Campo obbligatorio",
                password: {
                    required: "Campo obbligatorio",
                    maxlength: "Massimo 12 caratteri"
                }
            }
        });
        return this;
    },

    /** login **/
    login: function (event) {

        event.preventDefault();

        var xhr = $.ajax({
            type: "POST",
            url: App.Const.apiurl() + "login",
            data: this.login_formToModel(),
            crossDomain: true,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
            dataType: "json",
            contentType: 'application/json'
        });

        xhr.done(function(data, textStatus, jqXHR) {
            if (data.success) {
                App.Global.user = new App.Models.User(data.user);
                App.Global.user.save();
                App.Routers.Router.prototype.dashboard();
                //Backbone.history.navigate('#dashboard');
                //window.location.reload();
            }
            else {
                alert('error: ' + data.error);
            }
        });

        xhr.fail(function(jqXHR, textStatus) {
            alert('error: ' + textStatus);
        });

    },

    /** render login form data to user model **/
    login_formToModel: function() {
        var jsonObj = {};
        jsonObj = JSON.stringify({
            "username": $('#username').val(),
            "password": $('#password').val()
        });
        return jsonObj;
    }
});