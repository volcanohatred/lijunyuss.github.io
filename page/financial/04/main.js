define(function (require, exports) {
    var PID = "#p_financial_04";
    var TAG = "page/financial/04/";
    var panel, pageA;
    var me = {
        init: function () {
            panel = $(PID);
            pageA = panel.find('[data-page="A"]');
            me.showPageA();
            YT.initPageEvent(panel, me);
        },
        toDetail: function () {
            // location.href = 'https://www.baidu.com'
        },
        showPageA: function () {
            YT.showPageArea(pageA, [], false);
        }
    }
    exports.init = me.init;
});