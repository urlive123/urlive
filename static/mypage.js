

$(document).ready(function () {
    profile_get()
    profile_num_get()
})


//프로파일-댓글 수

function profile_get(){

}

function profile_num_get() {
    $('#profile_like_number').empty()
    $.ajax({
        type: 'GET',
        url: '/mypage/profile_like',
        data: {},
        success: function (response) {
            console.log(response)
            let count =0
            let rows = response['one']
            for (let i=0; i<rows.length; i++){
                if ( rows[i]['userId']==userId ){
                    count++
                }
            let like_num = count
            let temp_html =`
                            <p class="small text-muted mb-1">좋아요 누른 수</p>
                            <p class="mb-0">${like_num}</p>`
            $('#profile_like_number').append(temp_html)
            }


        }
    })
    $('#profile_upload_number').empty()
    $.ajax({
        type: 'GET',
        url: '/mypage/profile_upload',
        data: {},
        success: function (response) {
            console.log(response)
            let count =0
            let rows = response['one']
            for (let i=0; i<rows.length; i++){
                if ( rows[i]['userId']==userId ){
                    count++
                }
            let upload_num = count
            let temp_html =`
                            <p class="small text-muted mb-1">올린 포스트</p>
                            <p class="mb-0">${upload_num}</p>`
            $('#profile_upload_number').append(temp_html)
            }


        }
    })
    $('#profile_comment_number').empty()
    $.ajax({
        type: 'GET',
        url: '/mypage/profile_comment',
        data: {},
        success: function (response) {
            console.log(response)
            let count =0
            let rows = response['one']
            for ( let i=0; i<rows.length; i++){
                if ( rows[i]['userId']==userId ){
                    count++
                }
            let comment_num = count
            let temp_html =`
                            <p class="small text-muted mb-1">남긴 댓글 수</p>
                            <p class="mb-0">${comment_num}</p>`
            $('#profile_comment_number').append(temp_html)
            }


        }
    })
}

function profile_edit(){}












//function mypage_follow()



