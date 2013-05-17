/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.07
 * To change this template use File | Settings | File Templates.
 */
app.models.activities = Model("activities", function() {
    this.persistence(Model.localStorage)
});

app.models.activities.load(function() {});