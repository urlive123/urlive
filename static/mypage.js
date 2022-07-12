$(document).ready(function () {
    showMyLike()
    showMyUpload()
    console.log("clicked!")

});

function youtube_parser(url) {
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}

function showMyLike() {
    $.ajax({
        type: "GET",
        url: "/api/mypageheart",
        data: {},
        success: function (response) {
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
            }
        }
    });
}

function showMyUpload() {
    $.ajax({
        type: "GET",
        url: "/api/myupload",
        data: {},
        success: function (response) {
            console.log('upload', response)
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
            }
        }
    });
}
