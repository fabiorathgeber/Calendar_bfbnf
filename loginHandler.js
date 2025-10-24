import {addUser, checkUser} from './clientreq.js'

const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton")

// const usernameInputLogin = document.querySelector("#usernameInputLogin");
// console.log(usernameInputLogin)
const usernameInputLogin = document.getElementById("usernameInputLogin");
const passwordInputLogin = document.querySelector("#passwordInputLogin");

const usernameInputSignup= document.querySelector("#usernameInputSignup");
const passwordInputSignup = document.querySelector("#passwordInputSignup");

const errorMessageDisplay = document.querySelector("#errorMessageDisplay")

globalThis.user_id = 0;


if(signupButton) {
    signupButton.addEventListener('click', async () => {

        const user = usernameInputSignup.value;
        const pass = passwordInputSignup.value;

        const result = await addUser(user, pass);

        if(result=='Username is already in use') {
            errorMessageDisplay.textContent = "Username is already in use"
            return;
        }
                localStorage.setItem("user_id", result[0].id)

        user_id = result[0].id;
        console.log('here')
        console.log(user_id)

        window.location.href = '/main.html'







    });
}
if(loginButton) {
    console.log(loginButton)
    loginButton.addEventListener('click', async ()=> {
        const user = usernameInputLogin.value;
        const pass = passwordInputLogin.value;

        const result = await checkUser(user, pass)
        console.log(result)
        if (result==-1) {
            errorMessageDisplay.textContent = "Username or password is incorrect"
            return;
        }

        localStorage.setItem("user_id", result[0].id)

        user_id = result[0].id;
                console.log('here')
        console.log(user_id)

        window.location.href = '/main.html'



    });
}
console.log('user id doesnt equal 0 ')

//bruh i couldve just used a form

// update i think i can do it with cookies and sessions ids but i really dont wanna do that right now