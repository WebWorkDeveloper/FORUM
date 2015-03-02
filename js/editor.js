
(function(){
	start:onload = function(){
	var editor_place = document.getElementsByClassName('itEditor');
		//buttons
	var buttons = [ 'Bold',
					'Italic',
					'Through',
					'Code',
					'Link',
					'Img'];

	for(var i = 0, length = editor_place.length; i<length;i++){
		editor_place[i].initEditor = function(){
			var container = document.createElement('div'),
				panel = document.createElement('div'),
				status = document.createElement('div'),
				parseButton = document.createElement('button'),
				preview = document.createElement('div');
				/*otvets = document.getElementsByClassName('otvets');

			console.log(otvets);*/
			//set proterty
			container.className = 'editor-box';
			panel.className = 'editor-panel';
			status.className = 'edito-status-bar';
			status.innerHTML = 'letter:';
			preview.id = 'preview-box';
			preview.innerHTML = '<div id="view-conteiner" class="container"><section class="preview-page"><div class="row"><div id="viewer-loader" class="col-md-12"></div></div></section><span id="preview-cancel" class="icon-cancel"></span></div>';

			parseButton.innerHTML = 'Preview';
			parseButton.className = 'editor-btn-parse';
			parseButton.type = 'button';

			this.parentNode.insertBefore(container,this);
			container.appendChild(this);
			container.appendChild(status);
			container.appendChild(panel);
			container.appendChild(parseButton);
			// container.appendChild(preview);

			var textarea = this;

			//parse button
			var parse = container.childNodes[3];
			addEvent(parse,'click',parseTextarea);

			for(var j = 0, l = buttons.length; j< l; j++){
				var elem = document.createElement('button');
					elem.className = 'panel-editor-'+buttons[j];
					elem.type = 'button';
					elem.innerHTML = buttons[j];
					container.childNodes[2].appendChild(elem);
			}

			// for(var m =0, ml = otvets.length; m<ml ; m++){
			// 	addEvent(otvets[m],'click',addEditor);
			// }

			addEvent(this,'input',showLenght);

			for(var t = 0, le = buttons.length; t< le; t++){
				var elemb = container.childNodes[2].childNodes[t];
				
				if(elemb.className == 'panel-editor-Bold'){
					addEvent(elemb,'click',setBold);
				}

				if(elemb.className == 'panel-editor-Italic'){
					addEvent(elemb,'click',setItalic);
				}

				if(elemb.className == 'panel-editor-Through'){
					addEvent(elemb,'click',setThrought);
				}

				if(elemb.className == 'panel-editor-Code'){
					addEvent(elemb,'click',addCode);
				}

				if(elemb.className == 'panel-editor-Link'){
					addEvent(elemb,'click',addLink);
				}

				if(elemb.className == 'panel-editor-Img'){
					addEvent(elemb,'click',addImg);
				}
			}

			function setBold(){
				insert_tag(textarea,'<b>','</b>');
			}
			function setItalic(){
				insert_tag(textarea,'<i>','</i>');
			}
			function setThrought(){
				insert_tag(textarea,'<strike>','</strike>');
			}
			function addCode(){
				insert_text_cursor(textarea,'<code lang="html">//code...\n</code>');
			}
			function addLink(){
				var href = prompt('Введите адрес куда будет вести ссылка','https://');
				if(href==null){
					return;
				}
				insert_tag(textarea,'<a class="a-text" href="'+href+'">','</a>');
			}
			function showLenght(){
				var value = container.childNodes[0].value.length;
				container.childNodes[1].innerHTML = 'letter: '+value;
			}
			function addImg(){
				var src = prompt('Введите путь к картинке','https://'),
					alt = 'image';
				if(src==null){
					return;
				}
				insert_text_cursor(textarea,'<img src="'+src+'" alt="'+alt+'">');
			}
			function parseTextarea(){
				var value = textarea.value;
				//parse
				value = value.replace(/\n/g, '<br/>');
				code = value.match(/<code.*?>(.|\n)*\<\/code\>/g);
				console.log(code);
				
				
				container.appendChild(preview);
				//add cancel event
				var cancel = document.getElementById('preview-cancel');
				if(cancel){
					addEvent(cancel,'click',closeViewer);
				}

				//parse stop
				var loader = document.getElementById('viewer-loader');
				loader.innerHTML = value;
			}
			function closeViewer(){
				var preview_box = document.getElementById('preview-box');
				preview_box.remove();
				//УДАЛИТЬ ОБРАБОТЧИК!
				removeEvent(this,'click',closeViewer);
			}
		}
		editor_place[i].initEditor();
	}


	//functions events
	//add event
	function addEvent(obj, type, fn){if (obj.addEventListener){obj.addEventListener( type, fn, false );} else if(obj.attachEvent) {obj.attachEvent( 'on'+type, fn );} else {obj['on'+type] = fn;}}

	// remove event
	function removeEvent(obj, type, fn){if (obj.removeEventListener) {obj.removeEventListener( type, fn, false );} else if (obj.detachEvent){obj.detachEvent( 'on'+type, obj[type+fn] );} else {obj['on'+type] = null;}}

};

function insert_tag(_obj_name, _tag_start, _tag_end)
// _obj_name - name объекта - как правило, textarea, но при желании можно сделать любой
// указываем именно NAME, так как согласно стандартам DOCTYPE HTML 4.01 strict и выше
// свойство ID у объектов ввода является не приемлемым и требуется обращаться только name
// _tag_start - что вставлять перед выделенным текстом
// _tag_end - что вставлять после выделенного текста
{
// берем объект
var area=_obj_name;
// Mozilla и другие НОРМАЛЬНЫЕ браузеры
// ЕСЛИ есть что-либо выделенное, ТО
if (document.getSelection)
{ // берем все, что до выделения
 area.value=area.value.substring(0,area.selectionStart)+

 // вставляем стартовый тег
 _tag_start+

 // вставляем выделенный текст
 area.value.substring(area.selectionStart, area.selectionEnd)+

 // вставляем закрывающий тег
 _tag_end+

 // вставляем все, что после выделения
 area.value.substring(area.selectionEnd,area.value.length);
}

// Иначе заплатка для Internet Explorer
else
{ // берем текст
 var selectedText=document.selection.createRange().text;
 // ЕСЛИ имеется какой-то выделенный текст, ТО
 if (selectedText!='')
 { // составляем новый текст
  var newText=_tag_start+selectedText+_tag_end;
  // вставляем новый текст
  document.selection.createRange().text=newText;
 }
}
}// /insert_tag


function insert_text_cursor(_obj_name, _text)
// _obj_name - name объекта - как правило, textarea, но при желании можно сделать любой
// указываем именно NAME, так как согласно стандартам DOCTYPE HTML 4.01 strict и выше
// свойство ID у объектов ввода является не приемлемым и требуется обращаться только name
// _text - текст, который требуется вставить в том место, где сейчас находится курсор
{
// берем объект
var area=_obj_name;

// ЕСЛИ Mozilla и другие НОРМАЛЬНЫЕ браузеры, ТО
if ((area.selectionStart)||(area.selectionStart=='0'))
{ // определяем, где начало выделения, если оно существует
 var p_start=area.selectionStart;

 // определяем, где заканчивается выделение, если оно существует
 var p_end=area.selectionEnd;

 // вставляем соответствующий текст в указанное место
 area.value=area.value.substring(0,p_start)+_text+area.value.substring(p_end,area.value.length);
}

// Исправляем очередной геморрой с Internet Explorer
// единственный НЕ человеческий браузер
// ЕСЛИ объект может иметь выделения, ТО
if (document.selection)
{ // передаем фокус ввода на нужный нам объект
 area.focus();

 // узнаем выделение, если оно существует
 sel=document.selection.createRange();

 // вставляет текст в указанное место
 sel.text=_text;
}
}// end function
})();