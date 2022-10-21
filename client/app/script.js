var attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.
function validate(){
var username = document.getElementById("logName").value;
var password = document.getElementById("logPassword").value;
if ( username == "akshay" && password == "akshay"){
window.location = "index.html"; // Redirecting to other page.
return false;
}
else{
attempt --;// Decrementing by one.
alert("You have left "+attempt+" attempt;");
// Disabling fields after 3 attempts.
if( attempt == 0){
document.getElementById("logName").disabled = true;
document.getElementById("logPassword").disabled = true;
document.getElementById("submit").disabled = true;
return false;
}
}
}
  function hello(){
    window.location.href = "login.html"; // Redirecting to other page.
    return false; 
  }
//----------------------------------------End-------------------------------------//   

//--------------------------Post------------------Start-----------------//
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json; charset=UTF-8");
myHeaders.append("access_token", "MTNlZTU4NGUtYjE3MC00MmMyLWIwYWMtN2Y0ZTU5OWEwMTE2MmRkZDk5ZmE0NGU1NjhiNGI4MmVmM2MzZjNiZTJmMjI=");
myHeaders.append("refresh_token", "2ddd99fa44e568b4b82ef3c3f3be2f22");

var raw = "{\r\n    \"email\": \"abc@gmail.com\",\r\n    \"password\": \"password1@\"\r\n}";
// \r\n\:Used as a new line character in Windows

var requestOptions = {
  method: 'Post',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://localhost:8000/login", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

//-------------------------------------------End-------------------------------------------//

//---------for refresh-------------//
function refreshPage(){
  window.location.reload();
} 

//---------------for timer--------------//
function Timer(){
var btn = document.getElementById("btn").value;
{
window.location.href = "Timer.html"; // Redirecting to other page.
}};
// function update() {
// 	var select = document.getElementById('input');
// 	var option = select.options[select.selectedIndex];
// 	document.getElementById('value').value = option.value;
// }
// update();

//--------for add task field --------//
  function plus_icon() {
    document.querySelector(".AddTaskInput").style.display = "block";
    document.querySelector("#input").style.display = "none";
    document.querySelector(".plus_icon").style.display = "none";
  }

  function AddTaskCancel() {
    document.querySelector(".AddTaskInput").style.display = "none";
    document.querySelector("#input").style.display = "block";
    document.querySelector(".plus_icon").style.display = "block";
  }

  function AddTaskInput() {
    document.querySelector(".AddTaskSave").style.display = "block";
  }
 
