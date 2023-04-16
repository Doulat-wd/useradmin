import React,{useState,useEffect} from "react";
import { collection,doc,getDoc,getDocs,getFirestore,onSnapshot,deleteDoc} from "firebase/firestore";
import {getAuth,onAuthStateChanged} from "firebase/auth"
import { Navbar ,BasicGrid} from "../../components";
import { useNavigate } from "react-router-dom";
import {  query, where,updateDoc } from "firebase/firestore";
import EmptyCoverImage from "./coverimage.png"
import db from "../../config/firebase"
import { useParams } from "react-router-dom";
import { Await } from "react-router-dom";
import CrossImage from "./close.png"
import swal from "sweetalert";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "firebase/storage";
import "./singlepost.css"
const SinglePostPage=()=>{
let db=getFirestore()
let params=useParams()
console.log(params.id)
  let navigation=useNavigate()
 let auth=getAuth()
let [getUid,setUid]=useState("")
let [GetDataPosts,SetDataPosts]=useState([])
let [GetDataPostsUid,SetDataPostsUid]=useState([])
let [GetDataPostsLength,SetDataPostsLength]=useState(0)
let allPostsMainArray=[]
let PostsMainArray=[]
let [Getposition,setPosition]=useState("none")
// states
let [getTitleAmount, setTitleAmount] = useState("0");
let [getTitleText, setTitleText] = useState("");
let [getDescriptionAmount, setDescriptionAmount] = useState("0");
let [getDescriptionText, setDescriptionText] = useState("");
let [getCategory,setCategory]=useState("")
let [getImage,setImage]=useState("")
let [getMessage,setMessage]=useState("")
let [getMessageType,setMessageType]=useState("")
// states over
  
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
  if(v.title===params.id){
PostsMainArray.push(v)
   
 
  }

})

  let DeletePost=()=>{
   
    swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this post?",
      icon: "warning",
      dangerMode: true,
    })
    .then(willDelete => {
      if (willDelete) {
        swal("Deleted!", "Your imaginary file has been deleted!", "success");
        deleteDoc(doc(db, "posts", PostsMainArray[0].postid)).then(()=>(
          navigation("/Mainpage")
         ))
      }
    });
  }
 let Cannotdelete="Can't delete the post because yet it is in pending process."
 let EditPost=()=>{
    if(PostsMainArray[0].status==="pending"){
        alert("Can't edit the post because yet it is in pending process.")
    }else if(PostsMainArray[0].status==="approved"){
        // alert("Can edit post.")
        setTitleText(PostsMainArray[0].title)
        setDescriptionText(PostsMainArray[0].description)
        setCategory(PostsMainArray[0].category)
        console.log(PostsMainArray[0].description)
        setPosition("flex")
    }else if(PostsMainArray[0].status==="rejected"){
        alert("Can't edit a rejected post.")
    }
 }

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
        console.log("Upload is " + progress + "% done");
        setMessage("Image " + progress + "% Uploaded");
        setMessageType("success");
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
          console.log("File available at", downloadURL);
          setImage(downloadURL);
          setMessage("");
          setMessageType("");
        });
      }
    );
  };
  let CreatePostButton = () => {
    if (getTitleText === "") {
      setMessage("Please enter title!");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 2000);
    } else if (getCategory === "") {
      setMessage("Please select any category!");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 2000);
    } else {
      let PostObject = {
        title: getTitleText,
        description: getDescriptionText,
        category: getCategory,
        imageUrl: getImage,
        uid: getUid,
        status: "pending",
        postid: PostsMainArray[0].postid,
      };
      updateDoc(doc(db, "posts", PostsMainArray[0].postid),PostObject).then(()=>{
        // params.id=getTitleText
        navigation(`/Singlepost/${getTitleText}`)
        setMessage("Post updated successfully");
        setMessageType("success");
       
        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 2000);
        setPosition("none")
      }).catch((err) => {
          setMessage(err.message);
          setMessageType("error");
          setTimeout(() => {
            setMessage("");
            setMessageType("");
          }, 2000);
        });
    }
  };

return(
  <div>
    <Navbar/>
    {/* SingleEditpost */}
    <div id="SingleEditMainDiv" style={{display:Getposition}}>
        
        <div id="SingleEditInnerDiv">
        <img src={CrossImage} alt="" id="crossImage" onClick={()=>setPosition("none")}/>
          <h1 className="SingleEditH1">Title</h1>
          <input
            type="text"
            placeholder="Enter Title"
            id="SingleEditInput"
            value={getTitleText}
            onChange={(e) =>{ setTitleAmount(e.target.value.length);setTitleText(getTitleText.length>198?e.target.value.slice(0,199):e.target.value)}}

          />
          <p className="SingleEditTitleAmount">
            <span>{getTitleAmount}</span>/200
          </p>
          <h1 className="SingleEditH1" >Select Category</h1>
          <select name="" id="SingleEditInput" className="SelectSingleEdit" value={getCategory} onChange={(e)=>setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="WebDevelopment">Web Development</option>
            <option value="AppDevelopment">App Development</option>
            <option value="Wordpress">Wordpress</option>
            <option value="Freelancing">Freelancing</option> 
          </select>
          <h1 className="SingleEditH1">Description</h1>
          <textarea
            name=""
            id="SingleEditDescription"
            placeholder="Description"
            value={getDescriptionText}
            onChange={(e) => {
                { setDescriptionAmount(e.target.value.length);
                   setDescriptionText(getDescriptionText.length>2448?e.target.value.slice(0,2449):e.target.value)
               }
               }}
          ></textarea>

          <p className="SingleEditTitleAmount">
            <span>0</span>/2500
          </p>
          <h1 className="SingleEditH1">Upload Photo</h1>
          <div className="_upload form-file">
            <label
              htmlFor="exampleFormControlFile3"
              className="form-file-label"
            >
              Upload Photo
            </label>
            <input
              type="file"
              id="exampleFormControlFile3"
              className="form-control-file"
              onChange={UploadPhoto}
            />
          </div>
          <p id="SingleEditMessage" style={{color:getMessageType==="error"?"red":"green",marginTop:"10px"}}>{getMessage}</p>
          <button id="SingleEditFinalButton" onClick={CreatePostButton}>Update Post</button>
        </div>
      </div>
    {/* SingleEditpost over */}
    <div id="singleMainDiv">
    {PostsMainArray.map((v,i)=>{
   return(
    <div key={i} id="SinglePostInnerDiv">
     <img id="SinglePostImage" src={v.imageUrl===""?EmptyCoverImage:v.imageUrl} alt="" />
    <div id="SingleConditionDiv">
        <h1>Catergory: {v.category}</h1>
        <h1>Status: {v.status}</h1>
    </div>
    <h1 id="SinglePostTitle">{v.title}</h1>
    <p id="SinglePostDesciption">{v.description}</p>
    <div id="SingleButtonDiv">
      <button onClick={EditPost}>Edit</button>
      <button onClick={v.status==="pending"?()=>alert(Cannotdelete):DeletePost}>Delete</button>
    </div>
    </div>
   )
     })}
    </div>
  </div>
)
}
export default SinglePostPage