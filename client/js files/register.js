let form = document.querySelector(".site-form")
let username = document.getElementById("usernameInput")
let password = document.getElementById("passwordInput")
let file = document.getElementById("uploadInput")
const our_api = "http://192.168.1.181:4000" //shu yerni o'zgartirasiz
const api = our_api+'/register'
let formData = new FormData()
let my_token = localStorage.getItem("userid")
let showButton = document.getElementById("showButton")

if(my_token){
    window.location = "/index"
}

form.addEventListener("submit",async(event)=>{
    event.preventDefault()

    formData.append("file",file.files[0])
    formData.append("username",username.value)
    formData.append("password",password.value)

    let res = await fetch(api,{
        method:"POST",
        body:formData
    })

    res = await res.json()

    if(!res.user){
        alert(res.message)
    }

    else{
        localStorage.setItem("userid",JSON.stringify(res.newObj))
        window.location = "/index"
    }
})


showButton.addEventListener("click",()=>{
    if(password.type == 'password'){
        password.type = "text"
    }
    else{
        password.type = "password"
    }
})