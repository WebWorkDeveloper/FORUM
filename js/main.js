(function(){
	$(window).load(function(){
		//hide preloader
		$('#preloader').fadeOut();
		$('#preloader').remove();

		// user list
		var button_user_info = $('#user-info'),
			user_info_drop_list = $("#user-drop-list"),
			//subcategory var
			subcategorys = $('.subcategory'),
			icons_subcategory = $('.btn-show-subcategory'),
			//drop-message toggle
			button_drop_message = $('.drop-message-toggle'),
			//add editor var
			button_otvet = $('.otvets'),
			container = button_otvet.closest('.user-message-box');
		//add editor
		for(var i =0, l = button_otvet.length; i<l;i++){
			var form = '<form class="send-otvet" action="" method=""><textarea class="itEditor"></textarea><input class="sub-otvet" type="submit" value="Ответить"></form>';
			// editor.css({'display':'none'});
			container[i].innerHTML = container[i].innerHTML + form;

		}

		// message AJAX
		var b_sub_otvet = $('.sub-otvet');

		////controllers////

		// toggle drop menu for user
		button_user_info.click(function(){
			user_info_drop_list.toggle();
		});

		//toggle drop message
		((button_drop_message.parent()).parent()).next().hide();

		button_drop_message.click(function(){
			($(this).parent()).parent().next().slideToggle(350);
		});

		button_otvet = $('.otvets');

		//toggle send otvet
		(button_otvet.closest('.user-message-box').children('form')).hide();

		//toggle otvet form
		button_otvet.click(function(){
			var that = $(this),
				container = $(this).closest('.user-message-box'),
				form = container.children();
				that.closest('.user-message-box').children('form').slideToggle(200);
		});

		//through up and through down

		var sendThumbs = function(id,that,flag){
			$.ajax({
					url:'../blocks/upload_reit.php',
					cache:false,
					type:"POST",
					data:{id:id,flag:flag},
					success:function(response){
						//count
						if(response === false){
							//nothing
						}else{
							var el = that.closest('article').children('.status-message-top').children('.status-message-through');
							console.log(el);
							if(response<0){
								el.text(response);
								el.removeClass('message-plus-count-plus');
								el.removeClass('message-plus-count');
								el.addClass('message-plus-count-minus');
							}
							if(response>0){
								el.text('+'+response);
								el.removeClass('message-plus-count-minus');
								el.removeClass('message-plus-count');
								el.addClass('message-plus-count-plus');
							}
							if(response===0){
								el.text(response);
								el.removeClass('message-plus-count-minus');
								el.removeClass('message-plus-count-plus');
								el.addClass('message-plus-count');
							}
						}
					}
				});
		};

		$('.icon-thumbs-up').click(function(){
			var message = $(this).closest('.user-message'),
				id=message.attr('data-message-id');
				sendThumbs(id,$(this),true);
		});

		$('.icon-thumbs-down').click(function(){
			var message = $(this).closest('.user-message'),
				id=message.attr('data-message-id');
				sendThumbs(id,$(this),false);
		});

		// message in the form

	var hidemessage=function(){
		var parent = $(this).parent().fadeOut();
			setTimeout(function(){
				parent.remove();
			},1600);
		//удаляем обработчик
		$('span[data-idIM]').unbind('click',hidemessage);
	};

		$('span[data-idIM]').bind('click',hidemessage);

		//subcategory toggle
		icons_subcategory.click(function(){
			var subcategory = $(this).closest('.category-header').next();
			$(this).toggleClass('icon-angle-down icon-angle-up');
			subcategory.slideToggle(150);

		});

		//message AJAX
		b_sub_otvet.click(function(){
			var that =$(this),
				m = $(this).closest('article'),
				m_id=m.attr('data-message-id'),
				m_p_id=m.attr('data-message-parent-id'),
				m_theme=m.attr('data-id-theme')||null,//id theme or null
				value = that.closest('form').children('.editor-box').children('.itEditor').val();

				//parse
				var result = value.replace(/<code.*?>(.|\n)*?\<\/code\>/g,function(b){
					//reset code
					b = b.replace(/<code.*?>\n/g,'');
					b = b.replace(/<\/code\>/g,'');
					//convert
					b = b.replace(/<!--.*-->/g,function(str){
						str = str.replace(/<!--/g,'');
						str = str.replace(/-->/g,'');
						str = '[com]'+str+'[/com]';
						return str});
					b = b.replace(/<\//g,'[&lt;&frasl;]');
					b = b.replace(/<(?!&frasl;)/g,'[&lt;]');
					b = b.replace(/>/g,'[&gt;]');

					// open tags

					b = b.replace(/\[&lt;\].*?\[&gt;\]/g,function(str){
						//reset wrapper
						str = str.replace(/\[&lt;\]/g,'');
						str = str.replace(/\[&gt;\]/g,'');
						//convert
						str = str.replace(/^([a-zA-Z0-9]+)/gm,function(b){return '[tag]'+b+'[/tag]';});
						str = str.replace(/ [a-zA-Z0-9]+/gm,function(str){return '[attr]'+str+'[/attr]';});
						str = str.replace(/".*?"|'.*?'/gm,function(str){return '[desc]'+str+'[/desc]';});
						//parse
						str = str.replace(/\[tag\]/,'<span class="tag">');
						str = str.replace(/\[\/tag\]/,'</span>');

						str = str.replace(/\[attr\]/g,'<span class="attr">');
						str = str.replace(/\[\/attr\]/g,'</span>');

						str = str.replace(/\[desc\]/g,'<span class="desc">');
						str = str.replace(/\[\/desc\]/g,'</span>');

						str = '[&lt;\]'+str+'[&gt;]';
						return str;
					});

					// close tags

					b = b.replace(/\[&lt;&frasl;\].*?\[&gt;\]/g,function(str){
						//reset wrapper
						str = str.replace(/\[&lt;&frasl;\]/g,'');
						str = str.replace(/\[&gt;\]/g,'');
						//convert
						str = str.replace(/^([a-zA-Z0-9]+)/gm,function(b){return '[tag]'+b+'[/tag]';});
						//parse
						str = str.replace(/\[tag\]/,'<span class="tag">');
						str = str.replace(/\[\/tag\]/,'</span>');
						str = '\[&lt;&frasl;\]'+str+'[&gt;]';
						return str;
					});

					//parse
					b = b.replace(/\[com\]/g,'<span class="com"><span class="com">&lt;</span>!--');
					b = b.replace(/\[\/com\]/g,'--<span class="com">&gt;</span></span>');
					b = b.replace(/\[&lt;\]/g,'<span class="letter">&lt;</span>');
					b = b.replace(/\[&gt;\]/g,'<span class="letter">&gt;</span>');
					b = b.replace(/\[&lt;&frasl;\]/g,'<span class="letter">&lt;&frasl;</span>');

					//set code
					b = '<code lang="html">'+b+'</code>';
					return b;
				});
				result = '<pre>'+result+'</pre>';
				if(m_theme!==null){//если мы пишем в корень темы
					$.ajax({
						url:'../blocks/upload_message.php',
						type:'POST',
						cache:false,
						data:{id_theme:m_theme,value_message:result},
						success:function(response){
							location.reload();
						}
					});
				}else{//если пишем ответ на ответ
					$.ajax(
						{
							url:'../blocks/upload_message.php',
							type: 'POST',
							cache:false,
							data:{id_message:m_id,id_perent_message:m_p_id,value_message:result},
							success:function(response){
								location.reload();
							}
						}
					);
				}
				
			return false;
		});

	});
})();