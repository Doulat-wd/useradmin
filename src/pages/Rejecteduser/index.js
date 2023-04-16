import React,{useState,useEffect} from "react";
import { collection,doc,getDoc,getDocs,getFirestore,onSnapshot} from "firebase/firestore";
import {getAuth,onAuthStateChanged} from "firebase/auth"
import { Navbar ,BasicGrid} from "../../components";
import { useNavigate } from "react-router-dom";
import {  query, where } from "firebase/firestore";

import db from "../../config/firebase"
import "./rejecteduser.css"
const RejectedPage=()=>{
let db=getFirestore()

  let navigation=useNavigate()
 let auth=getAuth()
let [getUid,setUid]=useState("")

  
useEffect(()=>{
 
  onAuthStateChanged(auth,(user)=>{
      if(user){
          setUid(user.uid)
         
if(user.emailVerified){
  const docRef = doc(db, "users",user.uid);

getDoc(docRef).then((SingleStatusCheck)=>{
  console.log(SingleStatusCheck.data())
  if(SingleStatusCheck.data().status==="pending"){
    navigation("/pendingpage")
  }else if(SingleStatusCheck.data().status==="approved"){
    navigation("/mainpage")
  }
})
 
  
}else{
navigation("/EmailVerification")
}
      }else{
navigation("/Login")
      }
  })

},[auth])


  
return(
    <div id="Rejectedmaindiv" >
    <div id="Rjectedinnerdiv">
      <h1 id="rejectedh1">Your account has been rejected!</h1>
      <p id="rejectedp1">Wait untill it's re-approval or create another account.</p>
      <p  id="rejectedp2" onClick={()=>navigation("/login")}>Log In</p>
    </div>
    </div>
)
}
export default RejectedPage