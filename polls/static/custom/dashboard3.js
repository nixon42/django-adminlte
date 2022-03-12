
function dashboard3() {
    var d3_content = $('#d3');
    var _d3_content = d3_content.clone();
    _d3_content.removeClass('d-none');
    $('#content').empty();
    $('#content').append(_d3_content);
}