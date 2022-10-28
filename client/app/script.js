// var attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.
function validate() {
  var email = document.getElementById("logName").value;
  var password = document.getElementById("logPassword").value;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json; charset=UTF-8");
  var raw = {};
  raw["email"] = email;
  raw["password"] = password;
  const stringifiedData = JSON.stringify(raw);
  var requestOptions = {
    method: "Post",
    headers: myHeaders,
    body: stringifiedData,
    redirect: "follow",
  };
  fetch("http://localhost:8000/login", requestOptions)
    .then((result) => {
      if (result.status == "200") {
        const login = {
          email: email,
          password: password,
        };
        window.sessionStorage.setItem("login", JSON.stringify(login));
        window.location = "index.html";
      } else {
        blankField.textContent = "Please Enter Correct Credentials";
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
}
//----------------------------------------End-------------------------------------//

//---------for refresh-------------//
function refreshPage() {
  window.location.reload();
}

function showpass() {
  var x = document.getElementById("logPassword");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}
//---------------for timer--------------//
function Timer() {
  var btn = document.getElementById("btn").value;
  {
    window.location.href = "Timer.html"; // Redirecting to other page.
  }
}

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

function hello() {
  window.location.href = "login.html"; // Redirecting to other page.
  return false;
}

// Task input get value
// function getTaskVal() {
//   var inputVal = document.getElementById("addTask").value;
//   alert(inputVal);
// }
