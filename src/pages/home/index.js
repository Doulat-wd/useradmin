import React,{useEffect} from "react";
import app from "../../config/firebase"
import loader from "./Loading_icon.gif"
import "./home.css"
import {useNavigate} from "react-router-dom"
import {getAuth,onAuthStateChanged} from "firebase/auth"
const HomePage=()=>{
    let navigation=useNavigate()
    let auth=getAuth()
    useEffect(()=>{
        onAuthStateChanged(auth,(user)=>{
            if(user){
if(user.emailVerified){
navigation("/MainPage")
}else{
    navigation("/EmailVerification")
}
            }else{
navigation("/Login")
            }
        })
    },[])
    return(
        <div id="LoaderPageDiv">
           <img src={loader} alt="" />
        </div>
    )
}
export default HomePage