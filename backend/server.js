const express = require('express')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const PORT = process.env.PORT || 4000
const app = express()
const path = require('path')
const myModules = require(path.join(__dirname,"my_modules","js_modules.js"))
const fileUpload = require('express-fileupload')
const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(fileUpload())
app.use(express.static(path.join(__dirname,"users_photo")))
app.use(express.static(path.join(__dirname,"videos")))

app.post("/register",(req,res)=>{
    
    if(!req.files){
        return res.json({user:false,message:"Please upload image"})
    }

    const {file} = req.files

    let [profile,username,password] = [req.files.file.name,req.body.username,req.body.password]
    let userid = myModules.randomId()

    try{
        let cheking = profile.split(".")
        let types = ['png','jpg','svg','jpeg']
        let count = 0

        for(let j of types){
            if(j==cheking[cheking.length-1]){
                count=1
            }
        }
    
        if(!count){
            return res.json({user:false,message:"Only image please"})
        }
    }
    
    catch(error){
        return res.send({message:"Please upload image",user:false})
    }

    let info_users = fs.readFileSync(path.join(__dirname,"database","users.json"),'utf-8')
    info_users = JSON.parse(info_users || "[]")
    
    for(let j of info_users){
        if(j.username == username){
            return res.json({message:"This username have",user:false})
        }
    }
    

    if(username.length<4 || username.length>50){
        return res.json({user:false,message:"Username length must be min-5 max-50"})
    }

    if(password.length<4 || password.length>16){
        console.log(password)
        return res.json({user:false,message:"Password length must be min-5 max-16"})
    }

    if(!(/[A-Za-z]/).test(password) || !(/[0-9]/).test(password)){
        return res.json({user:false,message:"A B 0-9"})
    }

    let token = jwt.sign({userid},"SARVAR")
    let newObj = {userid,token:token,username,password,profile}

    let posts = fs.readFileSync(path.join(__dirname,"database","users.json"),'utf-8')
    posts = JSON.parse(posts)
    posts.push(newObj)
    
    file.mv(path.join(__dirname,"users_photo",profile))
    posts = JSON.stringify(posts,null,4)
    fs.writeFileSync(path.join(__dirname,"database","users.json"),posts)

    res.json({user:true,message:"OK",newObj})
})

app.get('/users/:userid',(req,res)=>{
    let users = fs.readFileSync(path.join(__dirname,"database","users.json"),'utf-8')
    users = JSON.parse(users)
    let newUser = users.filter(user=>{
        if(user.userid==req.params.userid){
            return user
        }
    })
    res.json(newUser)
})

app.get("/users",(req,res)=>{
    let users = fs.readFileSync(path.join(__dirname,"database","users.json"),'utf-8')
    users = JSON.parse(users)
    res.json(users)
})

app.get("/videos",(req,res)=>{
    let users = fs.readFileSync(path.join(__dirname,"database","videos.json"),'utf-8')
    users = JSON.parse(users)
    res.json(users)
})

app.get("/videos/:userid",(req,res)=>{
    let vid = fs.readFileSync(path.join(__dirname,"database","videos.json"),'utf-8')
    vid = JSON.parse(vid)
    let newVid = vid.filter(miniVid=>{
        if(miniVid.userid==req.params.userid){
            return miniVid
        }
    })

    res.json(newVid)
})

app.get("/search/:title",(req,res)=>{
    let vid = fs.readFileSync(path.join(__dirname,"database","videos.json"),'utf-8')
    vid = JSON.parse(vid)
    let newVid = []
    for(let j of vid){
        if(j.title.toLowerCase().includes(req.params.title.toLowerCase())){
            newVid.push(j)
        }
    }
    res.json(newVid)
})

app.post("/upload",async (req,res)=>{
    try{

    if(!req.files){
        return res.json({upload:false,message:"Please upload video"})
    }

    const {file} = req.files

    let [name,userid,videoid,title] = [req.files.file.name,req.body.userid,myModules.randomId(),req.body.title]
    let [time,data] = [myModules.createTime(),myModules.createData()]

    if(title.length<3) return res.json({upload:false,message:"length min-2"})
    if(title.length>50) return res.json({upload:false,message:"length max-50"})

    let newObj = {userid:parseInt(userid),videoid:parseInt(videoid),name,title,time,data}

    let posts = fs.readFileSync(path.join(__dirname,"database","videos.json"),'utf-8')
    posts = JSON.parse(posts)
    posts.push(newObj)
    let key = [...posts]

    await file.mv(path.join(__dirname,"videos",name))
    posts = JSON.stringify(posts,null,4)
    fs.writeFileSync(path.join(__dirname,"database","videos.json"),posts)

    let newJ = key.filter(item => item.userid == parseInt(userid))
    
    res.json({upload:true,message:"OK",newJ})}

    catch(error){
        res.json({upload:false,message:"OK"})
    }
})

app.put("/update/:videoid",(req,res)=>{
    
    let videos = fs.readFileSync(path.join(__dirname,"database","videos.json"),'utf-8')
    videos = JSON.parse(videos)
    for(let j of videos){
        if(j.videoid==parseInt(req.params.videoid)){
            j.title = req.body.title
            break
        }
    }

    videos = JSON.stringify(videos,null,4)
    fs.writeFileSync(path.join(__dirname,"database","videos.json"),videos)
    return res.send().status(200)
})

app.delete("/delete/:videoid",(req,res)=>{
    let videos = fs.readFileSync(path.join(__dirname,"database","videos.json"),'utf-8')
    videos = JSON.parse(videos)
    let nameVideo
    let newVideos = []
    for(let j of videos){
        if(j.videoid==parseInt(req.params.videoid)){
            nameVideo = j.name
        }

        else{
            newVideos.push(j)
        }
    }

    videos = JSON.stringify(newVideos,null,4)
    fs.writeFileSync(path.join(__dirname,"database","videos.json"),videos)
    fs.unlinkSync(path.join(__dirname,"videos",nameVideo))

    return res.send().status(200)

})

app.post("/login",(req,res)=>{
    let users = fs.readFileSync(path.join(__dirname,"database","users.json"),'utf-8')
    users = JSON.parse(users)
    let token
    let {username,password} = req.body
    for(let user of users){
        if(user.username==username){
            if(user.password==password){
                let key = user.userid
                token = jwt.sign({key},"SARVAR")
                let newUsers = [...users]
                newUsers = JSON.stringify(newUsers,null,4)
                fs.writeFileSync(path.join(__dirname,"database","users.json"),newUsers)
                return res.json({logged:true,user})
            }
            else{
                return res.json({logged:false,message:"Parol hato kiritildi"})
            }
        }
    }
    return res.json({logged:false,message:"Username mavjud emas"})

})

app.listen(PORT,()=>{console.log("Backend server is runing....")})