/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.07
 * To change this template use File | Settings | File Templates.
 */
App.Models.Activities = Model("activities", function() {
    this.persistence(Model.localStorage)
});

App.Models.Activities.load(function() {
    if (App.Models.Activities.all().length == 0) {
        $.getJSON(App.Const.apiurl() + "activities",
            function (data) {
                App.Global.activities = new App.Models.Activities(data);
                App.Global.activities.save();
            });
    }
});
