import React, { useState,useEffect } from "react";
import {useNavigate} from "react-router-dom"
import {getFirestore,collection,onSnapshot} from "firebase/firestore"
import {getAuth,onAuthStateChanged,signOut} from "firebase/auth"
import "./navbar.css"
import emptyProfile from "./download.png"
const Navbar = () => {
  let auth=getAuth()
  let navigation=useNavigate()
  let db=getFirestore()
let [getusername,setusername]=useState("UserName")
let [getProfileSrc,setProfileSrc]=useState("")
    let [getUid,setUid]=useState("")
    useEffect(()=>{
      onAuthStateChanged(auth,(user)=>{
          if(user){
              setUid(user.uid)
             
  if(user.emailVerified){
  
  }else{
  navigation("/EmailVerification")
  }
          }else{
  navigation("/Login")
          }
      })
  },[])
  const Allusersdata=onSnapshot(collection(db,"users"),(allUsers)=>{
    allUsers.forEach((singleLoopUsers)=>{
      if(singleLoopUsers.data().uid===getUid){
        
        setusername(singleLoopUsers.data().firstname)
       }
        if(singleLoopUsers.data().uid===getUid){
          
        
        setProfileSrc(singleLoopUsers.data().profileImage)
       }
    })
    })
    let Signout=()=>{
      signOut(auth).then(() => {
        
      }).catch((error) => {
        
      });
    }
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <div id="ImageDiv">
          <img
            src={getProfileSrc===""?emptyProfile:getProfileSrc}
            alt=""
            style={{ width: "70px",height:"70px" ,borderRadius:"100%"}}
          />
          <h1 id="Username">{getusername}</h1>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <p className="nav-link" aria-current="page" onClick={()=>navigation("/MainPage")}>
                  Home
                </p>
              </li>
              <li className="nav-item">
                <p className="nav-link" onClick={()=>navigation("/CreatePost")}>
                  Create Post
                </p>
              </li>
              <li className="nav-item">
                <p className="nav-link" onClick={()=>navigation("/ProfilePage")}>
                  Profile
                </p>
              </li>
              <li className="nav-item">
                <p className="nav-link" onClick={Signout}>Log Out</p>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
export default Navbar;
