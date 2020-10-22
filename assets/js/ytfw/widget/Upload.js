/**
 * @Desc 文件上传
 */
(function() {
	var id = '';
	var me = YT.Upload = {
		/**
		 * 文件上传
		 * 
		 * @param panel
		 * @param app
		 * @param params
		 * @returns {Boolean}
		 */
		init : function(panel, app, params) {
			me.initImgUploadTemp(panel, app, params); // 图片上传
		},
		/**
		 * 图片上传
		 * 
		 * @param panel
		 *            data-maxNum --最大上传数 <br>
		 *            data-maxSize --最大上传尺寸 <br>
		 *            data-compress --是否压缩 <br>
		 *            data-url --上传地址 <br>
		 *            data-callback --上传成功回调
		 * @param app
		 * @param params
		 * 
		 */
		initImgUploadTemp : function(panel, app, params) {
			var uploadImg = panel.find('.y-upload-img'); // 获取图片上传组件
			if (uploadImg.length == 0) {
				return false;
			}
			seajs.use('assets/js/plugin/jquery/ajaxfileupload.min.js', function() {
				me.initImgUpload(panel, app, params);
			});
		},
		initImgUpload : function(panel, app, params) {
			var uploadImg = panel.find('.y-upload-img'); // 获取图片上传组件
			me.uploadImg = uploadImg;
			var upload = uploadImg.find('.ui-upload [type=file]');
			var maxNum = uploadImg.attr('data-maxNum'); // 获取最大上传数
			var maxSize = uploadImg.attr('data-maxSize');// 获取最大上传尺寸
			var compress = uploadImg.attr('data-compress'); // 是否压缩
			var module = uploadImg.attr('data-module'); // 图片上传模式
			maxSize = YT.isEmpty(maxSize) ? 1024 : maxSize;
			me.compress = YT.isEmpty(compress) ? '' : compress;
			me.maxNum = YT.isEmpty(maxNum) ? 3 : maxNum;
			me.curMaxNum = 0;
			me.module = module;
			uploadImg.on('click', '.ui-upload-close', function() {
				me.closeUpload($(this));
			});
			uploadImg.on('click', '[data-event=fileUpload]', function() {
				me.fileUpload(app);
			});
			uploadImg.on('click', '[data-event=filePreview]', function() {
				me.filePreview($(this));
			});
			upload.on('change', function() {
				me.thatImg = $(this);
				var ele = $(this)[0];
				var file = ele.files[0];
				// 检查文件类型
				if ([ 'jpeg', 'png', 'gif', 'jpg' ].indexOf(file.type
						.split("/")[1]) < 0) {
					YT.showTips('文件类型仅支持 jpeg/jpg/png/gif！');
					return;
				}
				// 文件大小限制
				if (file.size > maxSize * 1024) {
					// 文件大小自定义限制
					YT.showTips('文件大小不能超过:' + maxSize + 'K');
					return;
				}
				me.imgType = file.type || 'image/jpeg'; // 部分安卓出现获取不到type的情况
				me.buildLoading(file, uploadImg);
			});
		},
		/**
		 * 上传
		 * 
		 * @param app
		 */
		fileUpload : function(app) {
			var upload = me.uploadImg.find('.img-upload[type=file]');
			var id_arr = [];
			$.each(upload, function(i, n) {
				id_arr[i] = $(n).attr('id');
			});
			var url = me.uploadImg.attr('data-url');
			url = YT.isEmpty(url) ? "file/upload" : url;
			var tranUrl = YT.dataUrl(url);
			$
					.ajaxFileUpload({
						url : tranUrl,
						secureuri : false,
						dataType : 'text',// 返回数据的类型
						data : {
							module : me.module
						},
						fileElementId : id_arr,// file标签的id,数组
						success : function(text) {
							YT.log.info("upload reponse :", text);
							try {
								var data = YT.JsonEval(text);
								if (data && data.STATUS == "1") {
									var evtName = me.uploadImg
											.attr('data-callback');
									app[evtName] && app[evtName](data);
								} else {
									YT.alertinfo((data && data.MSG) || "上传失败！",
											"系统提示");
								}
							} catch (e) {
								YT.alertinfo("上传失败！", "系统提示");
							}
						}
					});
		},
		/**
		 * 生成loading区域
		 * 
		 * @param file
		 *            图片文件
		 * @param uploadImg
		 */
		buildLoading : function(file, uploadImg) {
			var select = me.thatImg.parent().parent();
			id = YT.id();
			var html = '<div class="ui-upload-item">'
					+ '<i class="ui-upload-close" data-id='
					+ me.thatImg.attr('id') + '></i>'
					+ '<div class="ui-upload">' + '<div>'
					+ '<i class="ui-upload-loding"></i>'
					+ '<div class="ui-upload-text">加载中...</div>' + '</div>'
					+ '</div>' + '</div>';
			var loading = $(html);
			select.before(loading);
			me.loading = loading;
			me.fileToDataUrl(file);
			me.curMaxNum++;
			me.judgePanel();
		},
		/**
		 * 图片转base64
		 * 
		 * @param file
		 *            图片文件
		 */
		fileToDataUrl : function(file) {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			// file转dataUrl是个异步函数，要将代码写在回调里
			reader.onload = function(e) {
				var result = e.target.result;
				if (me.compress == 'compress') {
					me
							.compressHandler(
									result,
									function(imgData) {
										var img = me.loading
												.html('<i class="ui-upload-close" data-id="'
														+ me.thatImg.attr('id')
														+ '"></i><div class="ui-upload-info"><img data-id="'
														+ id
														+ '" data-event="filePreview" alt="" src="'
														+ imgData + '"></div>');
										YT.log.info('图片加载成功!');
										var tplFile = me.thatImg.clone();
										tplFile.attr('id', id);
										tplFile.attr('name', id);
										tplFile.attr('class', 'img-upload');
										me.loading.append(tplFile);
										if (me.loading) {
											me.loading = null;
										}
										if (me.thatImg) {
											me.thatImg.val('');
										}
									});
				}
			};
			reader.onerror = function() {
				if (me.loading) {
					me.loading.remove();
				}
				me.curMaxNum--;
				me.judgePanel();
				YT.log.info('图片加载失败!');
				me.loading = null;
			};
		},
		/**
		 * 使用canvas绘制图片并压缩
		 * 
		 * @param dataURL
		 *            图片路径
		 * @param callback
		 *            回调函数
		 */
		compressHandler : function(dataURL, callback) {
			var img = new window.Image();
			img.src = dataURL;
			img.onload = function() {
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');

				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
				var compressedDataUrl;
				compressedDataUrl = canvas.toDataURL(me.imgType, 0.2);

				callback(compressedDataUrl);
			}
		},
		/**
		 * 删除上传图片
		 * 
		 * @param ele
		 *            删除按钮元素
		 */
		closeUpload : function(ele) {
			ele.parent().remove();
			me.abortHandler();
			me.curMaxNum--;
			var closeId = $(ele).attr('data-id');
			$('#' + closeId).parent().parent().show();
		},
		/**
		 * 中断图片上传
		 */
		abortHandler : function() {
			if (me.reader) {
				me.reader.abort();
				YT.showTips('图片上传中断!');
			}
		},
		judgePanel : function() {
			var select = me.uploadImg.find('.ui-upload-select');
			if (me.curMaxNum >= me.maxNum) {
				select.hide();
			} else {
				select.show();
			}
			if (select.length > 1) {
				me.thatImg.parent().parent().hide();
			}
		},
		/**
		 * 图片预览
		 * 
		 * @param thizz
		 *            图片元素
		 */
		filePreview : function(thizz) {
			var tpl = ''
					+ '<div class="ui-upload-preview" id="yt-upload-preview">'
					+ '	<div class="ui-upload-preview-mask" data-event="preview-hide"></div>'
					+ '	<div class="ui-upload-preview-img">'
					+ '		<i class="close" data-id="${ID}" data-event="preview-del"></i>'
					+ '		<img src="${SRC}">' + '	</div>' + '</div>';
			var body = $('#mainBody');
			body.css('overflow', 'hidden');
			body.append(YT.template(tpl, {
				SRC : thizz.attr('src'),
				ID : thizz.attr('data-id')
			}));

			var uploadPreView = $('#yt-upload-preview');
			uploadPreView.on('click', '[data-event=preview-hide]', function() {
				uploadPreView.remove();
				body.css('overflow', 'auto');
			});
			uploadPreView.on('click', '[data-event=preview-del]', function() {
				var id = $(this).attr('data-id');
				$('#' + id).parent().remove();
				uploadPreView.remove();
				me.curMaxNum--;
				me.judgePanel();
			});
		}

	};
}());
