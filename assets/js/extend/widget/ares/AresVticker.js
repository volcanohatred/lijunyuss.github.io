/**
 * <code>
 * AresVticker 上下滚动组件
 * 列表必须是ul>li的格式
 *
 * </code>
 */
define(function(require, exports) {
    var TAG = "AresVticker";
    YT.log.debug("---内部组件--init----", TAG);
    // 内部组件不提供外部调用支持
    var me = {};// me为当前控件的函数命名空间
    /**
     * <code>
     * 初始化控件的事件、值、展现等信息
     *
     * @param widget 当前组件
     * @param panel 当前容器作用域，通常为page容器
     * @param app 处理器
     * @param json 数据处理
     * </code>
     */
    me.init = function(widget, panel, app, json) {
        YT.log.info('init begin', TAG);
        widget.vTicker({

            speed: 700,//默认值----滚动持续时间700ms

            pause: 4000,//默认值----滚动间隔4000ms

            showItems: 1,//默认值----每次滚动显示的行数

            animation: "",//默认值----滚动动画，默认为空，可选“fade’即第一行最后一行淡入淡出

            mousePause: true,//默认值----鼠标悬停时不滚动，若改为‘FALSE’鼠标悬停继续滚动

            isPaused: false,//默认值----是否暂停,若改为‘TRUE’后停止滚动

            direction: "up",//默认值----向上滚动，‘down’为向下滚动

            height: 0//默认值----容器高度，默认为 0，即根据 showItems 个数自动计算

        });
        YT.log.info('init finish', TAG);
    };

    /**
     * <code>
     * 重置控件的值、展现等信息，不含事件定义
     *
     * @param widget 当前组件
     * @param panel 当前容器作用域，通常为page容器
     * @param app 处理器
     * @param json 数据处理
     * </code>
     */
    me.reset = function(widget, panel, app, json) {
        YT.log.info('reset begin', TAG);
        YT.log.info('reset finish', TAG);
    };

    // 组件的外置接口
    exports.init = me.init;
    exports.reset = me.reset;

})