import React,{useState,useEffect} from "react";
import { collection,doc,getDoc,getDocs,getFirestore,onSnapshot} from "firebase/firestore";
import {getAuth,onAuthStateChanged} from "firebase/auth"
import { Navbar ,BasicGrid} from "../../components";
import { useNavigate } from "react-router-dom";
import {  query, where } from "firebase/firestore";
import EmptyCoverImage from "./coverimage.png"

import db from "../../config/firebase"

import "./manipage.css"
const MainPage=()=>{
let db=getFirestore()

  let navigation=useNavigate()
 let auth=getAuth()
let [getUid,setUid]=useState("")
let [GetDataPosts,SetDataPosts]=useState([])
let [GetDataPostsUid,SetDataPostsUid]=useState([])
let [GetDataPostsLength,SetDataPostsLength]=useState(0)
let allPostsMainArray=[]
let PostsMainArray=[]
let PendingMainArray=[]
let ApprovedMainArray=[]
let RejectedMainArray=[]
  
useEffect(()=>{
 
  onAuthStateChanged(auth,(user)=>{
      if(user){
          setUid(user.uid)
         
if(user.emailVerified){
  const docRef = doc(db, "users",user.uid);

getDoc(docRef).then((SingleStatusCheck)=>{
  console.log(SingleStatusCheck.data())
  if(SingleStatusCheck.data().status==="pending"){
    navigation("/PendingPage")
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
// 
const Allusersdata=onSnapshot(collection(db,"posts"),(allUsers)=>{
  allPostsMainArray=[]
  allUsers.forEach((singleLoopUsers)=>{
    allPostsMainArray.push(singleLoopUsers.data())
    SetDataPosts(allPostsMainArray)

  })
  })
// 
},[auth])
GetDataPosts.map((v,i)=>{
  // console.log(v.uid)
  if(v.uid===getUid){
PostsMainArray.push(v)
if(v.status==="pending"){
  PendingMainArray.push(v)
}
if(v.status==="approved"){
  ApprovedMainArray.push(v)
}
if(v.status==="rejected"){
  RejectedMainArray.push(v)
}

   }
   

})

  
return(
    <div>
      <Navbar/>
      <div id="MainPageDiv">
      <BasicGrid  all={PostsMainArray.length} approved={ApprovedMainArray.length} rejected={RejectedMainArray.length} pending={PendingMainArray.length}/>
      </div>
      <div id="MainPostDivAll">
     {PostsMainArray.map((v,i)=>{
   return(
    <div key={i} id="MainPostInnerDiv" onClick={()=>navigation(`/Singlepost/${v.title}`)}>
     <img id="MainPostImage" src={v.imageUrl===""?EmptyCoverImage:v.imageUrl} alt="" />
    <h1 id="MainPostTitle">{v.title}</h1>
    <p id="MainPostDesciption">{v.description.slice(0,190) }{v.description.length>190&&"..."}</p>
    <p id="MainPostCategory1">Catergory: <span id="MainPostCategory">{v.category}</span></p>
    <p id="MainPostStatus1">Status: <span id="MainPostStatus">{v.status}</span></p>

    </div>
   )
     })}
    </div>
    </div>
)
}
export default MainPage