

$(document).ready(function () {
    profile_get()
})



function profile_get() {
    $('#profile_mypage').empty()
    $.ajax({
        type: 'GET',
        url: '/mypage/profile',
        data: {},
        success: function (response) {
            console.log(response)

        }
    })
}

function profile_edit(){}












//function mypage_follow()



