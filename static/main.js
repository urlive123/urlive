$(document).ready(function () {
    show_list();
    $('.modal fade').on('hidden.bs.modal', function () {
        console.log('clicked!')
    })
});

// youtube URL에서 id 추출 함수
function youtube_parser(url) {
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}

function show_list() {
    $.ajax({
        type: "GET", url: "/api/get", data: {}, success: function (response) {
            console.log(response['contents'])
            let rows = response['contents']
            for (let i = 0; i < rows.length; i++) {
                let title = rows[i]['title']
                let content = rows[i]['content']
                let userId = rows[i]['userId']
                let objectId = rows[i]['_id']
                let artist = rows[i]['artist']
                let count_heart = rows[i]['count_heart']
                let url = rows[i]['url']
                let class_heart = rows[i]['heart_by_me'] ? "bi-suit-heart-fill" : "bi-suit-heart"
                let url_result = youtube_parser(url)
                console.log()
                let temp_html = `<div id="${objectId}" class="card" style="width: 18rem;">
                                          <img src="http://i.ytimg.com/vi/${url_result}/0.jpg" class="card-img-top" alt="...">
                                             <div class="card-body">
                                              <h5 class="card-title">${title} - ${artist}</h5>
                                              <p class="card-text">${content}</p>

                                              <p class="card-writer">작성자: ${userId}</p>
                                              <div class="card-wrap">
                                              <button onclick="post_page_open()" href="#" type="button" class="btn btn-you-tube icon-onl" data-bs-toggle="modal" data-bs-target="#detailModal${objectId}">
                                               <i class="fa fa-youtube"></i>
                                          
                                              </button>
                                              <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${objectId}', 'heart')">
                                              <i class="bi ${class_heart}"></i>&nbsp;<span class="like-num">${count_heart}</span>
                                              </a>
                                              </div>
                                             </div>
                                             <i onclick="delete_card('${objectId}')" class="bi bi-x-lg"></i>
                                            </div>
                                        <!-- Modal Detail -->
                                        <div class="modal fade" id="detailModal${objectId}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div class="modal-dialog modal-lg">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                                <iframe width="766" height="431" src="https://youtube.com/embed/${url_result}"
                                                                title="YouTube video player" frameborder="0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowfullscreen
                                                                id="player"></iframe>
                                                        <div class="post_box">
                                                                <h2>${title} - ${artist}</h2>
                                                                <p>${content}</p>
                                                    </div>
                                                    <div class="comment_box">
                                                        <table class="table">
                                                        <thead>
                                                        <tr>
                                                         <th scope="col" style="width: 100px">닉네임</th>
                                                         <th scope="col">댓글</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody id="comment">
                                                            <tr>
                                                                <td>영희</td>
                                                                <td>노래 넘 좋아여</td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <div class="form-floating">
                                                            <textarea class="form-control" placeholder="Leave a comment" id="comment-post"></textarea>
                                                            <label for="floatingTextarea">댓글 달기</label>
                                                            <button onclick="comment_posting()" style="float: right" type="button" class="btn btn-outline-dark mt-3">등록</button>
                                                        </div>
                                                        </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn" data-bs-dismiss="modal">Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`
                $('#cards-box').append(temp_html)
                $(document).on('hidden.bs.modal', `#detailModal${objectId}`, function () {
                    $(`#detailModal${objectId} iframe`).attr("src", $(`#detailModal${objectId} iframe`).attr("src"))
                })
            }
        }
    });
}

function post_list() {
    let title = $('#title').val()
    let content = $('#content').val()
    let artist = $('#artist').val()
    let url = `${$('#url').val()}`
    console.log(url)
    $.ajax({
        type: 'POST',
        url: '/api/post',
        data: {title_give: title, content_give: content, userId_give: userId, artist_give: artist, url_give: url},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    })
}

//댓글 보이기
function comment_listing() {
    $('#comment').empty()
    $.ajax({
        type: 'GET',
        url: '/main/comment',
        data: {},
        success: function (response) {
            let rows = response['urliveComments']
            for (let i = 0; i < rows.length; i++) {
                let comment = rows[i]['comment']
                let username = rows[i]['username']
                let temp_html = ` <tr>
                                        <td>${username}</td>
                                        <td>${comment}</td>
                                    </tr>`
                $('#comment').append(temp_html)
            }
        }
    })
}

//포스트 창 열기 (수정 필요)

//댓글 하기
function comment_posting() {
    let comment = $('#comment-post').val()
    $.ajax({
        type: 'POST',
        url: '/main/comment',
        data: {userId_give: userId, comment_give: comment},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    });
}

//좋아요 기능
function toggle_like(post_id, type) {
    let $a_like = $(`#${post_id} a[aria-label='heart']`)
    let $i_like = $a_like.find("i")
    console.log($i_like)
    if ($i_like.hasClass("bi-suit-heart")) {
        $.ajax({
            type: "POST",
            url: "/api/likes",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "like"
            },
            success: function (response) {
                console.log("like")
                console.log(response)
                $i_like.addClass("bi-suit-heart-fill").removeClass("bi-suit-heart")
                $a_like.find("span.like-num").text(response["count"])
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/api/likes",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "unlike"
            },
            success: function (response) {
                console.log("unlike")
                $i_like.addClass("bi-suit-heart").removeClass("bi-suit-heart-fill")
                $a_like.find("span.like-num").text(response["count"])
            }
        })

    }
}
//by현서 로그아웃 기능
function logout() {
    $.removeCookie('mytoken')
    window.location.reload()
    console.log("clicked!")
}

//by현서 딜리트 기능
function delete_card(id) {
    if(confirm('삭제하시겠습니까?')) {
        $.ajax({
        type: 'POST',
        url: '/api/delete',
        data: {id_give: id, userId_give: userId},
        success: function (response) {
            alert(response['msg'])
            if (response['check'] == 1) {
                window.location.reload()
            }
        }
    })
    }
}