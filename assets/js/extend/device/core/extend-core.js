$(function() {
	var TAG = "extend-YT:YT";
	/**
	 * @fileOverview 客户端交互方法定义（ios与android相同）自定义扩展
	 * @nameSpace YT.Client(client)
	 */
	var me = {
	/**
	 * @description 自定义获取系统时间的接口名称,<br>
	 *              各系统自行开发相关的服务系统日期查询接口，各系统通讯连接网关时，不可使用"common/sysDate"命名<br>
	 *              CUR_TIME:系统时间，CUR_DATE:系统日期
	 */
	// sysDateUrl : 'common/sysChnlDate',
	/**
	 * @description 自定义键盘高度，原生键盘弹出，页面偏移高度设置
	 */
	// KeyBoardHight : 300
	};
	YT.apply(YT, me);

});
