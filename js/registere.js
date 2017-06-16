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
            product: "popup",
            offline: !data.success
        },
        handlerPopup);
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
var datas;
// $scope.comfirms = true;
// console.log(dataService.registere)
var filters = /^0?1[3|4|5|8][0-9]\d{8}$/;
//极验
var handlerPopup = function(captchaObj) {
    captchaObj.onSuccess(function() {
        var validate = captchaObj.getValidate();
        $.ajax({
            url: "/p/c/smsg",
            // 进行二次验证
            type: "POST",
            dataType: "json",
            data: {
                type: "pc",
                phone: $('.searchuser').val(),
                geetest_challenge: validate.geetest_challenge,
                geetest_validate: validate.geetest_validate,
                geetest_seccode: validate.geetest_seccode
            },
            success: function(valueHolder) {
                if (valueHolder && (valueHolder.code >= 0)) {
                    datas = valueHolder.data;
                } else if (valueHolder.code == undefined) {
                    toarsters.multiply("服务器请求失败");
                } else {
                    toarsters.multiply(valueHolder.message);
                }
            },
            error: function() {
                toarsters.multiply("服务器请求错误");
            }
        });
    });
    //发送验证码
    $(".serchbutton").click(function() {
      console.log("aaa")
        var falses = filters.test(parseInt($('.searchuser').val()))
        console.log("llllll")
        console.log(falses)
        if (falses) {
            // send.ToSend() 
            captchaObj.show();
            send.time(this)
            console.log(this)
        } else {
            console.log("pppppppp")
            toarsters.multiply("您输入的手机号码不正确");
        }
    });
    captchaObj.appendTo("#popup-captcha");
};

//重复点击
$(".registerxyb").click(function() {
    // if ($scope.comfirms) {
    if ($('.searchuser').val()) {
        if ($('.searchword').val()) {

            send.TosendH();
            // $scope.comfirms = false;
            // console.log($scope.comfirms)
        } else {
            toarsters.multiply("您输入的验证码");
        }
    } else {
        toarsters.multiply("您输入的手机号码不正确");
    }
    // } else {
    // toarsters.multiply("服务器正在响应请等待");
    // }
})

///倒计时以及下一步
var send = {
    wait: 60,
    time: function(o) {
      console.log("time")
      console.log(send.wait)
        if (send.wait == 0) {
            o.removeAttribute("disabled");
            o.value = "发送验证码";
            send.wait = 60;
        } else {

            o.setAttribute("disabled", true);
            o.innerHTML = "重新发送(" + send.wait + ")";
            send.wait--;
            setTimeout(function() {
                send.time(o)
            },
            1000)
        }
    },
    TosendH: function() {
        $.ajax({
            url: "/p/c/verify",
            type: "GET",
            dataType: "json",
            data: {
                "id": datas,
                "code": $('.searchword').val()
            },
            success: function(valueHolder) {
                if (valueHolder && (valueHolder.code >= 0)) {
                    var dataService = valueHolder.data;
                    localStorage.setItem("registero", dataService);
                    $('.registerxyb').unbind('click');
                   
                    //该密码第二个页面
                  location.href ="/app/tpl/login/registero";

                } else {
                    toarsters.multiply(valueHolder.message);
                }
            },
            error: function() {
                toarsters.multiply("服务器请求失败");
            }
        });
    }
}