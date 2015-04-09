$(document).ready(function(){
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
        plugins: [
             "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
             "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
             "save table contextmenu directionality emoticons template paste textcolor"
       ],
        toolbar: [
            "undo redo | styleselect | bold italic | link image",
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