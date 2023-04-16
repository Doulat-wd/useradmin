import React,{useEffect,useState} from "react";
import "./emailVerificaton.css"
import emailImage from "./email.png"
import app from "../../config/firebase";
import {useNavigate} from "react-router-dom"
import {getAuth,onAuthStateChanged,sendEmailVerification} from "firebase/auth"

const EmailVerification=()=>{
   let [getmessage,setmessage]=useState("")
   let [getmessageType,setmessageType]=useState("")
    let [getemail,setemail]=useState("")
    
let auth=getAuth()
let navigation=useNavigate()
useEffect(()=>{
onAuthStateChanged(auth,(user)=>{
    if(user){
        console.log(user.email)
        setemail(user.email)
if(user.emailVerified){
    navigation("/MainPage")
    
}
    }else{
navigation("/Login")
    } 
})
},[])
let resendEmail=()=>{
    sendEmailVerification(auth.currentUser)
  .then(() => {
    getmessage("Email Verification sent")
    setmessageType("success")
  }).catch((err)=>{
    getmessage(err.message)
    setmessageType("error")
  })
}
    return(
       <div id="emailVerificationbody">
        <div id="verify">
        <div id="EmailVerimg"><img  src={emailImage} alt=""/></div>
        <h2 id="emailVerH2">Please verify your email</h2>
        <p id="emailVerp">You're almost there! we sent an email to  <span id="emailVerEmail">{getemail}</span></p>
        <p id="emailVerp">Just click on the linkin that email to complete your signup. If you don't see it, you may need to check spam folder.</p>
        <p id="message" style={{color:setmessageType==="error"?"red":"green"}}>{getmessage}</p>
        <div id="emailVbtn"> 
            <button id="emailVerButton" onClick={resendEmail}>Resend Email</button>
            <button id="emailVerButton" onClick={()=>(window.location.reload())}>Confirm</button>
        </div>
    </div>
       </div>
    )
}
export default EmailVerification