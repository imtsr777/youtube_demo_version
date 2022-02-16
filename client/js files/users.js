const ul = document.querySelector('.navbar-list')
const usersCon = document.querySelector(".iframes-list")
const our_api = "http://192.168.1.181:4000" //shu yerni o'zgartirasiz

let api = our_api+'/users'
let myPhoto = document.querySelector('.avatar-img')
let my_token = localStorage.getItem('userid')

let searchTitle = document.querySelector(".search-input")
let search_box = document.querySelector(".search-box")

let datalist = document.getElementById("datalist")

if(my_token){
    let muy=async()=>{
        let id = JSON.parse(my_token)
        id = id.userid
        let res = await fetch(our_api+`/users/${id}`)
        res = await res.json()
        myPhoto.src = our_api+`/${res[0].profile}`
    }
    muy()
}

search_box.addEventListener("submit",async (event)=>{
    event.preventDefault()
    let res = await fetch(our_api+`/search/${searchTitle.value}`)
    res = await res.json()
    renVideos(res)
})

async function searchText(){
    try{
        let res = await fetch(our_api+"/videos")
        res = await res.json()
        for(let j of res){
        let option = document.createElement("option")
        option.value = j.title
        datalist.append(option)
    }
    }
    catch(error){
        throw new Error("database failed")
    }
}

searchText()

async function renderUsers(){
    let res = await fetch(api)
    res = await res.json()
    for(let use of res){
        let li = document.createElement('li')
        li.classList = "channel"
        let a = document.createElement('a')
        let img = document.createElement("img")
        img.src = our_api+`/${use.profile}`
        img.style.width = "30px"
        img.style.height = "30px"
        let span = document.createElement("span")
        span.textContent = use.username
        a.append(img,span)
        li.append(a)
        ul.append(li)
        li.addEventListener('click',async()=>{
            let res = await fetch(our_api+`/videos/${use.userid}`)
            res = await res.json()
            renVideos(res)
        })
    }
}


async function renVideos(allVideos){
    usersCon.innerHTML = null
    for(let obj of allVideos){
        let iframe = document.createElement("li")
        iframe.classList = "iframe"
        let video = document.createElement("video")
        video.src = our_api+`/${obj.name}`
        video.controls = " "
        let ifFooter = document.createElement("div")
        ifFooter.classList = "iframe-footer"
        let img = document.createElement("img")
        let res = await fetch(our_api+`/users/${obj.userid}`)
        res = await res.json()
        img.src = our_api+`/${res[0].profile}`
        let iffoottext = document.createElement("div")
        iffoottext.classList = "iframe-footer-text"
        let h2 = document.createElement("h2")
        h2.classList = "channel-name" 
        h2.textContent = res[0].username
        let h3 = document.createElement("h3")
        h3.classList = "iframe-title"
        h3.textContent = obj.title
        let time = document.createElement("time")
        time.classList = "uploaded-time"
        time.textContent = obj.data +" | "+obj.time
        let a = document.createElement("a")
        a.classList = "download"
        let span = document.createElement("span")
        span.textContent = obj.time[0]+obj.time[4]
        let down = document.createElement("img")
        down.src = "/download.png"
        a.append(span,down)
        iffoottext.append(h2,h3,time,a)
        ifFooter.append(img,iffoottext)
        iframe.append(video,ifFooter)
        usersCon.append(iframe)
        
    }
}




async function all(){
    let res = await fetch(our_api+"/videos")
    res = await res.json()
    renVideos(res)
}

all()

renderUsers()




