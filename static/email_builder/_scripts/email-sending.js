/**
 * Created by renkse on 15.06.15.
 */

// sending email
$(document).on('click', '#FUCKINGSEND', function (e) {
    e.preventDefault();
    $.ajax({
        method: 'POST',
        url: '/send/',
        data: {
            csrfmiddlewaretoken: $('[name=csrfmiddlewaretoken]').val(),
            html :$('#editor1').val(),
            mail: $('#mda').val()
        }
    })
});

// autocompleting email
$(function() {
    $('#mda').autocomplete({
        source: function (request, callback) {
            $.ajax({
                url: "/email_autocomplete/",
                data: {query: $('#mda').val()},
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (emails) {
                    callback(emails)
                }
            })
        }
    });
});
