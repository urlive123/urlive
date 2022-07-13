var transparent = true;
var big_image;

var transparentDemo = true;
var fixedTop = false;

var navbar_initialized,
  backgroundOrange = false,
  toggle_initialized = false;

var nowuiKit,
  $navbar,
  scroll_distance,
  oVal;

$(document).ready(function() {
  //  Activate the Tooltips
  $('[data-toggle="tooltip"], [rel="tooltip"]').tooltip();

  // Activate Popovers and set color for popovers
  $('[data-toggle="popover"]').each(function() {
    color_class = $(this).data('color');
    $(this).popover({
      template: '<div class="popover popover-' + color_class + '" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
    });
  });

  // Activate the image for the navbar-collapse
  nowuiKit.initNavbarImage();

  $navbar = $('.navbar[color-on-scroll]');
  scroll_distance = $navbar.attr('color-on-scroll') || 500;

  // Check if we have the class "navbar-color-on-scroll" then add the function to remove the class "navbar-transparent" so it will transform to a plain color.

  if ($('.navbar[color-on-scroll]').length != 0) {
    nowuiKit.checkScrollForTransparentNavbar();
    $(window).on('scroll', nowuiKit.checkScrollForTransparentNavbar)
  }

  $('.form-control').on("focus", function() {
    $(this).parent('.input-group').addClass("input-group-focus");
  }).on("blur", function() {
    $(this).parent(".input-group").removeClass("input-group-focus");
  });

  // Activate bootstrapSwitch
  $('.bootstrap-switch').each(function() {
    $this = $(this);
    data_on_label = $this.data('on-label') || '';
    data_off_label = $this.data('off-label') || '';

    $this.bootstrapSwitch({
      onText: data_on_label,
      offText: data_off_label
    });
  });

  if ($(window).width() >= 992) {
    big_image = $('.page-header-image[data-parallax="true"]');

    $(window).on('scroll', nowuiKitDemo.checkScrollForParallax);
  }

  // Activate Carousel
  $('.carousel').carousel({
    interval: 4000
  });

  $('.date-picker').each(function() {
    $(this).datepicker({
      templates: {
        leftArrow: '<i class="now-ui-icons arrows-1_minimal-left"></i>',
        rightArrow: '<i class="now-ui-icons arrows-1_minimal-right"></i>'
      }
    }).on('show', function() {
      $('.datepicker').addClass('open');

      datepicker_color = $(this).data('datepicker-color');
      if (datepicker_color.length != 0) {
        $('.datepicker').addClass('datepicker-' + datepicker_color + '');
      }
    }).on('hide', function() {
      $('.datepicker').removeClass('open');
    });
  });


});

