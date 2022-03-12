
function dashboard2() {
    var d2_content = $('#d2');
    var _d2_content = d2_content.clone();
    _d2_content.removeClass('d-none');
    $('#content').empty();
    $('#content').append(_d2_content);
}