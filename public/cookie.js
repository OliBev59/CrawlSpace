var today = new Date();
var expiry = new Date(today.getTime() + 30 * 24 * 3600 * 1000); // plus 30 days

function setCookie(name, value)
{
  document.cookie=name + "=" + escape(value) + "; path=/; expires=" + expiry.toGMTString();
}
function putCookie(form){            //this should set the UserName cookie to the proper value;
 console.log("cookies working")
 setCookie("userName", form[0].username.value);

  return true;
}
function eraseCookie(){
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
