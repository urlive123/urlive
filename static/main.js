// 메인페이지 시작시 리스트 불러오기
$(document).ready(function () {
    show_list();
    const menuItems = document.querySelectorAll('.tab-menu__item');
    let previousSelectedItem = menuItems[0];
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            previousSelectedItem?.classList.remove('tab-menu__active')
            previousSelectedItem = item;
            item.classList.add('tab-menu__active');
        })
    })
});

// youtube URL에서 id 추출
function youtube_parser(url) {
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}

// 리스트 조회
function show_list() {
    $.ajax({
        type: "GET", url: '/api/contents', data: {}, success: function (response) {
            console.log(response)
            let rows = response['contents']
            for (let i = 0; i < rows.length; i++) {
                let title = rows[i]['title']
                let content = rows[i]['content']
                let userId = rows[i]['userId']
                let objectId = rows[i]['_id']
                let artist = rows[i]['artist']
                let count_heart = rows[i]['count_heart']
                let url = rows[i]['url']
                let count_comment = rows[i]['comment_count']
                let class_heart = rows[i]['heart_by_me'] ? "bi-suit-heart-fill" : "bi-suit-heart"
                let url_result = youtube_parser(url)

                let temp_html = `<div id="${objectId}" class="card" style="width: 18rem;">
                                          <img src="http://i.ytimg.com/vi/${url_result}/0.jpg" class="card-img-top" alt="...">
                                             <div class="card-body">
                                              <h5 class="card-title">${title} - ${artist}</h5>
                                              <p class="card-text">${content}</p>

                                              <p class="card-writer">작성자: ${userId}</p>
                                              <p class="card-comment-count">댓글 수: ${count_comment}개</p>
                                              <div class="card-wrap">
                                              <button style="color: rgb(253,246,246)" onclick="comment_listing('${objectId}')" href="#" type="button" class="btn btn-you-tube icon-onl" data-bs-toggle="modal" data-bs-target="#detailModal${objectId}">
                                               동영상 재생
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
                                                    <div id="modal-body" class="modal-body">
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
                                                            <tbody id="comment${objectId}">                                                         
                                                            </tbody>
                                                        </table>
                                                        <div class="form-floating">
                                                            <textarea class="form-control" placeholder="Leave a comment" id="commentpost${objectId}"></textarea>
                                                            <label for="floatingTextarea">댓글 달기</label>
                                                            <button style="float: right;"type="button" class="btn btn-outline-dark mt-2" data-bs-dismiss="modal">닫기</button>
                                                            <button onclick="comment_posting('${objectId}')" style="float: right; margin-right: 10px;" type="button" class="btn btn-outline-dark mt-2">등록</button>
                                                        </div>
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

// 댓글 순 정렬
function sortbycomment() {
    $.ajax({
        type: 'get', url: '/api/contents-by-comment', data: {}, success: function (response) {
            $('#cards-box').empty()
            let rows = response['contents']
            for (let i = 0; i < rows.length; i++) {
                let title = rows[i]['title']
                let content = rows[i]['content']
                let userId = rows[i]['userId']
                let objectId = rows[i]['_id']
                let artist = rows[i]['artist']
                let count_heart = rows[i]['count_heart']
                let count_comment = rows[i]['comment_count']
                let url = rows[i]['url']
                let class_heart = rows[i]['heart_by_me'] ? "bi-suit-heart-fill" : "bi-suit-heart"
                let url_result = youtube_parser(url)
                let temp_html = `<div id="${objectId}" class="card" style="width: 18rem;">
                                          <img src="http://i.ytimg.com/vi/${url_result}/0.jpg" class="card-img-top" alt="...">
                                             <div class="card-body">
                                              <h5 class="card-title">${title} - ${artist}</h5>
                                              <p class="card-text">${content}</p>

                                              <p class="card-writer">작성자: ${userId}</p>
                                              <p class="card-comment-count">댓글 수: ${count_comment}개</p>
                                              <div class="card-wrap">
                                              <button style="color: rgb(253,246,246)" onclick="comment_listing('${objectId}')" href="#" type="button" class="btn btn-you-tube icon-onl" data-bs-toggle="modal" data-bs-target="#detailModal${objectId}">
                                               동영상 재생
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
                                                    <div id="modal-body" class="modal-body">
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
                                                            <tbody id="comment${objectId}">                                                         
                                                            </tbody>
                                                        </table>
                                                        <div class="form-floating">
                                                            <textarea class="form-control" placeholder="Leave a comment" id="commentpost${objectId}"></textarea>
                                                            <label for="floatingTextarea">댓글 달기</label>
                                                            <button style="float: right;"type="button" class="btn btn-outline-dark mt-2" data-bs-dismiss="modal">닫기</button>
                                                            <button onclick="comment_posting('${objectId}')" style="float: right; margin-right: 10px;" type="button" class="btn btn-outline-dark mt-2">등록</button>
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
    })
}

// 정렬 좋아요 지혜
function sort_heart() {
    $('#cards-box').empty()
    $.ajax({
        type: "GET", url: '/api/contents-by-heart', data: {}, success: function (response) {
            let rows = response['contents']
            for (let i = 0; i < rows.length; i++) {
                let title = rows[i]['title']
                let content = rows[i]['content']
                let userId = rows[i]['userId']
                let objectId = rows[i]['_id']
                let artist = rows[i]['artist']
                let count_heart = rows[i]['count_heart']
                let url = rows[i]['url']
                let count_comment = rows[i]['comment_count']
                let class_heart = rows[i]['heart_by_me'] ? "bi-suit-heart-fill" : "bi-suit-heart"
                let url_result = youtube_parser(url)
                let temp_html = `<div id="${objectId}" class="card" style="width: 18rem;">
                                          <img src="http://i.ytimg.com/vi/${url_result}/0.jpg" class="card-img-top" alt="...">
                                             <div class="card-body">
                                              <h5 class="card-title">${title} - ${artist}</h5>
                                              <p class="card-text">${content}</p>

                                              <p class="card-writer">작성자: ${userId}</p>
                                              <p class="card-comment-count">댓글 수: ${count_comment}개</p>
                                              <div class="card-wrap">
                                              <button style="color: rgb(253,246,246)" onclick="comment_listing('${objectId}')" href="#" type="button" class="btn btn-you-tube icon-onl" data-bs-toggle="modal" data-bs-target="#detailModal${objectId}">
                                             동영상 재생
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
                                                    <div id="modal-body" class="modal-body">
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
                                                            <tbody id="comment${objectId}">                                                         
                                                            </tbody>
                                                        </table>
                                                        <div class="form-floating">
                                                            <textarea class="form-control" placeholder="Leave a comment" id="commentpost${objectId}"></textarea>
                                                            <label for="floatingTextarea">댓글 달기</label>
                                                            <button style="float: right;"type="button" class="btn btn-outline-dark mt-2" data-bs-dismiss="modal">닫기</button>
                                                            <button onclick="comment_posting('${objectId}')" style="float: right; margin-right: 10px;" type="button" class="btn btn-outline-dark mt-2">등록</button>
                                                        </div>
                                                </div>
                                            </div>
                                        </div>`
                $('#cards-box').append(temp_html)
                // 모달창 종료시 영상 멈춤
                $(document).on('hidden.bs.modal', `#detailModal${objectId}`, function () {
                    $(`#detailModal${objectId} iframe`).attr("src", $(`#detailModal${objectId} iframe`).attr("src"))
                })
            }
        }
    });
}

// 카드 포스팅
function post_list() {
    let title = $('#title').val()
    let content = $('#content').val()
    let artist = $('#artist').val()
    let url = `${$('#url').val()}`
    console.log(url)
    if(title == "" || content == "" || artist == "" || url == ""){
        alert('내용을 모두 입력해주세요')
    } else {
    $.ajax({
        type: 'POST',
        url: '/api/contents',
        data: {title_give: title, content_give: content, userId_give: userId, artist_give: artist, url_give: url},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    })
    }
}

//댓글 조회
function comment_listing(id) {
    $(`#comment${id}`).empty();
    $.ajax({
        type: 'GET', url: '/api/comments', data: {}, success: function (response) {
            console.log(response)
            let rows = response['urliveComments']
            for (let i = 0; i < rows.length; i++) {
                let num = rows[i]['num']
                if (id == num) {
                    let comment = rows[i]['comment']
                    let userId = rows[i]['userId']
                    let objectId = rows[i]['_id']
                    let temp_html = ` <tr>
                                        <td>${userId}</td>
                                        <td>${comment} <button onclick="delete_comment('${objectId}', '${num}')" type="button" class="btn-close" aria-label="Close"></button></td>
                                    </tr>`
                    $(`#comment${id}`).append(temp_html)
                }
            }
        }
    })
}


//댓글 쓰기
function comment_posting(id) {
    let commentpost = $(`#commentpost${id}`).val()
    if (commentpost == "") {
        alert("댓글을 입력해주세요")
    } else {
        $.ajax({
            type: 'POST',
            url: '/api/comments',
            data: {userId_give: userId, comment_give: commentpost, objectId_give: id},
            success: function (response) {
                alert(response['msg'])
                comment_listing(id)
                $(`#commentpost${id}`).val("")
            }
        });
    }
}

//좋아요 기능
function toggle_like(post_id, type) {
    let $a_like = $(`#${post_id} a[aria-label='heart']`)
    let $i_like = $a_like.find("i")
    console.log($i_like)
    if ($i_like.hasClass("bi-suit-heart")) {
        $.ajax({
            type: "POST", url: "/api/likes", data: {
                post_id_give: post_id, type_give: type, action_give: "like",
            }, success: function (response) {
                $i_like.addClass("bi-suit-heart-fill").removeClass("bi-suit-heart")
                $a_like.find("span.like-num").text(response["count"])
            }
        })
    } else {
        $.ajax({
            type: "POST", url: "/api/likes", data: {
                post_id_give: post_id, type_give: type, action_give: "unlike"
            }, success: function (response) {
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

//by현서 카드 삭제 기능
function delete_card(id) {
    if (confirm('삭제하시겠습니까?')) {
        $.ajax({
            type: 'POST', url: '/api/content', data: {id_give: id, userId_give: userId}, success: function (response) {
                alert(response['msg'])
                if (response['check'] == 1) {
                    window.location.reload()
                }
            }
        })
    }

}

// 댓글 삭제 지혜
function delete_comment(objectId, id) {
    if (confirm('삭제하시겠습니까?')) {
        $.ajax({
            type: 'POST',
            url: '/api/comment',
            data: {objectId_give: objectId, userId_give: userId},
            success: function (response) {
                alert(response['msg'])
                if (response['check'] == 1) {
                    comment_listing(id)
                }
            }
        })
    }

}

function gotomypage() {
    window.location.replace("/main/mypage")
}

function gotomain() {
    window.location.reload()
}