$(document).ready(function($) {
	'use stric';
	var scrollHelper = $('.scropp-helper'),
		//buttons DATA
		resaveButton = $('.c-resave'),
		deleteButtons = $('.c-delete'),
		saveButtons = $('.c-save'),
		addButton = $('td#add-new-row'),
		alltr = $('.main-table tr'),
		banButtons = $('.c-ban'),
		unbanButtons = $('.c-unban'),
		//pupap colors
		pupapButton = $('.main-table tr td[data-icon]'),
		colors = [  'pomegranat',
					'alizarit',
					'pumpkin',
					'carrot',
					'orange',
					'sun_flower',
					'midniht_blue',
					'wet_asphalt',
					'wisteria',
					'amethyst',
					'belize_hole',
					'peter_river',
					'green_sea',
					'turquise'],
		pupapContainerstart='<div class="pupapcolors">',
		pupapContainerend='</div>',
		pupapContainer;

		//pupap
		for(var i=0,l=colors.length;i<l;i++){
			pupapContainerstart = pupapContainerstart+'<i class='+'"'+colors[i]+'"'+'><\/i>';
		}

		pupapContainer =pupapContainerstart+pupapContainerend;


	//=============
	// controllers
	//=============

	//helper
	scrollHelper.children('#scroll-top-helper').click(function(){
		$('body').stop().animate({
			scrollTop: 0
		}, 400);
	});
	scrollHelper.children('#scroll-down-helper').click(function(){
		var that = $('body,html'),
			h=that.height();
		that.stop().animate({
			scrollTop:h
		},400);
	});

	//color pupap
	pupapButton.dblclick(pupap);

	function pupap(){
		var pupapC = $('.pupapcolors'),
		that = $(this),
		container=that.closest('tr'),
		save = container.children('td.c-save');

		if(save.length>=1){//если есть кнопка сохранить
			if(pupapC.length===0){//если нету пупапа и при этом есть кнопка сохранить
				that.append(pupapContainer);
				//add here logic (bind event to colors)
				bindEventForColors();
			}else{
				if(that.children('.pupapcolors').length>0){//не уверен
					pupapC.remove();
					unbindEventForColors();
				}else{
					pupapC.remove();
					unbindEventForColors();
					that.append(pupapContainer);
					bindEventForColors();
				}
			}
		}else{
			//nothing
		}
		function bindEventForColors(){
			//bind event
			var popup = $('.pupapcolors');
			popup.children('i').bind('click',setcolor);
		}
		function unbindEventForColors(){
			//unbind event
			var popup = $('.pupapcolors');
			//resave bind
			popup.children('i').unbind('click',setcolor);
		}
	}

	//colorpupap function
	function setcolor(){
		var classname = $(this).attr('class'),
			input = $('td[data-icon]>input.input-tc');
		if($.trim(input.val()).split(' ').length>=2){
			//color
			var value = $.trim(input.val()).split(' ');
			input.val(value[0]+' '+classname);
			input.parent().attr('data-icon',value[0]+' '+classname);
			input.parent().attr('class',classname);
		}else{
			//no color
			input.val(input.val()+' '+classname);
			input.parent().attr('data-icon',input.val()+' '+classname);
			input.parent().attr('class',classname);
		}
	}


	//controls
	resaveButton.click(resaveData);
	saveButtons.click(saveData);
	deleteButtons.click(deleteData);
	addButton.click(addNewRow);

	banButtons.click(ban);
	unbanButtons.click(unban);

	function resaveData(){
		var that = $(this),
			container = that.parent(),
			inputs = container.children('td:not(.controls-td):not([data-id])'),
			controls = container.children('td.controls-td'),
			hashdata=[];//hash data 

			//reset pupap colors
			$('.pupapcolors').remove();
			unbindEventForColors();

			hashdata.push(container.children('td[data-id]').attr('data-id'));

			if($('.review-tr').size()===0){
				inputs.each(function(){
					var v = $(this).html();
					hashdata.push(v);
					$(this).html('');
					$(this).append('<input class="input-tc" type="text" value="'+v+'">');
				});

				//controls
				controls.each(function(){
					$(this).unbind('click', resaveData);
					$(this).unbind('click', deleteData);
					$(this).remove();
				});

				container.addClass('review-tr');

				container.append('<td class="controls-td c-save" colspan="2"><span class="icon-admin-ok-squared"></span>Сохранить</td>');
				container.children('td.c-save').click(function(){saveData(hashdata,container);});
			}else{
				//nothing
			}

		function unbindEventForColors(){
			//unbind event
			var popup = $('.pupapcolors');
			popup.children('i').unbind('click',setcolor);
		}
	}
	function saveData(hashdata,cont){
		var that = $(this),
			inputs = cont.children('td').children('input.input-tc'),
			data = [],
			id = cont.children('td[data-id]');
		//add id to data[]
		data.push(id.attr('data-id'));

		cont.removeClass('review-tr');

		//save in table
		inputs.each(function(){
			var hash = $(this).val();
			data.push(hash);
			$(this).parent().html(hash);
			$(this).remove();
		});

		SaveData_category(data,cont,that,hashdata);
	}
	function deleteData(){
		var that = $(this),
			container = that.parent(),
			id = container.children('td[data-id]').attr('data-id');
		if($('.review-tr').size()===0){
			var response = $.ajax({
				url:'../blocks/ADM_catigoria.php',
				type:'POST',
				data:{del:id,action:location.search},
				success:function(response){
					if(response==='true'){
						container.remove();
						return true;
					}else{
						alert('Данные не были удалины из Базы данных. Попробейте ещё раз!');
						return false;
					}
				}
			});
		}else{
			//nothing
		}

	}
	function addNewRow(){
		var that = $(this),
			container = $('<tr class="review-tr"><td data-id=""></td> <td data-icon=""><input class="input-tc" type="text" value=""></td> <td data-name=""><input class="input-tc" type="text" value=""></td> <td data-parent=""><input class="input-tc" type="text" value=""></td> <td class="controls-td c-save" colspan="2"><span class="icon-admin-ok-squared"></span>Сохранить</td></tr>');

		if($('.review-tr').size()===0){

			container.insertBefore(that.parent());

			$('.review-tr').children('td.c-save').click(saveNewRow);
		}else{
			//nothing
		}
	}
	function saveNewRow(){
	var that = $(this),
		container = that.parent(),
		inputs = container.children('td').children('input.input-tc'),
		data=[];

		data.push('null');
		container.removeClass('review-tr');

		//save in table
		inputs.each(function(){
			var hash = $(this).val();
			data.push(hash);
			$(this).parent().html(hash);
			$(this).remove();
		});

		SaveData_category(data,container,that);

		that.unbind('click',saveNewRow);
		that.remove();

		container.removeClass('review-tr');

		//create buttons control
		container.append('<td class="controls-td c-resave"><span class="icon-admin-pencil"></span>Изменить</td>');
		container.append('<td class="controls-td c-delete"><span class="icon-admin-trash-empty"></span>Удалить</td>');

		//add new event to buttons
		container.children('td.c-resave').click(resaveData);
		container.children('td.c-delete').click(deleteData);
	}
	function ban(){
		var that = $(this),
			flag = 'ban',
			container = that.parent(),
			id=0;
		id=container.children('td[data-id]').attr('data-id');
		BanUsers_forum(id,flag,{container:container,that:that});
	}
	function unban (){
		var that = $(this),
			flag = 'unban',
			container = that.parent(),
			id=0;
		id=container.children('td[data-id]').attr('data-id');
		BanUsers_forum(id,flag,{container:container,that:that});
	}


	//AJAX FUNCTIONS

	function SaveData_category(data,cont,thate,hashdatabase){
		var container = cont,
			that = thate,
			hashdata = hashdatabase;
			console.log(data);

		if(data[0]==='null'){
			//add new row
			$.ajax({
				url:'../blocks/ADM_catigoria.php',
				data:{data:data,action:location.search},
				type:'POST',
				success:function(response){
					
					if(response==' '){
						alert('Данные не были внесены в Базу Данных. Попробуйте ещё раз');

						return false;
					}else{
						container.children('td[data-id]').html(response);
						container.children('td[data-id]').attr('data-id',response);
						return true;
					}
				}
			});
		}else{
			//resave row
			$.ajax({
				url:'../blocks/ADM_catigoria.php',
				type:'POST',
				data:{data:data,action:location.search},
				success:function(response){

					if(response === 'true'){
						//delete save button
						var that = cont.children('.c-save');
						that.unbind('click', saveData);
						that.remove();

						container.removeClass('review-tr');

						//create buttons control
						container.append('<td class="controls-td c-resave"><span class="icon-admin-pencil"></span>Изменить</td>');
						container.append('<td class="controls-td c-delete"><span class="icon-admin-trash-empty"></span>Удалить</td>');

						//add new event to buttons
						container.children('td.c-resave').click(resaveData);
						container.children('td.c-delete').click(deleteData);
					}else{
						alert('Данные не были применены. Попробейте ещё раз!');

						//delete inputs
						/*container.children('td[data-id]').attr('data-id',hashdata[0]);//save id

						var inputs = container.children('td').children('input.input-tc');
						console.log(inputs);
						console.log(container);
						console.log(hashdata);

						for(var i =1, l = inputs.length; i <=l ; i++){
							inputs[i-1].parentNode.appendChild(document.createTextNode(hashdata[i]));
							inputs[i-1].remove();
							console.log(inputs[i-1]+' = '+hashdata[i]);
						}
						alert('dd');
						container.removeClass('review-tr');
						//удалить кнопку сохранить
						container.children('.c-save').remove();

						//create buttons control
						container.append('<td class="controls-td c-resave"><span class="icon-admin-pencil"></span>Изменить</td>');
						container.append('<td class="controls-td c-delete"><span class="icon-admin-trash-empty"></span>Удалить</td>');

						container.children('td.c-resave').click(resaveData);
						container.children('td.c-delete').click(deleteData);*/
						location.reload();

						return false;
					}
				}
			});
		}
	}
	function BanUsers_forum(id,flag,obj){
		var container = obj.container,
			that = obj.that;
		if(flag==='ban'){
			$.ajax({
				url:'../blocks/ADM_catigoria.php',
				type:'POST',
				data:{ban:{id:id}},
				success:function(response){
					if(response==='true'){
							$('<td class="controls-td c-unban"><span class="icon-admin-lock-open-1"></span>Разбанить</td>').insertBefore(that);
							container.children('td.c-unban').click(unban);
							container.addClass('banrow');
							that.unbind('click', ban);
							that.remove();
						return true;
					}else{
						alert('Пользователь не был заблокирован! Попробуйте ешё');
						return false;
					}
					
				}
			});
		}else{
			if(flag==='unban'){
				$.ajax({
					url:'../blocks/ADM_catigoria.php',
					type:'POST',
					data:{unban:{id:id}},
					success:function(response){
						if(response==='true'){
								$('<td class="controls-td c-ban"><span class="icon-admin-lock-1"></span>Забанить</td>').insertBefore(that);
								container.children('td.c-ban').click(ban);
								container.removeClass('banrow');
								that.unbind('click',unban);
								that.remove();
							return true;
						}else{
							alert('Пользователь не был разбанен! Попробуйте ещё');
							return false;
						}
					}
				});
			}else{
				//nosing
			}
		}
		
	}
});