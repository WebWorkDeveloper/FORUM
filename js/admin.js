$(document).ready(function($) {
	'use stric';
	var scrollHelper = $('.scropp-helper'),
		//buttons DATA
		resaveButton = $('.c-resave'),
		deleteButtons = $('.c-delete'),
		saveButtons = $('.c-save'),
		alltr = $('.main-table tr');

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
		console.log(h);
		that.stop().animate({
			scrollTop:h
		},400);
	});

	//controls
	resaveButton.click(resaveData);
	saveButtons.click(saveData);

	function resaveData(){
		var that = $(this),
			container = that.parent(),
			inputs = container.children('td:not(.controls-td):not([data-id])'),
			controls = container.children('td.controls-td');

			if($('.review-tr').size()===0){
				inputs.each(function(){
					var v = $(this).html();
					$(this).html('');
					$(this).append('<input class="input-tc" type="text" value="'+v+'">');
				});

				//controls
				controls.each(function(){
					$(this).unbind('click', resaveData);
					$(this).unbind('click', deleteData);
					$(this).remove();
				});

				container.append('<td class="controls-td c-save" colspan="2"><span class="icon-admin-ok-squared"></span>Сохранить</td>').click(saveData);

				container.addClass('review-tr');//NOPE!

			}else{
				//nothing
			}
	}
	function saveData(){
		var that = $(this),
			container = that.parent(),
			inputs = container.children('td').children('input.input-tc');

			//сохраняем всё в таблице
		inputs.each(function(){
			console.log($(this));
			var hash = $(this).val();
			$(this).parent().html(hash);
			$(this).remove();
		});

		//delete save button
		that.unbind('click', saveData);
		that.remove();
		//create buttons control
		container.append('<td class="controls-td c-resave"><span class="icon-admin-pencil"></span>Изменить</td>').click(resaveData);
		container.append('<td class="controls-td c-delete"><span class="icon-admin-trash-empty"></span>Удалить</td>').click(deleteData);

		$(this).parent().removeClass('review-tr');//необходимо удалить класс

		// var input = oldEl.children('td').children('input.input-tc');
		// 	input.each(function(){
		// 		$(this).replaceWith($(this).val());
		// 	});
	}
	function deleteData(){
		console.log('ddd');
	}
});