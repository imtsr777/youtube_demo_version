const express = require('express')
const fs = require('fs')
const PORT = process.env.PORT || 3000
const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname,"css")))
app.use(express.static(path.join(__dirname,"img")))
app.use(express.static(path.join(__dirname,"fonts")))
app.use(express.static(path.join(__dirname,"js files")))

app.get("/register",(req,res)=>{
    res.sendFile(path.join(__dirname,"views","register.html"))
})

app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"views","login.html"))
})

app.get("/index",(req,res)=>{
    res.sendFile(path.join(__dirname,"views","index.html"))
})

app.get("/admin",(req,res)=>{
    res.sendFile(path.join(__dirname,"views","admin.html"))
})


app.listen(PORT,()=>{console.log("Server is running...")})