// Javascript just for Demo purpose, remove it from your project
nowuiKitDemo = {
  checkScrollForParallax: debounce(function() {
    var current_scroll = $(this).scrollTop();


// 내가 업로드한 영상 조회
function showMyUpload() {
    $.ajax({
        type: "GET",
        url: "/api/my-contents-by-upload",
        data: {},
        success: function (response) {
            console.log('my like', response['contents'])
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
                                              <button onclick="comment_listing('${objectId}')" href="#" type="button" class="btn btn-you-tube icon-onl" data-bs-toggle="modal" data-bs-target="#detailModal${objectId}">
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
                                                            <tbody id="comment${objectId}">                                                         
                                                            </tbody>
                                                        </table>
                                                        <div class="form-floating">
                                                            <textarea class="form-control" placeholder="Leave a comment" id="commentpost${objectId}"></textarea>
                                                            <label for="floatingTextarea">댓글 달기</label>
                                                            <button onclick="comment_posting('${objectId}')" style="float: right" type="button" class="btn btn-outline-dark mt-2">등록</button>
                                                        </div>
                                                        </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn" data-bs-dismiss="modal">Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`
                $('#live_like').append(temp_html)
                // 모달창 종료시 영상 멈춤
                $(document).on('hidden.bs.modal', `#detailModal${objectId}`, function () {
                    $(`#detailModal${objectId} iframe`).attr("src", $(`#detailModal${objectId} iframe`).attr("src"))
                })
            }
        }

    oVal = ($(window).scrollTop() / 3);
    big_image.css({
      'transform': 'translate3d(0,' + oVal + 'px,0)',
      '-webkit-transform': 'translate3d(0,' + oVal + 'px,0)',
      '-ms-transform': 'translate3d(0,' + oVal + 'px,0)',
      '-o-transform': 'translate3d(0,' + oVal + 'px,0)'

    });

  }, 6)

}

// 내가 좋아요 누른 영상 조회
function showMyLike() {
    $.ajax({
        type: "GET",
        url: "/api/my-contents-by-likes",
        data: {},
        success: function (response) {
            console.log('my like', response['contents'])
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
                                              <button onclick="comment_listing('${objectId}')" href="#" type="button" class="btn btn-you-tube icon-onl" data-bs-toggle="modal" data-bs-target="#detailModal${objectId}">
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
                                                            <tbody id="comment${objectId}">                                                         
                                                            </tbody>
                                                        </table>
                                                        <div class="form-floating">
                                                            <textarea class="form-control" placeholder="Leave a comment" id="commentpost${objectId}"></textarea>
                                                            <label for="floatingTextarea">댓글 달기</label>
                                                            <button onclick="comment_posting('${objectId}')" style="float: right" type="button" class="btn btn-outline-dark mt-2">등록</button>
                                                        </div>
                                                        </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn" data-bs-dismiss="modal">Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`
                $('#live_upload').append(temp_html)
                // 모달창 종료시 영상 멈춤
                $(document).on('hidden.bs.modal', `#detailModal${objectId}`, function () {
                    $(`#detailModal${objectId} iframe`).attr("src", $(`#detailModal${objectId} iframe`).attr("src"))
                })
            }
        }
    });
}

//댓글 보이기
function comment_listing(id) {
    $(`#comment${id}`).empty();
    $.ajax({
        type: 'GET',
        url: '/main/comment',
        data: {},
        success: function (response) {
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

//댓글 조회
function comment_listing(id) {
    $(`#comment${id}`).empty();
    $.ajax({
        type: 'GET',
        url: '/api/comments',
        data: {},
        success: function (response) {
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
                action_give: "like",
            },
            success: function (response) {
                $i_like.addClass("bi-suit-heart-fill").removeClass("bi-suit-heart")
                $a_like.find("span.like-num").text(response["count"])
            }
        })

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
};

$(window).on('resize', function() {
  nowuiKit.initNavbarImage();
});

$(document).on('click', '.navbar-toggler', function() {
  $toggle = $(this);

  if (nowuiKit.misc.navbar_menu_visible == 1) {
    $('html').removeClass('nav-open');
    nowuiKit.misc.navbar_menu_visible = 0;
    $('#bodyClick').remove();
    setTimeout(function() {
      $toggle.removeClass('toggled');
    }, 550);
  } else {
    setTimeout(function() {
      $toggle.addClass('toggled');
    }, 580);
    div = '<div id="bodyClick"></div>';
    $(div).appendTo('body').click(function() {
      $('html').removeClass('nav-open');
      nowuiKit.misc.navbar_menu_visible = 0;
      setTimeout(function() {
        $toggle.removeClass('toggled');
        $('#bodyClick').remove();
      }, 550);
    });

    $('html').addClass('nav-open');
    nowuiKit.misc.navbar_menu_visible = 1;
  }
});

nowuiKit = {
  misc: {
    navbar_menu_visible: 0
  },

  checkScrollForTransparentNavbar: debounce(function() {
    if ($(document).scrollTop() > scroll_distance) {
      if (transparent) {
        transparent = false;
        $('.navbar[color-on-scroll]').removeClass('navbar-transparent');
      }

    } else {
      if (!transparent) {
        transparent = true;
        $('.navbar[color-on-scroll]').addClass('navbar-transparent');
      }
    }
  }, 17),

  initNavbarImage: function() {
    var $navbar = $('.navbar').find('.navbar-translate').siblings('.navbar-collapse');
    var background_image = $navbar.data('nav-image');

    if (background_image != undefined) {
      if ($(window).width() < 991 || $('body').hasClass('burger-menu')) {
        $navbar.css('background', "url('" + background_image + "')")
          .removeAttr('data-nav-image')
          .css('background-size', "cover")
          .addClass('has-image');
      } else {
        $navbar.css('background', "")
          .attr('data-nav-image', '' + background_image + '')
          .css('background-size', "")
          .removeClass('has-image');
      }
    }
  },


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
            type: 'POST',
            url: '/api/content',
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

  initSliders: function() {
    // Sliders for demo purpose in refine cards section
    var slider = document.getElementById('sliderRegular');

    noUiSlider.create(slider, {
      start: 40,
      connect: [true, false],
      range: {
        min: 0,
        max: 100
      }
    });

    var slider2 = document.getElementById('sliderDouble');

    noUiSlider.create(slider2, {
      start: [20, 60],
      connect: true,
      range: {
        min: 0,
        max: 100
      }
    });
  }
}

// Javascript just for Demo purpose, remove it from your project
nowuiKitDemo = {
  checkScrollForParallax: debounce(function() {
    var current_scroll = $(this).scrollTop();

    oVal = ($(window).scrollTop() / 3);
    big_image.css({
      'transform': 'translate3d(0,' + oVal + 'px,0)',
      '-webkit-transform': 'translate3d(0,' + oVal + 'px,0)',
      '-ms-transform': 'translate3d(0,' + oVal + 'px,0)',
      '-o-transform': 'translate3d(0,' + oVal + 'px,0)'
    });
  }, 6)
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
};
