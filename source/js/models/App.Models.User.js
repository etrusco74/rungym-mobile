/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.07
 * To change this template use File | Settings | File Templates.
 */
App.Models.User = Model("user", function() {
    this.persistence(Model.localStorage)
});

App.Models.User.load(function() {});