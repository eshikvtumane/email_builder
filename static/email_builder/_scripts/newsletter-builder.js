$(document).ready(function(){
	// добавление элементов в блок
	var text = '<div class="sim-row-content2-right-text sim-row-edit style="color: #656565;float: left;width: 300px;margin-left: 50px;margin-top: 25px;font-size: 16px;line-height: 24px;font-weight: 300;" data-type="text" >Lorem ipsum dolor sit amet, consectetur adipscing elit praesent augue sapien egestas nibh id condimentum accumsan diam eleva corp avera folmo</div>';
	var img  = '<div class="sim-row-content2-left sim-row-edit" data-type="image" style="float: left;width: 350px;text-align: right;overflow: hidden; margin-left:30px;"><img src="/static/email_builder/img/placeholder.png" style="height: auto;width: 350px;"></div>';
	var btn  = '<div class="sim-row-content5-left-button" style="float: left;margin-top: 25px;width: 300px;margin-left: 50px;"><a href="#" class="sim-row-edit" data-type="link" style="float: left;background-color: rgba(150,111,177,1);-webkit-border-radius: 3px;-moz-border-radius: 3px;border-radius: 3px;-webkit-transition: background 0.5s;-moz-transition: background 0.5s;-o-transition: background 0.5s;transition: background 0.5s;color: rgba(255,255,255,1);font-size: 15px;line-height: 35px;text-decoration: none;padding-right: 15px;padding-left: 15px;display: block;">Читать далее</a></div>';
	var icon = '<div class="sim-row-content1-tab" style="float: left;width: 200px;margin-left: 50px;text-align: center;"><div class="sim-row-content1-tab-icon sim-row-edit" data-type="icon" style="background-color: rgba(63,141,191,1);height: 60px;width: 60px;margin-right: auto;margin-left: auto;color: rgba(255,255,255,1);line-height: 60px;-webkit-transition: background 0.5s;-moz-transition: background 0.5s;-o-transition: background 0.5s;transition: background 0.5s;font-size: 30px;-webkit-border-radius: 3px;-moz-border-radius: 3px;border-radius: 3px;"><i class="fa fa-life-ring" style="line-height: 60px;"></i></div></div>';
	$('.add-elem').click(function(){
		var $type = $(this).attr('type');
		var class_name = $('.'  + $('#to_add').val().split(' ')[0]);

		if($type == 'text'){
			class_name.append(text);
		}
		if($type == 'image'){
			class_name.append(img);
		}
		if($type == 'button'){
			class_name.append(btn);
		}
		if($type == 'icon'){
			class_name.append(icon);
		}
		
		hover_edit();
		console.log($type)
		class_name.css('height', class_name.css('height') + 30)
		elem_init = class_name.find('[class*="sim-row-content"]');
		elem_init.draggable();
		elem_init.resizable();

		
		$('#modal3').trigger('closeModal');
	})
});


