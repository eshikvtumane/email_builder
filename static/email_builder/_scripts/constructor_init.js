$(document).ready(function(){
    $('.easy_modal').easyModal();
    $('.easy-modal-open').click(function(e) {
        var target = $(this).attr('href');
        $(target).trigger('openModal');
        e.preventDefault();
    });
    $('.easy-modal-close').click(function(e) {
            $('.easy_modal').trigger('closeModal');
        });

    $('.color').ColorPicker({
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

    $('.bg-color').ColorPicker({
            onSubmit: function(hsb, hex, rgb, el) {
                $(el).val(hex);
                $(el).ColorPickerHide();
                console.log($(el).parent().parent().attr('class'))
                $('#newsletter-builder-area').css('background', '#' + hex);
                bg_url = 'background-color: ' + $(this).val() + ';';
            },
            onBeforeShow: function () {
                $(this).ColorPickerSetColor(this.value);
            }
        })
        .bind('keyup', function(){
            $(this).ColorPickerSetColor(this.value);
        })

    tinymce.init({
        selector: "textarea#editor,textarea#editor2",
        language : "ru",
        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
        imageupload_url: '/save_tinymce_img/',
        csrf: csrf_token,
        plugins: [
             "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
             "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
             "save table contextmenu directionality emoticons template paste textcolor imageupload"
       ],
        toolbar: [
            "undo redo | styleselect | bold italic | link image | imageupload",
            "alignleft aligncenter alignright | forecolor backcolor | fontselect |  fontsizeselect"
        ]
     });

    $('.resize').resizable({
        handles: 's'
    });

    $('.draggable-block').draggable();
    $('.block-resize').resizable();

    // смена фона у письма
    $('#inp_bg_color').change(function(){
        $('#newsletter-builder-area').css('background', $(this).val());
        bg_url = 'background-color: ' + $(this).val() + ';';
    });

    // установить в качестве фона письма изображение
    $('#inp_bg_img').change(function(){
        var img = 'inp_bg_img';
        $('#div_load_bg_message').html('Идёт загрузка ...');
        if(img){
            var fn = function(data){
               var code = data[0];
                if(code == '200'){
                    var url = 'url(' + data[1] + ')';
                    console.log(url)
                    $('#newsletter-builder-area').css('background-image', url);
                    bg_url = 'background-image: ' + url;

                    console.log($('#newsletter-builder-area').css('background-image'))
                    $('#div_load_bg_message').html('');
                }
            };

            saveImageOnServer(img, fn);
        }
    });

    // сохранение шаблона
    $('#btn_save_template').click(function(){
            var name = $('#template_name').val();
            var html = $('#newsletter-builder-area-center-frame-content').html();

            $.ajax({
                type: 'POST',
                url: '/save_template/',
                data: {
                    'name': name,
                    'html': html
                },
                dataType: 'json',
                success: function(data){
                    var code = data[0];
                    if(code == '200'){
                        var cells = '<td width="80%">' + name + '</td>' + '<td><button class="get-template-html" value="' + data[1] + '">Выбрать</button></td>'
                        $("#tbl_templates tr:last").after('<tr>' + cells + '</tr>');
                        alert('Шаблон успешно добавлен');
                    }
                    else{
                        alert('Произошла ошибка при добавлении шаблона');
                    }

                }
            });
    });


    // загрузка выбранного шаблона
    $('.load-template').click(function(){
        var template_id = $(this).val();

        $.ajax({
            type: 'GET',
            url: '/load_template/',
            data: { 'id': template_id },
            success: function(data){
                var code = data[0];
                if(code == '200'){
                    var $template = $('#newsletter-builder-area-center-frame-content').html(data[1]);
                    $template.find('.color').ColorPicker({
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


                    var draggable_classes = [
                        "sim-row-header1-nav-logo",
                        "sim-row-edit",
                        "sim-row-header1-nav-links"
                    ]
                    //"sim-row-header1-nav"
                    var resize_south_classes = [
                        "sim-row-header1",
                        "sim-row-header2-nav"

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



                    for(var i=0; i<resize_south_classes.length; i++){
                        console.log(resize_south_classes[i])
                        $('#newsletter-builder-area-center-frame-content [class*="' + resize_south_classes[i] + '"]').find('.ui-resizable-handle').remove();
                        $('#newsletter-builder-area-center-frame-content [class*="' + resize_south_classes[i] + '"]').resizable({
                            handles: 's'
                        });
                    }

                    for(var i=0; i<resize_classes.length; i++){
                        $template.find('[class*="' + resize_classes[i] + '"]').resizable();
                    }

                    for(var i=0; i<draggable_classes.length; i++){
                        $template.find('[class*="' + draggable_classes[i] + '"]').draggable();
                    }

                    /*$('#newsletter-builder-area-center-frame-content').find('div').each(function (index) {
                            console.log($(this).children('div:first div'))
                            $(this).children('div:first div').resizable({
                                handles: 's'
                            });
                        });*/
                    /*for(var i=0; i<resize_south_classes.length;i++){
                        $('#newsletter-builder-area-center-frame-content .sim-row').find('div').each(function (index) {
                            $(this).resizable();
                        });
                    }*/
                    

                    hover_edit();
                    perform_delete();
                    perform_change_color();

                    $('.easy_modal').trigger('closeModal');
                    console.log('Шаблон успешно скачан');
                }
                else{
                    alert('Ошибка при загрузке');
                }
            }
        });
    });
});

var bg_url = 'background-color: #C3CCD5';

// функция сохранения выбранного изображения на сервере
function saveImageOnServer(img, fn){
    img = document.getElementById(img).files[0];

    if(img){
        var form_data = new FormData();
        form_data.append('img', img);
        $.ajax({
            type: 'POST',
            url: '/save_img/',
            data: form_data,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: fn
        });
    }
}


// функция сохранения шаблона
function saveTemplates(){
    var $name = $('#template_name').val();

    $("#newsletter-preloaded-export").html($("#newsletter-builder-area-center-frame-content").html());
    $("#newsletter-preloaded-export .sim-row-delete").remove();
    $("#newsletter-preloaded-export .sim-row-palette").remove();

    var id= document.getElementById('newsletter-preloaded-export');
    var class_remove = ' resize';
    var d;
    d=document.getElementById(id);
    d.className=d.className.replace(myClassName,"");

    active.classList.remove("resize");

    //$(".sim-row div .resize").removeClass('resize');
    $(".sim-row").removeClass("ui-resizable");
    $(".sim-row").removeClass("ui-draggable");




    $.ajax({
        type: 'POST',
        url: '/save_template/',
        data: {
            'name': $name,
            'html': $html
        },
        dataType: 'json',
        success: function(data){
            var code = data[0];
            if(code == '200'){
                var cells = '<td width="80%">' + name + '</td>' + '<td><button class="get-template-html" value="' + data[1] + '">Выбрать</button></td>'
                $("#tbl_templates tr:last").after('<tr>' + cells + '</tr>');
                alert('Шаблон успешно добавлен');
            }
            else{
                alert('Произошла ошибка при добавлении шаблона');
            }

        }
    });
}

// загрузка выбранного шаблона
function loadTemplate(){

}


//Edit
function hover_edit(){


$(".sim-row-edit").hover(
  function() {
    $(this).append('<div class="sim-row-edit-hover"><i class="fa fa-pencil" style="line-height:30px;"></i></div>');
    $(".sim-row-edit-hover").click(function(e) {e.preventDefault()})
    $(".sim-row-edit-hover i").click(function(e) {
    e.preventDefault();
    big_parent = $(this).parent().parent();
    
    //edit image
    if(big_parent.attr("data-type")=='image'){
    
    $("#sim-edit-image .image").val(big_parent.children('img').attr("src"));
    $("#sim-edit-image").fadeIn(500);
    $("#sim-edit-image .sim-edit-box").slideDown(500);
    
    $("#sim-edit-image .sim-edit-box-buttons-save").click(function() {
      $(this).parent().parent().parent().fadeOut(500)
      $(this).parent().parent().slideUp(500)


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

        var input = document.getElementById('input_load_image');
        if (input.files && input.files[0]) {
            saveImageOnServer('input_load_image', fn);
           }
       });

    }
    
    //edit link
    if(big_parent.attr("data-type")=='link'){

    // получаем объект кнопки
    var $div_link = big_parent.parent();

    $("#sim-edit-link .title").val(big_parent.text());
    $("#sim-edit-link .url").val(big_parent.attr("href"));
    $("#sim-edit-link").fadeIn(500);
    $("#sim-edit-link .sim-edit-box").slideDown(500);
    
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


    tinyMCE.get('editor').setContent(big_parent.html());
    
    $("#sim-edit-title .sim-edit-box-buttons-save").click(function() {
      $(this).parent().parent().parent().fadeOut(500)
      $(this).parent().parent().slideUp(500)

        big_parent.html(tinyMCE.get('editor').getContent());
        big_parent.resizable('destroy');
        big_parent.resizable();
        big_parent.children('.sim-row-edit-hover').remove();
        });

    }
    
    //edit text
    if(big_parent.attr("data-type")=='text'){
    
    $("#sim-edit-text .text").val(big_parent.text());
    $("#sim-edit-text").fadeIn(500);
    $("#sim-edit-text .sim-edit-box").slideDown(500);

    //CKEDITOR.instances['editor2'].setData();
    tinyMCE.activeEditor.setContent(big_parent.html());
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
    
    $("#sim-edit-icon i").click(function() {
      $(this).parent().parent().parent().parent().fadeOut(500)
      $(this).parent().parent().parent().slideUp(500)
       
        big_parent.children('i').attr('class',$(this).attr('class'));

        });

    }//
    
    });
  }, function() {
    $(this).children(".sim-row-edit-hover").remove();
  }
);
}
hover_edit();



//close edit
$(".sim-edit-box-buttons-cancel").click(function() {
  $(this).parent().parent().parent().fadeOut(500)
   $(this).parent().parent().slideUp(500)
});

// удаление блока
function perform_delete(){
    $(".sim-row-delete").click(function() {
      $(this).parent().remove();
    });
}

//Delete and palette
function add_delete(){
    $(".sim-row").append('<div class="sim-row-delete"><i class="fa fa-times" ></i></div>');
    $(".sim-row").append('<div class="sim-row-palette"><input class="color" class="bg_block_color" value="#FFFFFF"></i></div>');
    }
add_delete();

function perform_change_color(){
    $(".bg_block_color").change(function() {
        console.log('111')
      $(this).parent().parent().find('[class*="sim-row-header"]').css('background-color', $(this).val());
      $(this).parent().parent().find('[class*="sim-row-content"]').css('background-color', $(this).val());
    });
}

perform_change_color();


function setColorPicker(el){
    $(el).ColorPicker({
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
}