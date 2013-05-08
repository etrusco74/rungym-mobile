/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 02/05/13
 * Time: 16.45
 * To change this template use File | Settings | File Templates.
 */
App.Views.Profile = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('Initializing Profile View');
        this.load();
        this.render();
    },

    /** submit event for update **/
    events: {
        'submit':   'update_profile'
    },

    /** reload user data if he has not performed logout **/
    load: function() {
        App.Models.User.load(function() {
            App.Global.user = App.Models.User.first();
        });
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());
        /** validate form **/
        this.$("#profileForm").validate({
            rules: {
                first_name: "required",
                last_name: "required",
                email: {
                    required: true,
                    email: true
                },
                story_weight : {
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
                email: {
                    required: "Campo obbligatorio",
                    email: "Inserisci una email valida"
                },
                story_weight : {
                    required: "Campo obbligatorio",
                    number: "Inserisci il tuo peso attuale (solo numero)",
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
        this.profile_modelToForm();
        return this;
    },

    /** update profile **/
    update_profile: function (event) {
        event.preventDefault();

        if (confirm('confermi di voler aggiornare il tuo profilo?'))    {
            var xhr = $.ajax({
                type: "PUT",
                url: App.Const.apiurl() + "user/id/" + App.Models.User.first().attributes._id,
                data: this.profile_formToModel(),
                crossDomain: true,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "authkey" : App.Models.User.first().attributes.auth.authkey
                },
                dataType: "json",
                contentType: 'application/json'
            });

            xhr.done(function(data, textStatus, jqXHR) {
                if (data.success) {
                    App.Models.User.first().attributes = data.user;
                    alert('profilo aggiornato con successo');
                    App.Routers.Router.prototype.profile();
                    //window.location.reload();
                }
                else {
                    alert('error: ' + data.error);
                }
            });

            xhr.fail(function(jqXHR, textStatus) {
                alert('error: ' + textStatus);
            });
        }
    },

    /** render profile form data to user model **/
    profile_formToModel: function() {
        var jsonObj = {};
        jsonObj.first_name = this.$('#first_name').val();
        jsonObj.last_name = this.$("#last_name").val();
        jsonObj.username = this.$('#username').val();
        jsonObj.email = this.$('#email').val();
        if (App.Models.User.first().attributes.story_weight[App.Models.User.first().attributes.story_weight.length - 1].weight != this.$('#story_weight').val())
            jsonObj.story_weight = this.$('#story_weight').val();
        jsonObj.born_date = this.$('#born_date').val();
        jsonObj.gender = this.$("#gender").val();

        return JSON.stringify(jsonObj);
    },

    /** render user model data to profile form **/
    profile_modelToForm: function() {

        this.$('#_id').val(App.Models.User.first().attributes._id);
        this.$('#first_name').val(App.Models.User.first().attributes.first_name);
        this.$('#last_name').val(App.Models.User.first().attributes.last_name);
        this.$('#username').val(App.Models.User.first().attributes.username);
        this.$('#registration_date').val(App.Models.User.first().attributes.registration_date);
        this.$('#login_date').val(App.Models.User.first().attributes.auth.login_date);
        this.$('#email').val(App.Models.User.first().attributes.email);
        this.$('#registration_weight').val(App.Models.User.first().attributes.registration_weight);
        this.$('#story_weight').val(App.Models.User.first().attributes.story_weight[App.Models.User.first().attributes.story_weight.length - 1].weight);
        this.$('#story_date').val(App.Models.User.first().attributes.story_weight[App.Models.User.first().attributes.story_weight.length - 1].date);
        this.$('#born_date').val(App.Models.User.first().attributes.born_date);
        this.$("#gender").val(App.Models.User.first().attributes.gender).attr('selected',true);
    }
});