//Edit
function hover_edit(){

$(".sim-row-edit").hover(
  function() {
  	var count_image = 0;
  	// если блок содержит изображение

  	var $this = $(this);
  	$(this).each(function(i){
  		if($(this).find('img').length>0){
  			count_image += 1
  		}
  	});

    $this.append('<div class="sim-row-edit-hover"><i class="fa fa-pencil" style="line-height:30px;"></i></div>');
    $this.append('<div class="sim-row-remove-div-hover"><i class="fa fa-remove remove-elem-block" style="line-height:30px;"></i></div>');
    /*if(count_image){
	  	$this.append('<div class="sim-row-edit-size"><i class="fa fa-pencil" style="line-height:30px;"></i></div>');
	  }*/
	$(".sim-row-edit-hover").click(function(e) {e.preventDefault()})

// удаление элемента в блоке
	$(".remove-elem-block").click(function(){
		$(this).parent().parent().remove();
	});
	
	$(".sim-row-edit-hover i").click(function(e) {
	e.preventDefault();
	big_parent = $(this).parent().parent();


	//edit image
	if(big_parent.attr("data-type")=='image'){
	
	$("#sim-edit-image .image").val(big_parent.children('img').attr("src"));
	$("#sim-edit-image").fadeIn(500);
	$("#sim-edit-image .sim-edit-box").slideDown(500);

	var $div_content = $(this).parent().parent();
	var $img = $div_content.find('img');
	var path = $(this).parent().parent().find('img').attr('src');
	//document.getElementById('input_load_image').src = path;

	// очищение file input
	var img_input = $('#input_load_image');
	img_input.replaceWith(img_input.val('').clone(true));

	// размеры изображения
	var $width_image = $('#width_img').val($img.width());
	var default_img_width = $img.width();
	var $height_image = $('#height_img').val($img.height());

	// проверка, изменять ли изображение пропорционально
	$('#proportion').click(function(){
		// блокировка поля изменения высоты
		if($(this).prop('checked')){
			$height_image.prop('disabled', true);
		}
		else{
			$height_image.prop('disabled', false);
		}
	});

	if($('#proportion').prop('checked')){
			$height_image.prop('disabled', true);
		}
		else{
			$height_image.prop('disabled', false);
		}

	$("#sim-edit-image .sim-edit-box-buttons-save").click(function() {
	  

      var input = document.getElementById('input_load_image');
      var img_size = ($('#input_load_image'))[0].files.length

      // если размеры не изменены
      if (img_size != 0) {
        console.log('upload')
    	big_parent.children('img').attr("src", '/media/ajax-loader.gif');
		fn = function(data){
	            var code = data[0];
	            if(code == '200'){
	                big_parent.children('img').attr("src",data[1]);
	            }
	            else{
	            	alert('Произошла ошибка при загрузке изображения.');
	                var message = 'Произошла ошибка при загрузке изображения.';
	            }
	        }
    	saveImageOnServer('input_load_image', fn);
      }
      else{
      	// проверка на число
      	var digit_exp = /^\d+$/;
      	if(digit_exp.test($width_image.val()) && digit_exp.test($height_image.val())){
	  		if($('#proportion').prop('checked')){
	  			// если необходимо пропорционально изменить картинку
	  			$img.width($width_image.val());
	  			var proportion = $width_image.val() / default_img_width;
	  			$img.height($height_image.val() * proportion);
	  		}
	  		else{
	  			$img.width($width_image.val());
	    		$img.height($height_image.val());
	  		}

	  		// изменяем размеры всплывающего синего окна с кнопками редактирования и уж=даления контента
	  		$div_content.css('height', $img.height());
	  		$div_content.css('width', $img.width());
	  	}
	  	else{
	  		alert('Введите корректные размеры');
	  		return;
	  	}
      }

      $(this).parent().parent().parent().fadeOut(500);
	  $(this).parent().parent().slideUp(500);
	});

}
	
	//edit link
	if(big_parent.attr("data-type")=='link'){

	// получаем объект кнопки
	var $div_link = big_parent;

	$("#sim-edit-link .title").val(big_parent.text());
	$("#sim-edit-link .url").val(big_parent.attr("href"));
	$("#sim-edit-link").fadeIn(500);
	$("#sim-edit-link .sim-edit-box").slideDown(500);

	$('#inp_color_btn_link').val(rgb2hex($div_link.css("background-color")));
	
	$("#sim-edit-link .sim-edit-box-buttons-save").click(function() {
	  $(this).parent().parent().parent().fadeOut(500)
	  $(this).parent().parent().slideUp(500)

	    big_parent.text($("#sim-edit-link .title").val());
		big_parent.attr("href",$("#sim-edit-link .url").val());
		big_parent.css("color",$("#inp_color_text_link").val());
        $div_link.css("background-color",$("#inp_color_btn_link").val());
		});

	}
	
	//edit title
	
	if(big_parent.attr("data-type")=='title'){
	
	$("#sim-edit-title .title").val(big_parent.text());
	$("#sim-edit-title").fadeIn(500);
	$("#sim-edit-title .sim-edit-box").slideDown(500);


    
	// удаление дефолтного текста
    if(big_parent.html().indexOf('Заголовок') == -1){
    	big_parent.children('div').remove('div');
    	tinyMCE.activeEditor.setContent(big_parent.html());
    }
    else{
	    tinyMCE.activeEditor.setContent('');
    }
	
	$("#sim-edit-title .sim-edit-box-buttons-save").click(function() {
	  $(this).parent().parent().parent().fadeOut(500)
	  $(this).parent().parent().slideUp(500)

        big_parent.html(tinyMCE.activeEditor.getContent());
        big_parent.resizable('destroy');
        big_parent.resizable();
        big_parent.children('.sim-row-edit-hover').remove();
		});

	}
	
	//edit text
	if(big_parent.attr("data-type")=='text' || typeof(big_parent.attr("data-type"))==undefined){
	
	$("#sim-edit-text .text").val(big_parent.text());
	$("#sim-edit-text").fadeIn(500);
	$("#sim-edit-text .sim-edit-box").slideDown(500);

	big_parent.children('div').remove('div');
	console.log(big_parent.html())
	// удаление дефолтного текста
    if(big_parent.html().indexOf('Lorem') == -1){
    	tinyMCE.activeEditor.setContent(big_parent.html());
    }
    else{
	    tinyMCE.activeEditor.setContent('');
    }

    

    $("#sim-edit-text .text").val();
	
	$("#sim-edit-text .sim-edit-box-buttons-save").click(function() {
	  $(this).parent().parent().parent().fadeOut(500)
	  $(this).parent().parent().slideUp(500)

	    big_parent.html(tinyMCE.get('editor2').getContent());
        big_parent.children('.sim-row-edit-hover').remove();

        big_parent.resizable('destroy');
        big_parent.resizable();


		});

	}
	
	//edit icon
	if(big_parent.attr("data-type")=='icon'){
	
	
	$("#sim-edit-icon").fadeIn(500);
	$("#sim-edit-icon .sim-edit-box").slideDown(500);
	$('#bg_icon_color').val(rgb2hex(big_parent.css("background-color")));


	$("#sim-edit-icon i").click(function() {
	  $(this).parent().parent().parent().parent().fadeOut(500)
	  $(this).parent().parent().parent().slideUp(500)
	   
	    big_parent.children('i').attr('class',$(this).attr('class'));

		});

	$("#btn_bg_icon").click(function() {
	  $(this).parent().parent().parent().fadeOut(500)
	  $(this).parent().parent().slideUp(500)

	    	big_parent.css("background-color",$("#bg_icon_color").val());

		});

	}

	
	});
  }, function() {
    $(this).children(".sim-row-edit-hover").remove();
    $(this).children(".sim-row-remove-div-hover").remove();
    $(this).children(".sim-row-edit-size-hover").remove();
  }
);
}




