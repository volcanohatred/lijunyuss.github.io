define(function (require, exports) {
    var PID = "#p_financial_01";
    var TAG = "page/financial/01/";
    var panel, pageA;
    var me = {
        init: function () {
            panel = $(PID);
            pageA = panel.find('[data-page="A"]');
            me.showPageA();
            var pageHeight = pageA.height();
            $('html,body').css('height', pageHeight);
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