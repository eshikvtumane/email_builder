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

    colorpickerClassInit();

    $('.bg-color').change(function(){
        console.log($(this).val());
        var color = $(this).val();
        if(color){
            $('#newsletter-builder-area').css('background', '#' + color);
        }
    });

    var $sim_row = $('.sim-row-*');

    $sim_row.click(function(){
        console.log('4')
    });

    $sim_row.droppable({
        accept: '.draggable-elem',
        drop: function(event, ui){
            $(this).append($(ui.droppable).clone());
        }
    });
    $(".draggable-elem").draggable({
        helper: 'clone'
    });


    tinymce.init({
        height: 250,
        selector: "textarea#editor,textarea#editor2",
        theme_advanced_resize_vertical: false,
        language : "ru",
        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
        relative_urls : false,
        remove_script_host : false,
        convert_urls : true,
        theme_advanced_link_targets : "_blank",
        extended_valid_elements : "a[href|target=_blank]",
        lineheight_formats: "2pt 4pt 6pt 8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 36pt",
        plugins: [
             "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
             "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
             "save table contextmenu directionality emoticons template paste textcolor placeholder videothumbnail lineheight"
       ],
        toolbar: [
            "undo redo | styleselect | bold italic | link image | imageupload | videothumbnail",
            "alignleft aligncenter alignright | lineheightselect | forecolor backcolor | fontselect |  fontsizeselect | emoticons"
        ],
        file_browser_callback : function(field_name, url, type, win){
            if(type=='image'){
                $('#my_form input').click();
            }
        },
        setup: function(editor){
            editor.on('ObjectResized', function(e){
                console.log(e);
            });
        }
     });


    $('#upload_image').on('change', function(){
        //var test = $('#my_form').submit();
        $('#modal2').trigger('openModal');
        var fd = new FormData();
        fd.append('image', document.getElementById('upload_image').files[0]);

        $.ajax({
            type: 'POST',
            url: '/save_tinymce_img/',
            data: fd,
            dataType: 'json',

            processData: false,
            contentType: false,
            success: function(data){
                var code = data[0];
                
                if(code == '200'){
                    $('.mce-placeholder').val(data[1]);
                }
                else{
                    alert('Ошибка загрузки. ' + data[1]);
                }
                $('#modal2').trigger('closeModal');
            }
        });
    });


    $('.resize').resizable({
        handles: 's'
    });

    $('.draggable-block').draggable();
    $('.block-resize').resizable();

    // смена фона у письма
    $('#inp_bg_color').change(function(){
        $('#newsletter-builder-area').css('background', $(this).val());
        // запись значения для экспорта
        bg_url = 'background-color: ' + $(this).val() + ';';
        bg_img_url = ''
    });

    // установить в качестве фона письма изображение
    //var bg_img_url = '';
    $('#inp_bg_img').change(function(){
        var img = 'inp_bg_img';

        $('#div_load_bg_message').html('Идёт загрузка ...');
        if(img){
            var fn = function(data){
               var code = data[0];
                if(code == '200'){
                    var url = 'url(' + data[1] + ')';
                    bg_img_url = url;
                    var $bg = $('#newsletter-builder-area');
                    $bg.css({
                        'background-image': url,
                        'background-size': 'cover'
                    });
                    bg_url = 'background-image: ' + url;

                    console.log($bg.css('background-image'));
                    $('#div_load_bg_message').html('');
                }
            };

            saveImageOnServer(img, fn);
        }
        $('#div_load_bg_message').html('');
    });

    // диалоговое окно при нажатии кнопки "сохранить шаблон"
    $( "#saving-template-dialog" ).dialog({
        autoOpen: false,
        draggable: false,
        resizable: false,
        width: 580,
        //height:140,
        modal: true,
        buttons: {
            "В текущий шаблон": function() {
                if ($('#current_template_id').val() == '') {
                    alert('Вы не выбрали шаблон!');
                    $(this).dialog('close');
                } else {
                    save_template(0)
                }
            },
            "В новый шаблон": function() {
                save_template(1)
            },
            "Отменить": function() {
                $( this ).dialog( "close" );
            }
        }
    });

    // сохранение шаблона
    $('#btn_save_template').click(function(){
        var name = $('#template_name').val();
        if (name != '') {
            // открываем диалог сохранения
            $("#saving-template-dialog").dialog('open');
        } else {
            alert('Введите имя шаблона');
        }
    });

    // загрузка выбранного шаблона
    $(document).on('click', '.load-template', function(){
        loadTemplate(this);
    });

    // удаление выбранного шаблона
    $(document).on('click', '.delete-template', function(){
        var template_name = $(this).parent().siblings().eq(1).text();
        if (confirm('Вы действительно хотите безвозвратно удалить шаблон "' + template_name + '"?')) {
            delete_template(this);
        }
    });
});