// удаление блока
function perform_delete(){
    $(".sim-row-delete").click(function() {
      $(this).parent().remove();
    });
}



// добавление элементов
function perform_add(){
	$(".sim-row-add-element").click(function() {
		$('#to_add').val($(this).parent().find('div:first').attr('class'));
      $('#modal3').trigger('openModal');
    });
}


//Delete and palette
function add_delete(){
    $(".sim-row").append('<div class="sim-row-delete"><i class="fa fa-times" ></i></div>');
    $(".sim-row").append('<div class="sim-row-palette"><input type="color" class="color" value="#FFFFFF"></div>');
    $(".sim-row").append('<div class="sim-row-add-element"><i class="fa fa-plus"></i></div>');
    }



function perform_change_color(){
	/*$('.sim-row-palette').ColorPicker({
            onSubmit: function(hsb, hex, rgb, el) {
                $(el).val(hex);
                $(el).ColorPickerHide();
                console.log($(el).parent().parent().attr('class'))
                $(el).parent().parent().find('[class*="sim-row"]').css('background-color', '#' + hex);
            },
            onBeforeShow: function () {
                $(this).ColorPickerSetColor(this.value);
            }
        })
        .bind('keyup', function(){
            $(this).ColorPickerSetColor(this.value);
        })
    $(".bg_block_color").change(function() {
        console.log('111')
      $(this).parent().parent().find('[class*="sim-row-header"]').css('background-color', $(this).val());
      $(this).parent().parent().find('[class*="sim-row-content"]').css('background-color', $(this).val());
    });*/
}


// ---------------------------------------------------


