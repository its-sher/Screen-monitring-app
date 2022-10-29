// var attempt = 3; // Variable to count number of attempts.
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

//=======================================project-list===============================//

function Projectlist() {
  var myHeaders = new Headers();
  myHeaders.append(
    "token",
    "ZjIzYzU4NjQtNmY0MS00NTExLWE5ZTctMDRjMmJlZTczM2MwMmRkZDk5ZmE0NGU1NjhiNGI4MmVmM2MzZjNiZTJmMjI="
  );

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("http://localhost:8000/project/1", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

//============================================end===================================//

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
  document.querySelector("#select").style.display = "none";
  document.querySelector(".plus_icon").style.display = "none";
}

function AddTaskCancel() {
  document.querySelector(".AddTaskInput").style.display = "none";
  document.querySelector("#select").style.display = "block";
  document.querySelector(".plus_icon").style.display = "block";
}

function AddTaskInput() {
  document.querySelector(".AddTaskSave").style.display = "block";
}

function hello() {
  sessionStorage.clear();
  window.location.href = "login.html"; // Redirecting to other page.
  return false;
}

//Add value to dropdown
function insertValue() {
  var select = document.getElementById("select"),
    txtval = document.getElementById("val").value,
    newOption = document.createElement("OPTION"),
    newOptionVal = document.createTextNode(txtval);
  newOption.appendChild(newOptionVal);
  select.insertBefore(newOption, select.lastChild);
}
