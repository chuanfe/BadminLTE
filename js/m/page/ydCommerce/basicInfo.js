
//改变选中的设置li样式
$("#basicInfo").find("li").on("click",function(){

	$("#basicInfo").find("li").removeClass("active");
	$(this).addClass("active");
})


$(document).ready(function(){
  let firstLi = $("#basicInfo ul>li:first").attr("name");
  console.log("firstLi",firstLi)
  if ($("#basicInfo ul>li").hasClass("active")) {
    //do nothing
  } else if (vm.childs.basicInfo == '' || vm.childs.basicInfo == undefined) {
    vm.showchild(null,document.getElementsByName(firstLi))
  }

  //改变选中的设置li样式
  if (vm.childs.basicInfo) {
    $("#basicInfo ul>li").removeClass("active");
    $("#basicInfo ul li[name='"+vm.childs.basicInfo+"']").addClass("active")
  }
})



