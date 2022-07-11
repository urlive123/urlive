$(document).ready(function () {
    show_list();
});

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
                let temp_html = `<div class="card" style="width: 18rem;">
                                          <img src="http://i.ytimg.com/vi/F69_yzzCKpA/0.jpg" class="card-img-top" alt="...">
                                             <div class="card-body">
                                              <h5 class="card-title">${title}</h5>
                                              <p class="card-text">${content}</p>
                                              <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#detailModal">
                                               동영상 보기!
                                              </button>
                                             </div>
                                 </div>
                                        <!-- Modal Detail -->
                                        <div class="modal fade" id="detailModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div class="modal-dialog modal-lg">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <iframe width="766" height="431" src="https://www.youtube.com/embed/F69_yzzCKpA"
                                                                title="YouTube video player" frameborder="0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowfullscreen></iframe>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`
                $('.card-wrap').prepend(temp_html)
            }
        }
    });
}

function post_list() {
    let title = $('').val()
    let content = $('').val()
    let artist = $('').val()
    let url = $('').val()
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