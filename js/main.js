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
			button_otvet = $('.otvets');

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

		//toggle otvet form
		button_otvet.click(function(){
			var button = $(this);
			console.log(button);
		});

		// message in the form
		$("span[data-idIM]").click(function(){
			var parent = $(this).parent().fadeOut();
			setTimeout(function(){
				parent.remove();
			},1600);

		});

		//subcategory toggle
		icons_subcategory.click(function(){
			var subcategory = $(this).closest('.category-header').next();
			$(this).toggleClass('icon-angle-down icon-angle-up');
			subcategory.slideToggle(150);

		});

	});

})();