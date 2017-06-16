  var registerefc = true;
    var registero = {
      registerp : $(".registerp").val(),
      registerpa : $(".registerpa").val()
    }
 var getInfo= localStorage.getItem("registero");
    //重复点击
    var loginoregio = function() {

          $(".registerob").click(function() {
            if (registerefc) {
            loginos();
            registerefc = false;
            }else{
              toarsters.multiply("服务器正在响应请等待");
            }
          })

      }
    loginoregio();
    $(".confirmnews").keydown(function(e) {
      if (e.keyCode == 13) {
        regirst()
      }
    })
    var loginos = function() {  
      if(registero.registerp == "") toarsters.multiply("请输入密码");
      if (registero.registerp!= registero.registerpa) {
        toarsters.multiply("您输入的两次密码不一致请重新输入");
        // $scope.logino.passwordagain = "";
        // $scope.logino.password="";
      } else {
        // var validate = captchaObj.getValidate();
        $.ajax({
          url: "/p/c/vpwd",
          type: "POST",
          dataType: "json",
          data: {
            "pwd1": registero.registerpa,
            "pwd2": registero.registerp
          },
          success: function(valueHolder) {
            if (valueHolder && (valueHolder.code >= 0)) {
              console.log(valueHolder.code);
              $.ajax({
                url: "/p/c/setpwd",
                type: "POST",
                data: {
                  "pwd1": registero.registerp,
                  //第一个页面传过来的ID
                  "id": getInfo
                },
                success: function(valueHolder) {
                  console.log(valueHolder.code)
                  if (valueHolder && (valueHolder.code >= 0)) {
                    //成功之后禁止用户点击
                    $('.registerob').unbind('click');
                    $state.go('registere')
                  } else {
                    comfirms = true;
                  }
                }
              })
            } else {
              toarsters.multiply("您输入的两次密码不一致请重新输入");
              comfirms = true;
            }
          },
          error: function() {
            toarsters.multiply("服务器响应失败");
          }
        })
      }
    }