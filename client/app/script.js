//----------------------------Form validation-------------------------Start------------//
  function validate(){
    var logName = document.getElementById("logName").value;
    var logPassword = document.getElementById("logPassword").value;
    if (logName == "user" && logPassword == "12345"){
    window.location.href = "index.html"; // Redirecting to other page.
    return false;
    }
    else{
    document.querySelector(".emailerror2").innerHTML = 'Please enter the correct Password';
    // if( attempt ==3 ){
    // document.getElementById("logName").disabled = false;
    // document.getElementById("logPassword").disabled = false;
    // document.getElementById("submit").disabled = true;
    // return false;
    // }
    }
    }

 //----------------------------------------End-------------------------------------//   
  
//--------------------------Fetch Data from Api------------------Start-----------------//
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

//--------------------------Fetch Data from Api------------------Start-----------------//
   var i=0;
   function increase()
   {
       i++;
   alert("I am alert box number"    + ' '+   (i));  
    //check if we should kick them out
   if (i> 4) {
       //two plus signs will increment our variable by one
   alert("Please Go Away ! You have been warned");
   self.close();
   
           } 
     }
        //-------------------------------------------End-------------------------------------------//