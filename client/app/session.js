function store() { //stores items in the sessionStorage
    var email = document.getElementById('logName').value;
    var password = document.getElementById('logPassword').value;
  
    const login = {
        email: email,
        password: password,
    }
    window.sessionStorage.setItem('login',JSON.stringify(login));  
  }

  window.onload =function() { //ensures the page is loaded before functions are executed.
        document.getElementById("Login_form").onsubmit = store;
  }
