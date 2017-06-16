/**
 * 
 * @authors AlenOne (843748862@qq.com)
 * @date    2016-12-19 11:32:07
 * @version $Id$
 */


 

$(function(){
    $('.sidebar .sidebar-list>ul li').on('click',function(){   //侧边栏切换
    		$('.sidebar .sidebar-list>ul li').removeClass('clickbg');
    		$(this).addClass('clickbg');
    		var value = $(this).find('span').html();
    		
    		var li = $('<li onclick="vm.toshow()" class="active" name="'+$(this).attr('name')+'" name="'+$(this).attr('name')+'">'+value+'<i onclick=vm.kill(event)></i></li>');
    		
    		var arr = [];//存放已有界面
    		var list = $('.content-wrapper .content-header ul li');
    		for(var i = 0; i < list.length;i++){
    			arr.push(list.eq(i).text())
    		}
		if(arr.indexOf(value) > -1){ //存在
			if($('.content-wrapper .content-header ul li').length == 10){
				var headwidth = $('.content-wrapper .content-header').width();
				var smallwidth = (headwidth - 142)/9;
				$('.content-wrapper .content-header ul li').css('width',smallwidth-20);
				$('.content-wrapper .content-header ul li[name="'+$(this).attr('name')+'"]').css('width',142);
			}
			$('.content-wrapper .content-header ul li').removeClass('active');
			$('.content-wrapper .content-header ul li[name="'+$(this).attr('name')+'"]').addClass('active');
		}else{
			$('.content-wrapper .content-header ul li').removeClass('active');
    			$('.content-wrapper .content-header ul').append(li);
    			var headwidth = $('.content-wrapper .content-header').width();
			var sumwidth = 142*(list.length+1);
    			if(sumwidth > headwidth){
				var smallwidth = (headwidth - 142)/(list.length);
				$('.content-wrapper .content-header ul li').css('width',smallwidth-20);
				$('.content-wrapper .content-header ul li:last-child').css('width',142);
			}else{
					
			}
		}
		
		
		
    		
    });
	
	//导航栏切换
	
	$(document).on('click','.content-wrapper .content-header ul li',function(){
//		$('.content-wrapper .content-header ul li').removeClass('active');
//		$(this).addClass('active');
//		$('.sidebar .sidebar-list>ul li').removeClass('clickbg');
//		$('.sidebar .sidebar-list>ul li[name='+$(this).attr('name')+']').addClass('clickbg')
	});
	
	function data(time){
				var year = time.getFullYear();
				var month = time.getMonth();
				var day = time.getDate();
				var hours = time.getHours();
				var min = time.getMinutes();
				var sec = time.getSeconds();
				month = Number(month) + 1;
				month = month>9?month:'0'+month;
				day = day>9?day:'0'+day;
				hours = hours>9?hours:'0'+hours;
				min = min>9?min:'0'+min;
				sec = sec>9?sec:'0'+sec;
				
				return year+'-'+month+'-'+day+' '+hours+':'+min+':'+sec
			}
	
	$(document).ready(function(){
			$('#app .main-sidebar').css('height',$(window).height()-70);
			$('#app .content-wrapper').css('height',$(window).height()-70);
			$('#app .mask').css('height',$(window).height()-60);
		
		$(window).resize(function() {
			$('#app .main-sidebar').css('height',$(window).height()-70);
			$('#app .content-wrapper').css('height',$(window).height()-70);
			$('#app .mask').css('height',$(window).height()-60);
		});

		$(window).off('click').on('click',function(){
			$('.mask').css("right",'-300px');
			$('.dropdown2 a').css('borderBottom','none');
		});
		

		$('.mask').off('click').on('click',function(event){
			event.stopPropagation();
		})
		
		
		
		//消息
		
		var dataobj = {
			"TABLENAME":"u_note",
			"COLUMNS":"TITLE,MODIFIEDDATE,DESCRIPTION,ID",
			"CONDITION":"DOCSTATUS='INIT'",
			"ISSTORE":"true",
			"ORDERBY":"MODIFIEDDATE",
			"DESC":"true",
			"LIMIT":6
		}
		
		var _self = this;
		
		// $.ajax({
		// 	type:"post",
		// 	url:"/p/cs/QueryTable",
		// 	dataType:'json',
		// 	data:{"PARAM":JSON.stringify(dataobj)},
		// 	success:function(response){
		// 		if(response.code == 0){
		// 			var obj = JSON.parse(response.result);
		// 			 $('#app .mask').eq(1).find('.message-mask .message-mask .message-tips').remove();
		// 			 $('#app .mask').eq(1).find('.message-mask .message-mask .MoreMessage').remove();
					 
		// 			if(obj.length > 0){
		// 				$('#app .tasks-menu .unread-msg').css('display','block').html(obj.length);
		// 				$('#app .mask').eq(1).find('.message-mask .message-mask .no-msg-img').css('display','none');
		// 				$('#app .mask').eq(1).find('.message-mask .message-mask .no-msg-text').css('display','none');
		// 				for(var i = 0; i < obj.length; i++){
		// 					var dataobj = obj[i]; //每条消息数据
		// 					var time = new Date(dataobj.MODIFIEDDATE);  
							
		// 					var box = $('<div class="message-tips">'+
		// 					            		'<div class="message-header">'+
		// 					            			'<span>'+dataobj.TITLE+'</span>'+
		// 					            			'<p name="'+dataobj.ID+'">'+
		// 					            				'<span>'+data(time)+'</span>'+
		// 					            				'<i class="fa fa-angle-right" aria-hidden="true" style="margin-left:5px"></i>'+
		// 					            			'</p>'+ 
		// 					            		'</div>'+
		// 					            		'<div class="message-content">'+dataobj.DESCRIPTION+
		// 					            		'</div>'+
		// 					            '</div>');
		// 		            $('#app .mask').eq(1).find('.message-mask .message-mask').append(box);
				            
		// 		            box.find('.message-header p').on('click',function(event){
		// 		            		$('#app #MessageModal').removeClass('fade').css('display','block');
		// 		            		$('#MessageModal #myModalLabel').html(dataobj.TITLE);
		// 		            		$('#MessageModal .modal-body .megtime').html(data(time));
		// 		            		$('#MessageModal .modal-body .meg').html(dataobj.DESCRIPTION.replace(/#/g,'<br />'));
		// 		            		var num = Number($('#app .tasks-menu .unread-msg').html())-1;
	    //         					if(num == 0){
	    //         						$('#app .tasks-menu .unread-msg').css('display','none')
	    //         					}else{
	    //         						$('#app .tasks-menu .unread-msg').html(num);
	    //         					}
				            					
		// 		            		//删除已读信息
		// 		            		$(this).parent().parent().remove();
				            					
				            		
		// 		            		var id = $(this).attr('name');
		// 		            		var obj = {
		// 		            			"ID":id
		// 		            		}
		// 		            		$.ajax({
		// 		            			type:"post",
		// 		            			url:"/p/cs/docStatusModify",
		// 		            			data:{"PARAM":JSON.stringify(obj)},
		// 		            			success:function(result){
		// 		            				if(result.code == 0){
				            				
		// 		            				}
		// 		            			},
		// 		            			error:function(){
				            				
		// 		            			}
		// 		            		});
				            		
		// 		            		event.stopPropagation()
		// 		            });
							            
		// 				}//for
						
		// 				var pbox = $('<p class="MoreMessage" style="height: 30px;text-align: center;margin-top: 30px;">查看更多消息</p>');
		// 				$('#app .mask').eq(1).find('.message-mask .message-mask').append(pbox);
						
						
						
		// 			}else{
		// 				$('#app .mask').eq(1).find('.message-mask .message-mask .no-msg-img').css('display','block');
		// 				$('#app .mask').eq(1).find('.message-mask .message-mask .no-msg-text').css('display','block');
		// 				$('#app .mask').eq(1).find('.message-mask .message-mask .MoreMessage').remove();
		// 				$('#app .tasks-menu .unread-msg').css('display','none')
		// 			}
					
					
					
		// 		}//if
		// 	},
		// 	error:function(result){
				
		// 	}
		// });
		
		
		
	})
	
	
	
	
	
	
	 //消息处理
    $(document).on('click','#app #MessageModal .modal-header .close',function(event){
    		$('#app #MessageModal').addClass('fade').css('display','none');
    		event.stopPropagation()
    });
	
	
    


   

    $('.dropdown2').on('click',function(event){
	    	$('.dropdown2 a').css('borderBottom','none');
	    	$(this).find('a').css('borderBottom','2px solid #f8b648');
	    	var index = $(this).index();
	    	var right = parseInt($('.mask').eq(index-1).css('right').split('p')[0]);
	    	if(right < 0){
	    		$('.mask').css("right",'-300px');
	    		$('.mask').eq(index-1).css("right",'10px')
	    	}else{
	    		$('.mask').eq(index-1).css("right",'-300px')
    			$(this).find('a').css('borderBottom','none');
	    	}
	    	
	    	$('#app .main-header .navbar-static-top .qrcode-menu .dropdown-menu').css('display','none');

 
    	event.stopPropagation();
    });
    
   
    
    
    
    
    
    
    $('#app .main-header .navbar-static-top .qrcode-menu .dropdown-toggle').on('mousemove',function(){
    			$('#app .main-header .navbar-static-top .qrcode-menu .dropdown-menu').css('display','block');
    			$('.mask').css("right",'-300px');
			$('.dropdown2 a').css('borderBottom','none');
    });
    $('#app .main-header .navbar-static-top .qrcode-menu .dropdown-menu').on('mousemove',function(){
    		$('#app .main-header .navbar-static-top .qrcode-menu .dropdown-menu').css('display','block');
    });
    
    $('#app .main-header .navbar-static-top .qrcode-menu .dropdown-toggle').on('mouseout',function(){
    			$('#app .main-header .navbar-static-top .qrcode-menu .dropdown-menu').css('display','none');
    });
    $('#app .main-header .navbar-static-top .qrcode-menu .dropdown-menu').on('mouseout',function(){
    		$('#app .main-header .navbar-static-top .qrcode-menu .dropdown-menu').css('display','none');
    });
    


    //title左右移动
//  $('.J_tabLeft').on('click',function(){
//    console.log('left');
//    $('.content-wrapper .header-list').css('left','0px');
//  });
//
//  $('.J_tabRight').on('click',function(){
//    console.log('right');
//    if($('.content-wrapper .header-list').css('width').split('px')[0] > 840){
//        $('.content-wrapper .header-list').css('left','-840px');
//    }
//    
//  });


	//报表汇总
	$('.more-mask a[data-head="报表汇总"]').off('click').on('click',function(){
		vm.toshow(null,$('<a name="StoreSum" url="/app/tpl/ctl/StoreSum"><i style="background-position: 0px -8px;"></i> <span>报表汇总</span></a>'));
		$('.mask').css("right",'-300px');
	});
	
	
	//留言
	$('.servicesIndex .report button').off('click').on('click',function(){
		var obj = {
			"CONTENT":$('.servicesIndex .report #service-report').val(),
			"PHONE":$('.servicesIndex .report #service-phone').val()
		}
		$.ajax({
			type:"POST",
			url:"/p/cs/adviceAdd",
			data:{"PARAM":JSON.stringify(obj)},
			success:function(result){
				if(result.code == 0){
					alert("留言成功");
					$('.servicesIndex .report #service-report').val('');
					$('.servicesIndex .report #service-phone').val('');
					$('.mask').css("right",'-300px');
				}
			},
			error:function(){
				
			}
		});
	});
  });



function show(obj){
    //console.log('1111');
    $(obj).parent().parent().next().toggle();
}
