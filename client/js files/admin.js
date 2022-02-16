
let myid = localStorage.getItem("userid")
if(!myid){
    window.location = "/register"
}
else{
    myid = JSON.parse(myid)
}

const our_api = "http://192.168.1.181:4000" //shu yerni o'zgartirasiz

let ul = document.querySelector(".videos-list")
let videoInput = document.getElementById("videoInput")
let file = document.getElementById("uploadInput")
let formData = new FormData()

let forma = document.querySelector(".site-form")


forma.addEventListener("submit",async(event)=>{
    
    event.preventDefault()
    formData.append("file",file.files[0])
    formData.append("title",videoInput.value)
    formData.append("userid",myid.userid)
    try{
    let res = await fetch(our_api+"/upload",{
        method:"POST",
        body:formData
    })

    res = await res.json()

    if(!res.upload){
        alert(res.message)
    }

    else{
        renderVideo(await res.newJ)
        videoInput.value = ""
    }
    }
    catch(error){
        console.log("kcisncisnc ")
        window.location = "/admin"
    }
})



async function renderVideo(lst){
    if(lst.length == 0) return
    ul.innerHTML = null
    try{
        for(let j of lst){
        let li = document.createElement("li")
        li.classList = "video-item"
        let video = document.createElement("video")
        video.src = await our_api+`/${j.name}`
        video.controls = " "
        let p = document.createElement("p")
        p.contentEditable = true
        p.textContent = j.title
        let img = document.createElement("img")
        img.src = "/delete.png"
        img.style.width = "25px"
        img.classList = "delete-icon"
        li.append(video,p,img)
        ul.append(li)

        img.addEventListener("click",async ()=>{
            let res = await fetch(our_api+`/delete/${j.videoid}`,{
                method:"DELETE",
                headers:{"content-type":"application/json"},
                body:"{}"
            })
            li.remove()
        })

        p.addEventListener("keyup",async (event)=>{
            // p.textContent = p.textContent

            if(event.keyCode === 13 ){
                let res = await fetch(our_api+`/update/${j.videoid}`,{
                    method:"PUT",
                    headers:{"content-type":"application/json"},
                    body:JSON.stringify({title:p.textContent})
                })
                p.blur()
            }
        })
    }
    }
    catch(error){
        window.location = "/admin"
    }
}

async function fetchInfo(){
    let res = await fetch(our_api+`/videos/${myid.userid}`)
    res = await res.json()
    renderVideo(res)
}



fetchInfo()