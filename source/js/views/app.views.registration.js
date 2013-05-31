/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 */
app.views.registration = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing registration view');
    },

    /** submit event for registration **/
    events: {
        'submit':                           'registration',
        'click #btnRegistrationHome':       'registration_home'
    },

    registration_home: function() {
        app.routers.router.prototype.index();
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());

        /** validate form **/
        this.$("#registrationForm").validate({
            rules: {
                first_name: "required",
                last_name: "required",
                username: {
                    required: true,
                    maxlength: 12
                },
                password: {
                    required: true,
                    maxlength: 12
                },
                repassword: {
                    required: true,
                    maxlength: 12,
                    equalTo: "#password"
                },
                email: {
                    required: true,
                    email: true
                },
                registration_weight : {
                    required: true,
                    number: true,
                    min: 30
                },
                born_date : {
                    required : true,
                    date: true
                },
                gender: {
                    required : true,
                    minlength: 1
                }
            },
            messages: {
                first_name: "Campo obbligatorio",
                last_name: "Campo obbligatorio",
                username: "Campo obbligatorio",
                password: {
                    required: "Campo obbligatorio",
                    maxlength: "Massimo 12 caratteri"
                },
                repassword: {
                    required: "Campo obbligatorio",
                    maxlength: "Massimo 12 caratteri",
                    equalTo: "Le due password non coincidono"
                },
                email: {
                    required: "Campo obbligatorio",
                    email: "Inserisci una email valida"
                },
                registration_weight : {
                    required: "Campo obbligatorio",
                    number: "Inserisci il tuo peso (solo numero)",
                    min: "Pesi cosi poco?"
                },
                born_date : {
                    required : "Campo obbligatorio",
                    date: "Inserisci una data valida mm/dd/yyyy (Es. 12/31/1974)"
                },
                gender: {
                    required : "Seleziona il sesso",
                    minlength: "Seleziona il sesso"
                }
            }
        });
        return this;
    },

    /** registration **/
    registration: function (event) {
        event.preventDefault();

        var xhr = $.ajax({
            type: "POST",
            url: app.const.apiurl() + "user",
            data: this.registration_formToModel(),
            crossDomain: true,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
            dataType: "json",
            contentType: 'application/json'
        });

        xhr.done(function(data, textStatus, jqXHR) {
            if (data.success) {
                var _model = new app.models.user(data.user);
                app.global.usersCollection.add(_model);
                _model.save();

                alert('registrazione effettuata correttamente');
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

    /** render registration form data to user model **/
    registration_formToModel: function() {
        var jsonObj = {};
        jsonObj = JSON.stringify({
            "first_name": $('#first_name').val(),
            "last_name": $('#last_name').val(),
            "username": $('#username').val(),
            "password": $('#password').val(),
            "email": $('#email').val(),
            "registration_weight": $('#registration_weight').val(),
            "born_date": $('#born_date').val(),
            "gender":$('#gender').val()
        });
        return jsonObj;
    }
});
