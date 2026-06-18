import express from "express";

let app=express();

app.get("/",(req,res)=>{
    res.send("wlecome to Komplie")
})

export default app;