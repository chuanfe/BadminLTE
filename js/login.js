;(function(){
   $(document).ajaxStart(function(){
     console.log('start')
  }).ajaxStop(function(){
    console.log('stop')
  })
   $.ajax({
      url: "/verify/captcha?t=" + (new Date()).getTime(),
      // 加随机数防止缓存
      type: "get",
      dataType: "json",
      beforeSend:function(xhr){
        xhr.setRequestHeader("client_type","DESKTOP_WEB");
      },
      success: function(data) {
        initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          product: "float",
          offline: !data.success
        }, handlerEmbed);
      }
    });
var toarsters = {
  multiply : function(message){
    toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };
  toastr["error"](message, "请重新输入");
  }
}
var sublimtT = true;
var handlerEmbed = function(captchaObj) {
    
        $(".searchpass").keydown(function(e) {
          if (e.keyCode == 13) {
            if ($('.searchuser').val() && $('.searchpass').val()) {
              if (captchaObj.getValidate()) {
                $('#embed-submit').trigger("click");
              } else {
                toarsters.multiply("滑动验证码")
              }
            } else {
              toarsters.multiply("用户名或者密码不正确")
              $('.searchpass').val("");
            }
          }
        });
          $("#embed-submit").click(function(e) {
            // console.log("aaa")
            if(sublimtT) {
                sublimtT = false
            $(this).css("background", "#2ad798")
            if ($('.searchuser').val() && $('.searchpass').val()) {
              if (captchaObj.getValidate()) {
                // .ll = false;
                var validate = captchaObj.getValidate();

                $.ajax({
                  url: "/p/cs/login",
                  // 进行二次验证
                  type: "POST",
                  dataType: "json",
                  data: {
                    type: "pc",
                    username: $('.searchuser').val(),
                    password: $('.searchpass').val(),
                    rememberMe: $("#loginCheck").is(':checked'),
                    geetest_challenge: validate.geetest_challenge,
                    geetest_validate: validate.geetest_validate,
                    geetest_seccode: validate.geetest_seccode
                  },
                  success: function(valueHolder) {
                    // console.log(valueHolder.message)
                    if (valueHolder && (valueHolder.code > 0)) {
                      $('#embed-submit').unbind('click');
                      //首页
                      location.href ="/";
                    } else {
                      toarsters.multiply(valueHolder.message);
                      captchaObj.refresh();
                      $('.searchpass').val("");
                     sublimtT = true;
                     $(this).css("background", "#a1b5ca");
                    }
                  },
                  error: function() {
                    toarsters.multiply("服务器请求失败");
                    sublimtT = true;
                    $(this).css("background", "#a1b5ca");
                  }
                });
              } else {
                toarsters.multiply("滑动验证码");
                 sublimtT = true;
                 $(this).css("background", "#a1b5ca");
              }
            } else {
              captchaObj.refresh();
              toarsters.multiply("输入用户名或者密码不正确");
              $('.searchpass').val("");
               sublimtT = true;
               $(this).css("background", "#a1b5ca");
            }

          }
          });

        captchaObj.appendTo("#float-captcha");
        captchaObj.onReady(function() {
          $("#wait")[0].className = "hide";
        });
      };
    if ($("#loginCheck").is(':checked')) {
      console.log("aaa")
      $("#xuaz").css("display", "none")
      $("#wxz").css("display", "block");
    } else {
      $("#xuaz").css("display", "block")
      $("#wxz").css("display", "none");
    }
    $(".loginch label").click(function() {
       console.log("aaa")
      if ($("#loginCheck").is(':checked')) {
        $("#xuaz").css("display", "none")
        $("#wxz").css("display", "block");
      } else {
        $("#xuaz").css("display", "block")
        $("#wxz").css("display", "none");
      }
    })
    $(".loginch #xuaz").click(function() {
      if ($("#xuaz").css("display", "block")) {
        $(this).css("display", "none")
        $("#wxz").css("display", "block");
      } else {
        $(this).css("display", "block")
        $("#wxz").css("display", "none");
      }

    })
    $(".loginch #wxz").click(function() {
      if ($("#wxz").css("display", "block")) {
        $(this).css("display", "none")
        $("#xuaz").css("display", "block");
      } else {
        $(this).css("display", "block")
        $("#xuaz").css("display", "none");
      }
    })
})()