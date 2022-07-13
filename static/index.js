$(document).ready(function () {
    $("#password").keydown(function(e){
        if(e.which == 13){
            $('#login').click();
        }
    })
});

function login() {
    id = $('#id').val();
    pw = $('#password').val();
    $.ajax({
        type: "POST",
        url: "/api/log-in",
        data: {id_give: id, pw_give: pw},
        success: function (response) {
            if (response['result'] == 'fail') {
                alert(response['msg'])
            }
            if (response['result'] == 'success') {
                let access_token = response['token']
                $.cookie('mytoken', access_token, {path: '/'})
                window.location.replace("/main")
            }

        }
    })
}
function register() {
    id = $('#register-id').val();
    pw = $('#register-password').val();
    if(id == "" || pw == "") {
        alert('아이디와 비밀번호를 정확히 입력해주세요!')
    } else {
    $.ajax({
        type: "POST",
        url: "/api/sign-up",
        data: {id_give: id, pw_give: pw},
        success: function (response) {
            if(response['check'] == 1) {
                alert('회원가입 성공!')
                window.location.replace("/main")
            } else if(response['check'] == 0 ){
                alert('이미 가입한 회원입니다.')
            }
        }
    })
    }
}