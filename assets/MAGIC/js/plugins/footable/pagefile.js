/**
2016-09-11 Mustang guo
会自动添加分页样式
分页按钮的根节点的class="tcdPageCode"
使用方法
$(selector).createPage({
	pageCount : 10,
	current : 1,
	backFn : function(page_number){

	}
})
**/
(function($){
	var ms = {
		init:function(obj,args){
			return (function(){
				ms.fillHtml(obj,args);
                ms.bindEvent(obj,args);
			})();
		},
		//填充html
		fillHtml:function(obj,args){
			return (function(){
				obj.empty();
				//上一页
				if(args.current > 1){
					obj.append('<a href="javascript:;" class="prevPage">上一页</a>');
				}else{
					obj.remove('.prevPage');
					obj.append('<span class="disabled">上一页</span>');
				}
				//中间页码
				if(args.current != 1 && args.current >= 4 && args.pageCount != 4){
					obj.append('<a href="javascript:;" class="tcdNumber">'+1+'</a>');
				}
				if(args.current-2 > 2 && args.current <= args.pageCount && args.pageCount > 5){
					obj.append('<span>...</span>');
				}
				var start = args.current -2,end = args.current+2;
				if((start > 1 && args.current < 4)||args.current == 1){
					end++;
				}
				if(args.current > args.pageCount-4 && args.current >= args.pageCount){
					start--;
				}
				for (;start <= end; start++) {
					if(start <= args.pageCount && start >= 1){
						if(start != args.current){
							obj.append('<a href="javascript:;" class="tcdNumber">'+ start +'</a>');
						}else{
							obj.append('<span class="current">'+ start +'</span>');
						}
					}
				}
				if(args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5){
					obj.append('<span>...</span>');
				}
				if(args.current != args.pageCount && args.current < args.pageCount -2  && args.pageCount != 4){
					obj.append('<a href="javascript:;" class="tcdNumber">'+args.pageCount+'</a>');
				}
				//下一页
				if(args.current < args.pageCount){
					obj.append('<a href="javascript:;" class="nextPage">下一页</a>');
				}else{
					obj.remove('.nextPage');
					obj.append('<span class="disabled">下一页</span>');
				}
			})();
		},
		//绑定事件
		bindEvent:function(obj,args){
			return (function(){
				// obj.on("click","a.tcdNumber",function(){
				// 	var current = parseInt($(this).text());
				// 	ms.fillHtml(obj,{"current":current,"pageCount":args.pageCount});
				// 	if(typeof(args.backFn)=="function"){
				// 		args.backFn(current);
				// 	}
				// });
                $(obj).find('.tcdNumber').off("click").on("click", function () {
                    var current = parseInt($(this).text());
                    ms.fillHtml(obj, { "current": current, "pageCount": args.pageCount });
                    if (typeof (args.backFn) == "function") {
                        args.backFn(current);
                        ms.bindEvent(obj, args);
                    }
                });
				//上一页
				// obj.on("click","a.prevPage",function(){
				// 	var current = parseInt(obj.children("span.current").text());
				// 	ms.fillHtml(obj,{"current":current-1,"pageCount":args.pageCount});
				// 	if(typeof(args.backFn)=="function"){
				// 		args.backFn(current-1);
				// 	}
				// });
                $(obj).find('.prevPage').off('click').on("click", function () {
                    var current = parseInt(obj.children("span.current").text());
                    ms.fillHtml(obj, { "current": current - 1, "pageCount": args.pageCount });
                    if (typeof (args.backFn) == "function") {
                        args.backFn(current - 1);
                        ms.bindEvent(obj, args);
                    }
                });
				//下一页
				// obj.on("click","a.nextPage",function(){
				// 	var current = parseInt(obj.children("span.current").text());
				// 	ms.fillHtml(obj,{"current":current+1,"pageCount":args.pageCount});
				// 	if(typeof(args.backFn)=="function"){
				// 		args.backFn(current+1);
				// 	}
				// });
                $(obj).find('.nextPage').off('click').on("click", function () {
                    var current = parseInt(obj.children("span.current").text());
                    ms.fillHtml(obj, { "current": current + 1, "pageCount": args.pageCount });
                    if (typeof (args.backFn) == "function") {
                        args.backFn(current + 1);
                        ms.bindEvent(obj, args);
                    }
                });
			})();
		}
	}
	$.fn.createPage = function(options){
		var args = $.extend({
			pageCount : 10,
			current : 1,
			backFn : function(page_number){
			}
		},options);
		ms.init(this,args);
	}
	//给当前文档加入css样式
	function addCssByStyle(cssString){
	    var doc=document;
	    var style=doc.createElement("style");
	    style.setAttribute("type", "text/css");

	    if(style.styleSheet){// IE
	        style.styleSheet.cssText = cssString;
	    } else {// w3c
	        var cssText = doc.createTextNode(cssString);
	        style.appendChild(cssText);
	    }

	    var heads = doc.getElementsByTagName("head");
	    if(heads.length)
	        heads[0].appendChild(style);
	    else
	        doc.documentElement.appendChild(style);
	}

	var cssString ="";
	cssString += ".tcdPageCode{padding: 15px 20px;text-align: center;color: #ccc; font-size: 12px;}";
	cssString += ".tcdPageCode a{display: inline-block;color: #428bca;display: inline-block;height: 25px;     font-size: 12px;	line-height: 25px;	padding: 0 10px;border: 1px solid #ddd;	margin: 0 2px;border-radius: 4px;vertical-align: middle;}";
	cssString += ".tcdPageCode a:hover{text-decoration: none;border: 1px solid #428bca;}";
	cssString += ".tcdPageCode span.current{display: inline-block;height: 25px;line-height: 25px;padding: 0 10px;margin: 0 2px;color: #fff;background-color: #428bca;	border: 1px solid #428bca;border-radius: 4px;vertical-align: middle; font-size: 12px;}";
	cssString += ".tcdPageCode span.disabled{	display: inline-block;height: 25px;line-height: 25px;padding: 0 10px;margin: 0 2px;	color: #bfbfbf;background: #f2f2f2;border: 1px solid #bfbfbf;border-radius: 4px;vertical-align: middle; font-size: 12px;}";
	addCssByStyle(cssString);
})(jQuery);