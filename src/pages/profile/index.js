import React,{useState,useEffect} from "react";
import { Navbar } from "../../components";
import {getAuth,onAuthStateChanged} from "firebase/auth"
import {getFirestore,getDoc, collection,onSnapshot,updateDoc} from "firebase/firestore"
import { doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import EmptyProfileImage from "./download.png"
import "./profile.css"
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "firebase/storage";
const ProfilePage=()=>{
    let db=getFirestore()
    let navigation=useNavigate()
    let auth=getAuth()
    let [getUid,setUid]=useState("")
    // states
    let ProfileUserArray=[]
   let  singlespeceficProfile=[]
    let [getprofileData,setprofileData]=useState([])
    let [getFirstname,setFirstname]=useState("")
    let [getLastname,setLastname]=useState("")
    let [getemail,setemail]=useState("")
    let [getmob,setmob]=useState("")
    let [getprofileSrc,setprofileSrc]=useState("")
    let [setImageUrl,getImageUrl]=useState("")
    let [getmessage,setmessage]=useState("")
    let [getmessagetype,setmessagetype]=useState("")
    let [getfirstnameUpd,setfirstnameUpd]=useState("")
    let [getlastnameUpd,setlastnameUpd]=useState("")
    let [getMNUpd,setMNUpd]=useState("")
    // states over
 useEffect(()=>{
  onAuthStateChanged(auth,(user)=>{
      if(user){
          setUid(user.uid)
        //   console.log(getUid)
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
 
},[])


const Allusersdata=onSnapshot(collection(db,"users"),(allUsers)=>{
    allUsers.forEach((singleLoopUsers)=>{
      if(singleLoopUsers.data().uid===getUid){
        
        setFirstname(singleLoopUsers.data().firstname)
        setLastname(singleLoopUsers.data().lastname)
        setemail(singleLoopUsers.data().email)
        setmob(singleLoopUsers.data().mobilenumber)
        setprofileSrc(singleLoopUsers.data().profileImage)
       }
        
    })
    })
    let UploadPhoto = (event) => {
        let file = event.target.files[0];
        const storage = getStorage();
        /** @type {any} */
        const metadata = {
          contentType: "image/jpeg",
        };
        const storageRef = ref(storage, "images/" + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log("Upload is " + progress + "% done");
            setmessage("Image " + Math.round(progress)  + "% Uploaded");
            setmessagetype("success")
          },
          (error) => {
            switch (error.code) {
              case "storage/unauthorized":
                break;
              case "storage/canceled":
                break;
              case "storage/unknown":
                break;
            }
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //   console.log("File available at", downloadURL);
            getImageUrl(downloadURL);
             setmessage("")
            });
          }
        );
      };
      let UpdateProfileData=()=>{
       
        if(getfirstnameUpd===""){
          
        }else{
            updateDoc(doc(db, "users", getUid), {
                firstname:getfirstnameUpd,
               })
        }
         if(getlastnameUpd===""){
           
        }else{
           updateDoc(doc(db, "users", getUid), {
           lastname:getlastnameUpd,
          
          })
        
        }
         if(getMNUpd===""){
            
        }else{
            updateDoc(doc(db, "users", getUid), {
                mobilenumber:getMNUpd
               
               })
        }
         if(setImageUrl===""){
          
        }else {
               updateDoc(doc(db, "users", getUid), {
          
           profileImage:setImageUrl,
          })
        }
      
            setmessage("your profile has been updated.")
            setmessagetype("success")
            setTimeout(() => {
                setmessage("")
                setmessagetype("")
            }, 2000);
         
       
      }
      
    return(
        <div>
           <Navbar/>
           <div id="ProfileMainDiv">
            <div id="ProfileInnerDiv">
                <div id="ProfileProfileDiv">
                <div className=" profileUploadImage">
            <label
              htmlFor="exampleFormControlFile3123"
              className="form-file-label"
            >
            <img src={getprofileSrc===""?EmptyProfileImage:getprofileSrc} alt="" id="ProfileProfileImage"/>

            </label>
            <input
              type="file"
              id="exampleFormControlFile3123"
              className="form-control-file"
              onChange={UploadPhoto}
            />
          </div>
         
                {/* <img src={getprofileSrc===""?EmptyProfileImage:getprofileSrc} alt="" id="ProfileProfileImage"/> */}
                </div>
                
                <div id="ProfileSectionDiv">
                <p style={{color:getmessagetype==="error"?"red":"green"}}>{getmessage}</p>
                <h1 id="ProfileHeading">First Name:</h1>
                <input type="text" className="ProfileInputs" placeholder={getFirstname} onChange={(e)=>setfirstnameUpd(e.target.value)}/>
                </div>
                <div id="ProfileSectionDiv">
                <h1 id="ProfileHeading">Last Name:</h1>
                <input type="text" className="ProfileInputs" placeholder={getLastname} onChange={(e)=>setlastnameUpd(e.target.value)}/>
                </div>
                <div id="ProfileSectionDiv">
                <h1 id="ProfileHeading">Mobile Number:</h1>
                <input type="text" className="ProfileInputs" placeholder={getmob} onChange={(e)=>setMNUpd(e.target.value)}/>
                </div>
                <div id="ProfileSectionDiv">
                <h1 id="ProfileHeading">Email:</h1>
                <input type="text" className="ProfileInputs" placeholder={getemail}/>
                </div>
                <div id="ProfileSectionDiv">
                    <button id="UpdateProfileButton" onClick={UpdateProfileData}>Update</button>
</div>
            </div>
           </div>
        </div>
    )
}
export default ProfilePage