// функция сохранения шаблона
function save_template(make_new) {
    var change_template;
    var html = $('#newsletter-builder-area-center-frame-content').html();
    var name = $('#template_name').val();
    console.log('bg', $('#inp_bg_color').val())
    var bg_color = $('#inp_bg_color').val();

    var data = {
            'bg_color': bg_color,
            'template_id': $('#current_template_id').val(),
            'make_new_template': make_new,
            'change_template': change_template,
            'name': name,
            'html': html,
            'bg_image': bg_img_url
        }
    console.log(data)
    $.ajax({
        type: 'POST',
        url: '/save_template/',
        data: data,
        dataType: 'json',
        success: function(data){
            //var code = data[0];
            if(data['code'] == '200_new'){
                var cells = '<td><button class="load-template" value="' + data['template_id'] +
                    '">Выбрать</button></td>' + '<td>' + name + '</td>' + '<td>' + data['creation_date'] + '</td>' +
                    '<td>' + data['changing_date'] + '</td>' + '<td><button class="delete-template" value="' +
                    data['template_id'] + '"><i class="fa fa-close" style="color:red;"></i></button></td>';
                $("#tbl_templates tr:last").after('<tr id="load_template_'+ data['template_id'] + '">' + cells + '</tr>');

                // запихиваем айдишник нового шаблона в глобальное поле для текущего выбранного шаблона
                $('#current_template_id').val(data[1]);

                // закрытие диалогового окна
                $('#saving-template-dialog').dialog('close');

                alert('Шаблон успешно добавлен');
            } else if (data['code'] == '200_old') {
                // выводим изменения в текущий шаблон в списке шаблонов
                var tr = $('#load_template_' + data['template_id']).children();
                tr.eq(1).text(data['name']);
                tr.eq(3).text(data['changing_date']);
                // закрытие диалогового окна
                $('#saving-template-dialog').dialog('close');
                alert('Шаблон успешно изменен');
            } else {
                alert('Произошла ошибка при добавлении шаблона');
            }

        }
    });
}


// функция удаления шаблона
function delete_template(obj) {
    var template_id = $(obj).val();
    $.ajax({
        type: 'GET',
        url: '/delete_template/',
        data: { 'id': template_id },
        success: function(data){
            var code = data[0];
            if(code == '200'){
                $('#load_template_' + template_id).remove();
            }
            else{
                alert('Произошла ошибка при удалении');
                console.log('Error', data[1])
            }
        },
        error: function(data){
            console.log('Error', data);
        }
    });
}

// функция загрузки шаблона
function loadTemplate(obj){
    var template_id = $(obj).val();
    // передаем имя шаблона в поле
    //$('#template_name').val($(obj).parent().siblings().first().text());

    $.ajax({
        type: 'GET',
        url: '/load_template/',
        data: { 'id': template_id },
        success: function(data){
            if(data['code'] == '200'){
                // смена фона письма
                // установка цвета
                $('#newsletter-builder-area').css('background', data['color']);
                // установка изображения
                $('#newsletter-builder-area').css('background-image', data['image']);

                bg_img_url = data['image'];

                $('#template_name').val(data['name']);

                // установка значений для экспорта шаблона
                // если установлено изображение, то записываем его
                if(data['image']){
                    $('inp_bg_image').val(data['image']);
                    bg_url = 'background-image: ' + data['image'] + ';'
                }
                else{
                    $('#inp_bg_color').val(data['color']);
                    bg_url = 'background-color: ' + data['color'] + ';';
                }

                // отображение кода на странице и инициализация drop and resize
                var $template = $('#newsletter-builder-area-center-frame-content').html(data['html']);
                colorpickerInit($template);

                var draggable_classes = [
                    "sim-row-header1-nav-logo",
                    "sim-row-edit",
                    "sim-row-header1-nav-links"
                ];
                //"sim-row-header1-nav"
                var resize_south_classes = [
                    "sim-row-header1",
                    "sim-row-header2-nav"

                ];

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
                    "sim-row-content4-title",
                    'sim-row-content4-content'
                ];

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
                add_delete();
                perform_delete();
                perform_add();
                perform_change_color();
                colorpickerClassInit();

                $('.easy_modal').trigger('closeModal');
                console.log('Шаблон успешно скачан');

                $('#current_template_id').val(template_id);
            }
            else{
                alert('Ошибка при загрузке');
            }
        }
    });
}



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


function colorpickerInit(el){
    colorpicker(el.find('.color'));
}

function colorpickerClassInit(){
    colorpicker($('.color'));
}

function colorpicker(el){
    el.change(function(){
        var color = $(this).val();
        if(color){
            console.log($(this).parent().parent().children().attr('class'))
            console.log(color)
            $(this).parent().parent().children().css('background-color', '#' + color);
        }
    });
}

hover_edit();
add_delete();

perform_change_color();
