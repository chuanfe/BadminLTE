(function ($) {
  var my_skinss = [
    "skin-blue",
    "skin-black",
    "skin-red",
    "skin-yellow",
    "skin-purple",
    "skin-green",
    "skin-blue-light",
    "skin-black-light",
    "skin-red-light",
    "skin-yellow-light",
    "skin-purple-light",
    "skin-green-light"
  ];
  setups();

  function change_skins(cls) {
    $.each(my_skinss, function (i) {
      $("body").removeClass(my_skinss[i]);
    });

    $("body").addClass(cls);
    stores('skin', cls);
    return false;
  }
  function stores(name, val) {
    if (typeof (Storage) !== "undefined") {
      localStorage.setItem(name, val);
    } else {
      window.alert('Please use a modern browser to properly view this template!');
    }
  }
  function gets(name) {
    if (typeof (Storage) !== "undefined") {
      console.log("name")
      return localStorage.getItem(name);
    } else {
      window.alert('请正确使用现代浏览器来查看!');
    }
  }
  function setups() {
    var tmp = gets('skin');
    if (tmp && $.inArray(tmp, my_skinss))
      change_skins(tmp);
  }
})(jQuery);
