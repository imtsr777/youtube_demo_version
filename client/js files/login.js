const form = document.querySelector(".site-form")

const usernameInput = document.getElementById("usernameInput")
const passwordInput = document.getElementById("passwordInput")
const our_api = "http://192.168.1.181:4000" //shu yerni o'zgartirasiz
let showButton = document.getElementById("showButton")

form.addEventListener("submit",async (event)=>{
    event.preventDefault()
    let res = await fetch(our_api+"/login",{
        method:"post",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({username:usernameInput.value,password:passwordInput.value})
    })
    res = await res.json()
    if(!res.logged){
        alert(res.message)
    }
    else{
        let a = res.user
        localStorage.setItem("userid",JSON.stringify(a))
        window.location = "/index"
    }

})

showButton.addEventListener("click",()=>{
    if(passwordInput.type == 'password'){
        passwordInput.type = "text"
    }
    else{
        passwordInput.type = "password"
    }
})