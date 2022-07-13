$(document).ready(function () {
    media_check()
    $("#password").keydown(function(e){
        if(e.which == 13){
            $('#login').click();
        }
    })
});


function media_check() {
    if (matchMedia("screen and (max-width:750px)").matches) {
        $('#mobile_index').show()
        $('#wide-screen').empty()
    } else if (matchMedia("screen and (min-width:751px)").matches) {
        $('#mobile_index').empty()
    }
}

// 로그인
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
// 회원가입
function register() {
    id = $('#register-id').val();
    pw = $('#register-password').val();
    pw_check = $('#register-password-check').val();
    let idReg = /^[a-zA-Z]+[a-z0-9A-Z]{3,19}$/g;
    if( !idReg.test( id ) ) {
        alert("아이디는 영소문자로 시작하는 4~20자 영문자 또는 숫자이어야 합니다.");
        return;
    }
    if(id == "" || pw == "") {
        alert('아이디와 비밀번호를 정확히 입력해주세요!')
    } else if ( pw != pw_check) {
        alert('동일한 비밀번호를 입력해주세요.')
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