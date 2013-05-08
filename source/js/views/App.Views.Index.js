/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 *
 */
App.Views.Index = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('Initializing Index View');
        this.render();
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());
        this.$('#version').text('Versione ' + App.Const.version);
        return this;
    }
});