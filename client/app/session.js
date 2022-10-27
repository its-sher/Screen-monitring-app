function store() {
  //stores items in the sessionStorage
  var email = document.getElementById("logName").value;
  var password = document.getElementById("logPassword").value;

  const login = {
    email: email,
    password: password,
  };
  window.sessionStorage.setItem("login", JSON.stringify(login));
}
//   function removeItem() {//deletes item from sessionStorage
//     sessionStorage.removeItem('Login_form');
//     console.log("login");
// }

window.onload = function () {
  //ensures the page is loaded before functions are executed.
  document.getElementById("Login_form").onclick = store;
  //document.getElementById("removeButton").onclick = removeItem;
};

// Get the text field that we're going to track
// let field = document.getElementById("logName");
// if (sessionStorage.getItem("email")) {
//   field.value = sessionStorage.getItem("email");
// }
// field.addEventListener("change", () => {
//   sessionStorage.setItem("email", field.value);
// });
// let field1 = document.getElementById("logPassword");
// if (sessionStorage.getItem("password")) {
//   field1.value = sessionStorage.getItem("password");
// }
// field1.addEventListener("change", () => {
//   sessionStorage.setItem("password", field1.value);
// });
