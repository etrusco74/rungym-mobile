/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 02/05/13
 * Time: 16.45
 * To change this template use File | Settings | File Templates.
 */
app.views.profile = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing profile view');
    },

    /** submit event for update **/
    events: {
        'submit':                           'profile_update',
        'click #btnProfileDashboard':       'profile_dashboard'
    },

    profile_dashboard: function() {
        app.routers.router.prototype.dashboard();
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
    profile_update: function (event) {
        event.preventDefault();

        if (confirm('confermi di voler aggiornare il tuo profilo?'))    {
            var xhr = $.ajax({
                type: "PUT",
                url: app.const.apiurl() + "user/id/" + app.global.usersCollection.first().get("_id"),
                data: this.profile_formToModel(),
                crossDomain: true,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "authkey" : app.global.usersCollection.first().get("auth").authkey
                },
                dataType: "json",
                contentType: 'application/json'
            });

            xhr.done(function(data, textStatus, jqXHR) {
                if (data.success) {
                    app.global.usersCollection.first().set(data.user);
                    alert('profilo aggiornato con successo');
                    app.routers.router.prototype.profile();
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
        if (app.global.usersCollection.first().get("story_weight")[app.global.usersCollection.first().get("story_weight").length - 1].weight != this.$('#story_weight').val())
            jsonObj.story_weight = this.$('#story_weight').val();
        jsonObj.born_date = this.$('#born_date').val();
        jsonObj.gender = this.$("#gender").val();

        return JSON.stringify(jsonObj);
    },

    /** render user model data to profile form **/
    profile_modelToForm: function() {
        this.$('#_id').val(app.global.usersCollection.first().get("_id"));
        this.$('#first_name').val(app.global.usersCollection.first().get("first_name"));
        this.$('#last_name').val(app.global.usersCollection.first().get("last_name"));
        this.$('#username').val(app.global.usersCollection.first().get("username"));
        this.$('#registration_date').val(app.global.usersCollection.first().get("registration_date"));
        this.$('#login_date').val(app.global.usersCollection.first().get("auth").login_date);
        this.$('#email').val(app.global.usersCollection.first().get("email"));
        this.$('#registration_weight').val(app.global.usersCollection.first().get("registration_weight"));
        this.$('#story_weight').val(app.global.usersCollection.first().get("story_weight")[app.global.usersCollection.first().get("story_weight").length - 1].weight);
        this.$('#story_date').val(app.global.usersCollection.first().get("story_weight")[app.global.usersCollection.first().get("story_weight").length - 1].date);
        this.$('#born_date').val(app.global.usersCollection.first().get("born_date"));
        this.$("#gender").val(app.global.usersCollection.first().get("gender")).attr('selected',true);
    },

    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        app.global.profileView = null;
    }
});
