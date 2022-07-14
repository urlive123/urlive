$(document).ready(function () {
    $("#password").keydown(function(e){
        if(e.which == 13){
            $('#login').click();
        }
    })
});
// 로그인
function login() {
    id = $('#id').val();
    pw = $('#password').val();
    if( id == "" || pw == "") {
        alert("내용을 모두 입력해주세요.")
    } else {
    $.ajax({
        type: "POST",
        url: "/api/log-in",
        data: {id_give: id, pw_give: pw},
        success: function (response) {
            if (response['result'] == 'fail') {
                alert(response['msg'])
            }
            if (response['result'] == 'success') {
                if (response['check'] == 1) {
                let access_token = response['token']
                $.cookie('mytoken', access_token, {path: '/'})
                window.location.replace("/main")
                }
                else {
                    alert(response['msg'])
                }
            }

        }
    })
    }

}
// 회원가입
function register() {
    id = $('#register-id').val();
    pw = $('#register-password').val();
    pw_check = $('#register-password-check').val();
    let idReg = /^[a-zA-Z]+[a-z0-9A-Z]{3,19}$/g;
    let pwReg = /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?=[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{10,}$/;
    if (!idReg.test(id)) {
        alert("아이디는 영소문자로 시작하는 4~20자 영문자 또는 숫자이어야 합니다.");
        return;
    }
    else if (!pwReg.test(pw)) {
        alert("영문, 숫자, 특수문자 중 2가지 이상 조합하여 10자리 이내로 입력해주세요.")
        return;
    }
    else if (id == "" || pw == "" || pw_check == "") {
        alert('아이디와 비밀번호를 정확히 입력해주세요!')
    } else if (pw != pw_check) {
        alert('동일한 비밀번호를 입력해주세요.')
    } else {
        $.ajax({
            type: "POST",
            url: "/api/sign-up",
            data: {id_give: id, pw_give: pw},
            success: function (response) {
                if (response['check'] == 1) {
                    alert('회원가입 성공!')
                    window.location.replace("/login")
                } else if (response['check'] == 0) {
                    alert('이미 가입한 회원입니다.')
                }
            }
        })
    }
}

function gotohome() {
    window.location.replace("/")
}
