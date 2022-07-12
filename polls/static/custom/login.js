// var loginBox = $('.login-box');
var user = $('.input-user');
var pass = $('.input-pass');

$('.submit-btn').on('click', () => {
    console.log('login ...');
    // console.log(user.val());
    // console.log(pass.val());
    $.ajax({
        beforeSend: function (req) {
            req.setRequestHeader("X-CSRFToken", csrftoken);
        },
        url: '/team/login',
        method: 'POST',
        data: { username: user.val(), password: pass.val() },
        dataType: 'json',
    })
        .done((res) => {
            if (res.return_code == 0) {
                window.location.href = '/';
            }
            else if (res.return_code == 401) {
                toastr.error('wrong username or password!');
                user.addClass('is-invalid');
                pass.addClass('is-invalid');
            }
        })
        .fail(() => {
            toastr.error('network fail!');
        });
});