$(function() { 
// Resize	
function resize(){
	$('.resize-height').height(window.innerHeight - 50);
	$('.resize-width').width(window.innerWidth - 250);
	//if(window.innerWidth<=1150){$('.resize-width').css('overflow','auto');}
	
	}
$( window ).resize(function() {resize();});
resize();

	
	
 
//Add Sections
$("#newsletter-builder-area-center-frame-buttons-add").hover(
  function() {
    $("#newsletter-builder-area-center-frame-buttons-dropdown").fadeIn(200);
  }, function() {
    $("#newsletter-builder-area-center-frame-buttons-dropdown").fadeOut(200);
  }
);

$("#newsletter-builder-area-center-frame-buttons-dropdown").hover(
  function() {
    $(".newsletter-builder-area-center-frame-buttons-content").fadeIn(200);
  }, function() {
    $(".newsletter-builder-area-center-frame-buttons-content").fadeOut(200);
  }
);


$("#add-header").hover(function() {
    $(".newsletter-builder-area-center-frame-buttons-content-tab[data-type='header']").show()
	$(".newsletter-builder-area-center-frame-buttons-content-tab[data-type='content']").hide()
	$(".newsletter-builder-area-center-frame-buttons-content-tab[data-type='footer']").hide()
	$(".newsletter-builder-area-center-frame-buttons-content-tab[data-type='without-title']").hide()
  });
  
$("#add-content").hover(function() {
    $(".newsletter-builder-area-center-frame-buttons-content-tab[data-type='header']").hide()
	$(".newsletter-builder-area-center-frame-buttons-content-tab[data-type='content']").show()
	$(".newsletter-builder-area-center-frame-buttons-content-tab[data-type='footer']").hide()
	$(".newsletter-builder-area-center-frame-buttons-content-tab[data-type='without-title']").hide()
  });
  
$("#add-footer").hover(function() {
    $(".newsletter-builder-area-center-frame-buttons-content-tab[data-type='header']").hide()
	$(".newsletter-builder-area-center-frame-buttons-content-tab[data-type='content']").hide()
	$(".newsletter-builder-area-center-frame-buttons-content-tab[data-type='footer']").show()
	$(".newsletter-builder-area-center-frame-buttons-content-tab[data-type='without-title']").hide()
  });   

$("#add-without-title").hover(function() {
    $(".newsletter-builder-area-center-frame-buttons-content-tab[data-type='header']").hide()
	$(".newsletter-builder-area-center-frame-buttons-content-tab[data-type='content']").hide()
	$(".newsletter-builder-area-center-frame-buttons-content-tab[data-type='footer']").hide()
	$(".newsletter-builder-area-center-frame-buttons-content-tab[data-type='without-title']").show()
  });   
  
  
  
 $(".newsletter-builder-area-center-frame-buttons-content-tab").hover(
  function() {
    $(this).append('<div class="newsletter-builder-area-center-frame-buttons-content-tab-add" style="z-index: 99999"><i class="fa fa-plus" style="z-index: 99999"></i>&nbsp; Добавить</div>');
	$('.newsletter-builder-area-center-frame-buttons-content-tab-add').click(function() {

	var data_id = $(this).parent().attr("data-id");
	var current_header = $("#newsletter-builder-area-center-frame-content .sim-row [class*='header']").attr('class');
	
	// если header уже добавлен, то выдавать ошибку
	if(current_header != undefined && $("#newsletter-preloaded-rows .sim-row[data-id='"+data_id+"'] [class*='header']").attr('class') != undefined){
		alert('header уже добавлен');
	}
	else{		
		var $res_clone = $("#newsletter-builder-area-center-frame-content").prepend($("#newsletter-preloaded-rows .sim-row[data-id='"+data_id+"']").clone());

	    var draggable_classes = [
	        "sim-row-header1-nav-logo",
	        "sim-row-edit",
	        "sim-row-header1-nav-links"
	    ]
	    //"sim-row-header1-nav"
	    var resize_south_classes = [
	        "sim-row-header1-nav",
	        "sim-row-header2-nav",
	        "sim-row-content1-tab",
	        "sim-row-content2-left",

	    ]

	    for(var i=1; i < 19; i++){
	        resize_south_classes.push('sim-row-content' + i.toString());
	    }

	    var resize_classes = [
	        "sim-row-header1-nav-links",
	        "sim-row-header1-slider-left-text",
	        "sim-row-edit",
	        "sim-row-header2-nav-logo",
	        "sim-row-content2-right-text",
	        "sim-row-content4-title",
	        "sim-row-content2-right-text",
	        "sim-row-content2-right-text sim-row-edit ui-draggable",
	        "sim-row-content3",
	        'sim-row-content3-center-tab-image',
	        "sim-row-content4-title sim-row-edit",
	        'sim-row-content4-content sim-row-edit'
	    ]

	    for(var i=0; i<resize_classes.length; i++){
	        $res_clone.find('[class*="' + resize_classes[i] + '"]').resizable();
	    }

	    for(var i=0; i<draggable_classes.length; i++){
	        $res_clone.find('[class*="' + draggable_classes[i] + '"]').draggable();
	    }
	    for(var i=0; i<resize_south_classes.length; i++){
	        $res_clone.find('[class="' + resize_south_classes[i] + '"]').resizable({
	        handles: 's'
	    });

	    }

		hover_edit();
		perform_delete();
		perform_add();
		perform_change_color();

		// функция переопределения элемента из файла constructor_init.js
		colorpickerInit($res_clone);


		$("#newsletter-builder-area-center-frame-buttons-dropdown").fadeOut(200);
	}
		})
  }, function() {
    $(this).children(".newsletter-builder-area-center-frame-buttons-content-tab-add").remove();
  }
); 
  
  

hover_edit();


//close edit
$(".sim-edit-box-buttons-cancel").click(function() {
  $(this).parent().parent().parent().fadeOut(500)
   $(this).parent().parent().slideUp(500)
});

//Drag & Drop
$("#newsletter-builder-area-center-frame-content").sortable({
  revert: true
});
	

$(".sim-row").draggable({
      connectToSortable: "#newsletter-builder-area-center-frame-content",
      //helper: "clone",
      revert: "invalid",
	  handle: ".sim-row-move"
});


add_delete();

perform_delete();
perform_add();

// Скачивание шаблона
 $("#newsletter-builder-sidebar-buttons-abutton").click(function(){
	 
	$("#newsletter-preloaded-export").html($("#newsletter-builder-area-center-frame-content").html());
	$("#newsletter-preloaded-export .sim-row-delete").remove();
	$("#newsletter-preloaded-export .sim-row-palette").remove();
	$("#newsletter-preloaded-export .sim-row").removeClass("ui-draggable");
	$("#newsletter-preloaded-export .sim-row-edit").removeAttr("data-type");
	$("#newsletter-preloaded-export .sim-row-edit").removeClass("sim-row-edit");
	
	export_content = $("#newsletter-preloaded-export").html();
	
	$("#export-textarea").val(export_content);
	//$(this).href = 
	window.location.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(generateEmail(export_content));
	//$( "#export-form" ).submit();
	$("#export-textarea").val(' ');
	 
});
	 
	 
// Экспорт шаблона
$("#newsletter-builder-sidebar-buttons-bbutton").click(function(){
	
	$("#sim-edit-export").fadeIn(500);
	$("#sim-edit-export .sim-edit-box").slideDown(500);
	$("#newsletter-preloaded-export").html($("#newsletter-builder-area-center-frame-content").html());
	$("#newsletter-preloaded-export .sim-row-delete").remove();
	$("#newsletter-preloaded-export .sim-row-palette").remove();
	//$("#newsletter-preloaded-export .sim-row").removeClass("ui-draggable");
	$("#newsletter-preloaded-export .sim-row-edit").removeAttr("data-type");
	//$("#newsletter-preloaded-export .sim-row-edit").removeClass("sim-row-edit");

	$("#newsletter-preloaded-export").removeAttr("class");
	//$("div").removeClass("ui-resizable-handle").removeClass("ui-resizable-se").removeClass('ui-resizable').removeClass('resize').removeClass('ui-resizable-s');
	
	preload_export_html = $("#newsletter-preloaded-export").html();
	//preload_export_html.find('div').removeClass("ui-resizable-handle").removeClass("ui-resizable-se").removeClass('ui-resizable').removeClass('resize').removeClass('ui-resizable-s');
	
	var generate_result = generateEmail(preload_export_html);
	document.getElementById('link').onclick = function(code) {
        this.href = 'data:text/plain;charset=utf-8,'
          + encodeURIComponent(generate_result);
      };

	$("#sim-edit-export .text").val(generate_result);
	
	$("#newsletter-preloaded-export").html(' ');
	
	
	});




});


function generateEmail(html){
	var bg_style = '';

    // bg_url - глобальная переменная из constructor_init.js

    var preload_export_html = html;
    var doctype = '';
	var sim_wrapper_style = 'float: left;height: auto;width: 100%;margin: 0px;padding-top: 50px;padding-right: 0px;padding-bottom: 50px;padding-left: 0px;' + bg_url;
    var doctype = '<DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">';
    var export_content = doctype + '<html><body style="margin: 0px;padding: 0px;"><div id="sim-wrapper" style="' + sim_wrapper_style + '"><div id="sim-wrapper-newsletter" style="margin-right: auto;margin-left: auto;height: auto;width: 800px;">'+preload_export_html+'</div></div>';
    export_content += '</body></html>'
	
	return export_content
}

function rgb2hex(rgb){
	rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	return(rgb && rgb.length === 4) ? "#" +
		('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
		('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
		('0' + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
	
}