import React,{useState,useEffect} from "react";
import { collection,doc,getDoc,getDocs,getFirestore,onSnapshot} from "firebase/firestore";
import {getAuth,onAuthStateChanged} from "firebase/auth"
import { Navbar ,BasicGrid} from "../../components";
import { useNavigate } from "react-router-dom";
import {  query, where } from "firebase/firestore";
import "./pending.css"
import db from "../../config/firebase"

const PendingPage=()=>{
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
  if(SingleStatusCheck.data().status==="approved"){
    navigation("/mainpage")
  }else if(SingleStatusCheck.data().status==="rejected"){
    navigation("/rejectedpage")
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
  <div id="pendingmaindiv" >
  <div id="pendinginnerdiv">
    <h1 id="pendingh1">Waiting for approval</h1>
    <p id="pendingp1">Your account is wating for our main administrative approval.</p>
    <p  id="pendingp1" >Come back later.</p>
  </div>
  </div>
)
}
export default PendingPage