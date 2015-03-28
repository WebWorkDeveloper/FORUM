$(document).ready(function(){
	'use stric';
	var submit = $('input#submit_send'),
		textarea = $('textarea.itEditor');
	/*==========
	CONTROLLERS
	============*/

	submit.click(sendNewTheme);

	// functions

	function sendNewTheme(){
		var that = $(this),
		value = textarea.val(),
		name = $('#title').val(),
		categoria = location.search,
		nubmerCat =categoria.match(/[1-9]*(?=&)/m).toString(),
		result;
		result = value.replace(/<code.*?>(.|\n)*?\<\/code\>/g,function(b){
					//reset code
					b = b.replace(/<code.*?>\n/g,'');
					b = b.replace(/<\/code\>/g,'');
					//convert
					b = b.replace(/<!--.*-->/g,function(str){
						str = str.replace(/<!--/g,'');
						str = str.replace(/-->/g,'');
						str = '[com]'+str+'[/com]';
						return str;});
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
			result = '\'<pre>'+result+'</pre>\'';
			//ajax
			$.ajax({
				url:'../blocks/upload_new_theme.php',
				data:{theme:{cat:nubmerCat,name:name,text:result}},
				type:'POST',
				success:function(response){
					if(response.substr(0,1)==='/'){
						//address
						location.href = response;
					}else{
						//server error
						addmessage(response);
					}
				}
			});
			return false;

	}

	function hidemessage(){
		var parent = $(this).parent().fadeOut();
			setTimeout(function(){
				parent.remove();
			},1600);
		//удаляем обработчик
		$('span[data-idIM]').unbind('click',hidemessage);
	}
	function addmessage(value){
		var container = $('.loader-massage'),
			message = $('<div class="message error"><span class="message-text">'+value+'</span><span data-idIM="" class="icon-cancel float-right"></span></div>');

		container.append(message);
		$('span[data-idIM]').bind('click',hidemessage);//?
	}

});
