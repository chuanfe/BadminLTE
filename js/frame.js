
// 创建构造器
var Parent = Vue.extend({
  template: '<div id="abc"><p></p></div>'
});

var vm = new Vue({
  el: '#app',
  data: {
    displayNow: {},
    componentId: Parent,
    childId: "",
    childs: {},
    params: {},
    ajaxdata: "",
    indexHtml: "",
    isCache: true
  },
  watch: {
    componentId: {
      handler: function(val, oldVal) {
        if(oldVal == "SalInq"){
          Vue.delete(vm.params, 'SalInq');
        }
        Vue.nextTick(function() {
          var conf = val + "_conf";
          if (val == undefined || val == 'HomePage') {
            vm.homePageShow();
            val = "HomePage";
            $('.content-header').addClass('hide')
          } else {
            $('.content-header').removeClass('hide')
          }
          if (val.indexOf('_ng') > -1) {
            var $div = document.querySelector("#agDiv");
            angular.bootstrap($div, ["index"]);
          }
          if (window[conf]) {
            
                for (var i = 0; i < window[conf].after.length; i++) {
                    $.ajax({
                      url: window[conf].after[i],
                      type: "GET",
                      dataType: "script",
                      cache: vm.isCache,
                      async: false,
                      error: function(response, status) {
                        console.log(status);
                      }
                    });
                  }        
          }
          if (vm.childs[val] && vm.childs[val].length > 0 && document.getElementsByName(vm.childs[val]).length > 0) {
            vm.showchild(null, document.getElementsByName(vm.childs[val]));
          }
        })
      }
    },
    childs: {
      handler: function(val, oldVal) {
        Vue.nextTick(function() {
          if (!vm.childs[vm.componentId] || vm.childs[vm.componentId].length <= 0) {
            return;
          }
          var conf = vm.childs[vm.componentId] + "_conf";
          if (vm.childs[vm.componentId].indexOf('_ng') > -1) {
            var $div = document.querySelector("#agDiv");
            angular.bootstrap($div, ["index"]);
          }
          if (window[conf]) {
            for (var i = 0; i < window[conf].after.length; i++) {
              $.ajax({
                url: window[conf].after[i],
                type: "GET",
                dataType: "script",
                cache: vm.isCache,
                async: false,
                error: function(response, status) {
                  console.log(status);
                }
              });
            }
          }
        })
      }
    }
  },
  components: {
    'parent': Parent
  },
  methods: {

    kill: function(e) {
      e.stopPropagation()
      var buttonText = event.currentTarget;
      var parent = $(buttonText).parent(); //删除元素
      var value = $(buttonText).parent().attr('name'); //标志删除的是哪一个
      var size = 0;
      for (i in this.displayNow) {
        size++;
      }

      if (this.displayNow != undefined && this.displayNow.hasOwnProperty(value)) { //存在
        // console.log('存在进入');
        if (size == 1) { //只剩下一个这一个节点
          $(buttonText).parent().remove();
          this.componentId = "Parent";
          $('.sidebar .sidebar-list>ul li').removeClass('clickbg'); //侧边栏清空
        } else if (parent.prev().length == 0) { //前面不存在节点

          //console.log($('.sidebar-menu li[name='+value+']').attr('name'));
          this.componentId = parent.next().attr('name');
          $('.content-wrapper .content-header ul li').removeClass('active');
          $(buttonText).parent().next().addClass('active');
          $('.sidebar .sidebar-list>ul li').removeClass('clickbg'); //侧边栏清空
          $('.sidebar .sidebar-list>ul li[name="' + $(buttonText).parent().next().attr('name') + '"]').addClass('clickbg')
          $(buttonText).parent().remove();
        } else { //前面存在

          //console.log($('.sidebar-menu li[name='+value+']').attr('name'));
          this.componentId = parent.prev().attr('name');
          $('.content-wrapper .content-header ul li').removeClass('active');
          $(buttonText).parent().prev().addClass('active')
          $('.sidebar .sidebar-list>ul li').removeClass('clickbg'); //侧边栏清空
          $('.sidebar .sidebar-list>ul li[name="' + $(buttonText).parent().prev().attr('name') + '"]').addClass('clickbg')
          $(buttonText).parent().remove();
        }
      }
      if (vm.$refs[value]) {
        vm.$refs[value].$destroy();
      }
      delete this.displayNow[value];
      Vue.delete(vm.childs, value);
      Vue.delete(vm.params, value);
      Vue.delete(vm.$refs, value);
    },
    showchild: function(act, ele) {
      var target;
      if (ele) {
        target = ele;
      } else {
        target = event.currentTarget
      }
      var url = $(target).attr("url"); //保存模块地址
      var text = $(target).text();
      var value = $(target).attr("name"); //保存选中id
      var ajaxdata = '';
      var self = this;
      $.ajax({
        url: url,
        dataType: "html",
        async: false,
        success: function(pdata) {
          ajaxdata = pdata;

        }
      });

      var conf = value + "_conf";

      confjs = "/js/m/" + value + "_conf" + ".js";
      $.ajax({
        url: confjs,
        type: "GET",
        dataType: "script",
        cache: vm.isCache,
        async: false,
        success: function(response, status) {
          //console.log(response);
        },
        error: function(response, status) {
          console.log(status);
        }
      });

      if (window[conf]) {
        for (var i = 0; i < window[conf].before.length; i++) {
          $.ajax({
            url: window[conf].before[i],
            type: "GET",
            dataType: "script",
            cache: vm.isCache,
            async: false,
            success: function(response, status) {
              //console.log(response);

            },
            error: function() {
              //console.log('error');
            }
          });
        }
      }
      if (window[value]) {
        if (!ele) {
          Vue.delete(self.params, self.componentId);
        }
        //console.log(window[indexAA[1]]);
        window[value].template = ajaxdata;
        var component = Vue.extend(window[value]);
        Vue.component(value, component);
        Vue.delete(self.childs, self.componentId);
        Vue.set(self.childs, self.componentId, value);
        //self.childId = value;
      } else {
        if (!ele) {
          Vue.delete(self.params, self.componentId);
        }
        var component = Vue.extend({
          template: ajaxdata
        });
        Vue.component(value, component);
        Vue.delete(self.childs, self.componentId);
        Vue.set(self.childs, self.componentId, value);
        //self.childId = value;
      }

    },
    toshow: function(act, ele, childEle) {
      var target;
      if (ele) {
        target = ele;
      } else {
        target = event.currentTarget
      }
      var self = this;
      var url = $(target).attr("url"); //保存模块地址
      var text = $(target).text();
      var value = $(target).attr("name"); //保存选中id
      var dir = $(target).attr("dir"); //安全目录
      var isPass = true;
      if(dir && dir.length > 0){
         $.ajax({
            url: "p/cs/checkPermission",
            type: "POST",
            data: {PARAM:dir},
            async: false,
            success: function(data) {
                if(data.code < 0){
                    isPass = false;
                    alert(data.msg);
                }
            },
            error: function(response, status) {
              isPass = false;
              alert("服务器出错，请重试！");
            }
          });
          if(!isPass){
            return;
          }
      }
      var oldcomponentId = this.componentId;
      if (this.displayNow != undefined && this.displayNow.hasOwnProperty(value)) { //存在
        this.componentId = value;
        $('.content-wrapper .content-header ul li').removeClass('active');
        $(target).addClass('active');
        $('.content-wrapper .content-header ul li[name=' + $(target).attr('name') + ']').addClass('active');
        $('.sidebar .sidebar-list>ul li').removeClass('clickbg');
        $('.sidebar .sidebar-list>ul li[name='+$(target).attr('name')+']').addClass('clickbg')
        var headwidth = $('.content-wrapper .content-header').width();
        var list = $('.content-wrapper .content-header ul li');
        var sumwidth = 142 * (list.length);
        if (sumwidth > headwidth) {
          var smallwidth = (headwidth - 142) / (list.length - 1);
          $('.content-wrapper .content-header ul li').css('width', smallwidth - 20);
          $('.content-wrapper .content-header ul li.active').css('width', 142);
        } else {

        }

        if(vm.componentId == "VipDetail"  && oldcomponentId == "VipDetail"){

          
          confjs2 = "/js/m/VipDetail/VipDetail" + ".js";

          $.ajax({
            url: confjs2,
            type: "GET",
            dataType: "script",
            cache: true,
            async: false,
            success: function(response, status) {
              //console.log(response);

            },
            error: function(response, status) {
              console.log(status);
            }
          });

        }
        //return;
      } else if (!this.displayNow.hasOwnProperty(value)) { //不存在

        var valuehtml = $(target).find('span').html();

        var li = $('<li onclick="vm.toshow()" class="active" name="' + $(target).attr('name') + '" name="' + $(target).attr('name') + '">' + valuehtml + '<i onclick=vm.kill(event)></i></li>');
        var list = $('.content-wrapper .content-header ul li');

        $('.content-wrapper .content-header ul li').removeClass('active');
        $('.content-wrapper .content-header ul').append(li);

        var headwidth = $('.content-wrapper .content-header').width();
        $('.sidebar .sidebar-list>ul li').removeClass('clickbg');
        $(target).addClass('clickbg');
        $('.sidebar .sidebar-list>ul li[name="'+$(target).attr('name')+'"]').addClass('clickbg');
        var sumwidth = 142 * (list.length + 1);
        if (sumwidth > headwidth) {
          var smallwidth = (headwidth - 142) / (list.length);
          $('.content-wrapper .content-header ul li').css('width', smallwidth - 20);
          $('.content-wrapper .content-header ul li:last-child').css('width', 142);
        } else {

        }
        var ajaxdata = '';
        $.ajax({
          url: url,
          dataType: "html",
          async: false,
          success: function(pdata) {
            ajaxdata = pdata;

          }
        });

        var conf = value + "_conf";
        confjs = "/js/m/" + value + "_conf" + ".js";

        $.ajax({
          url: confjs,
          type: "GET",
          dataType: "script",
          cache: vm.isCache,
          async: false,
          success: function(response, status) {
            //console.log(response);

          },
          error: function(response, status) {
            console.log(status);
          }
        });

        if (window[conf]) {
          for (var i = 0; i < window[conf].before.length; i++) {
            $.ajax({
              url: window[conf].before[i],
              type: "GET",
              dataType: "script",
              cache: vm.isCache,
              async: false,
              success: function(response, status) {
                //console.log(response);

              },
              error: function(response, status) {
                console.log(status);
              }
            });
          }
        }

        if (window[value]) {
          //console.log(window[indexAA[1]]);
          window[value].template = ajaxdata;
          var component = Vue.extend(window[value]);
          Vue.component(value, component);
          self.componentId = value;
          self.displayNow[value] = value;
        } else {
          var component = Vue.extend({
            template: ajaxdata
          });
          Vue.component(value, component);
          self.componentId = value;
          self.displayNow[value] = value;
        }
      }
      if (childEle) {
        Vue.set(self.childs, self.componentId, childEle);
      } else if (!self.childs[self.componentId]) {
        Vue.set(self.childs, self.componentId, "");
      }

    },
    homePageShow: function() {
      var self = this;
      var iscache = true;
      if (vm) {
        iscache = vm.isCache;
      }
      var url = "/pages/home/homePage.html";
      var value = "homePage";
      var ajaxdata = '';
        $.ajax({
          url: url,
          dataType: "html",
          async: false,
          success: function(pdata) {
            ajaxdata = pdata;

          }
        });

        var conf = value + "_conf";
        confjs = "/js/m/" + value + "_conf" + ".js";

        $.ajax({
          url: confjs,
          type: "GET",
          dataType: "script",
          cache: iscache,
          async: false,
          success: function(response, status) {
            //console.log(response);

          },
          error: function(response, status) {
            console.log(status);
          }
        });

        if (window[conf]) {
          for (var i = 0; i < window[conf].before.length; i++) {
            $.ajax({
              url: window[conf].before[i],
              type: "GET",
              dataType: "script",
              cache: iscache,
              async: false,
              success: function(response, status) {
                //console.log(response);

              },
              error: function(response, status) {
                console.log(status);
              }
            });
          }
        }

        if (window[value]) {
          //console.log(window[indexAA[1]]);
          window[value].template = ajaxdata;
          var component = Vue.extend(window[value]);
          Vue.component(value, component);
          self.componentId = value;
          self.displayNow[value] = value;
        } else {
          var component = Vue.extend({
            template: ajaxdata
          });
          Vue.component(value, component);
          self.componentId = value;
          self.displayNow[value] = value;
        }
    },

    touch:function(){
      $.ajax({
        url:'/p/cs/touch',
        dataType:'json',
        type:'GET',
        success:function(res){

        },
        error:function(){

        }
      })
    }

  },
  mounted:function(){  //界面加载完毕
    this.homePageShow();
    var _self = this;
    setInterval(function(){
      _self.touch();
    },900000)

  }


});