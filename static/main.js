$(document).ready(function () {
    show_list();
});

// youtube URL에서 id 추출 함수
function youtube_parser(url) {
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}

function reload() {
    window.location.reload()
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
                let url = rows[i]['url']
                console.log(url)
                let url_result = youtube_parser(url)
                console.log((url_result))
                let temp_html = `<div class="card" style="width: 18rem;">
                                          <img src="http://i.ytimg.com/vi/${url_result}/0.jpg" class="card-img-top" alt="...">
                                             <div class="card-body">
                                              <h5 class="card-title">${title} - ${artist}</h5>
                                              <p class="card-text">${content}</p>
                                              <p>작성자: ${userId}</p>
                                              <button id="detail-btn"type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#detailModal${objectId}">
                                               동영상 보기
                                              </button>
                                             </div>
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
                                                    <div class="modal-footer">
                                                        <button onclick="reload()" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`
                $('#cards-box').append(temp_html)
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
    function post_page_open() {
        $.ajax({
            type: 'GET',
            url: '/main/<urliveContents_id>',
            data: {},
            success: function (response) {
                let url = [response]['url']
                let song_name=[response]['songname']
                let artist = [response]['artist']
                let recommendation = [response]['recommendation']
                let temp_html = ` <div class="embed-responsive embed-responsive-16by9">
                                      <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/${url}" allowfullscreen></iframe>
                                    </div>
                                    <h2>${song_name} - ${artist}</h2>
                                    <div>${recommendation}</div>`
                $('#post-box').append(temp_html)
            }
        })
    }

    //댓글 하기
    function comment_posting() {
        let comment = $('#comment').val()
        $.ajax({
            type: 'POST',
            url: '/main/comment',
            data: {username_give: userId, comment_give: comment},
            success: function (response) {
                alert(response['msg'])
                window.location.reload()
            }
        });
    }