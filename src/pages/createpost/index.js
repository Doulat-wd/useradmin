import React, { useState, useEffect } from "react";
import { Navbar } from "../../components";
import "./createPost.css";
import { useNavigate } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
const CreatePost = () => {
  let db = getFirestore();
  let auth = getAuth();
  let navigation = useNavigate();
  let [getTitleAmount, setTitleAmount] = useState("0");
  let [getTitleText, setTitleText] = useState("");
  let [getDescriptionAmount, setDescriptionAmount] = useState("0");
  let [getDescriptionText, setDescriptionText] = useState("");
  let [getCategory, setCategory] = useState("");
  let [getImage, setImage] = useState("");
  let [getMessage, setMessage] = useState("");
  let [getMessageType, setMessageType] = useState("");
  let [getUid, setUid] = useState("");
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        console.log(getUid);
        if (user.emailVerified) {
          const docRef = doc(db, "users",user.uid);

          getDoc(docRef).then((SingleStatusCheck)=>{
            console.log(SingleStatusCheck.data())
            if(SingleStatusCheck.data().status==="pending"){
              navigation("/PendingPage")
            }else if(SingleStatusCheck.data().status==="rejected"){
              navigation("/rejectedpage")
            }
          })
        } else {
          navigation("/EmailVerification");
        }
      } else {
        navigation("/Login");
      }
    });
  }, []);
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
        setMessage("Image " + Math.round(progress)+ "% Uploaded");
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
        postid: "",
      };
      addDoc(collection(db, "posts"), PostObject)
        .then((res) => {
          console.log(res);

          setMessage("Post uploaded successfully");
          setMessageType("success");
          updateDoc(doc(db, "posts", res.id), {
            postid: res.id,
          });
          setTimeout(() => {
            setMessage("");
            setMessageType("");
          }, 2000);
        })
        .catch((err) => {
          setMessage(err.message);
          setMessageType("error");
          setTimeout(() => {
            setMessage("");
            setMessageType("");
          }, 2000);
        });
    }
  };
  return (
    <div>
      <Navbar />
      <div id="CreateMainDiv">
        <div id="CreateInnerDiv">
          <h1 className="createH1">Title</h1>
          <input
            type="text"
            placeholder="Enter Title"
            id="CreateInput"
            value={getTitleText} 
            onChange={(e) => {
              setTitleAmount(e.target.value.length);
              setTitleText(
                getTitleText.length > 198
                  ? e.target.value.slice(0, 199)
                  : e.target.value
              );
            }}
          />
          <p className="CreateTitleAmount">
            <span>{getTitleAmount}</span>/200
          </p>
          <h1 className="createH1">Select Category</h1>
          <select
            name=""
            id="CreateInput"
            className="SelectCreate"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="WebDevelopment">Web Development</option>
            <option value="AppDevelopment">App Development</option>
            <option value="Wordpress">Wordpress</option>
            <option value="Freelancing">Freelancing</option>
          </select>
          <h1 className="createH1">Description</h1>
          <textarea
            name=""
            id="CreateDescription"
            placeholder="Description"
            onChange={(e) => {
              {
                setDescriptionAmount(e.target.value.length);
                setDescriptionText(
                  getDescriptionText.length > 2448
                    ? e.target.value.slice(0, 2449)
                    : e.target.value
                );
              }
            }}
          ></textarea>

          <p className="CreateTitleAmount">
            <span>{getDescriptionAmount}</span>/2500
          </p>
          <h1 className="createH1">Upload Photo</h1>
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
          <p
            id="CreateMessage"
            style={{
              color: getMessageType === "error" ? "red" : "green",
              marginTop: "10px",
            }}
          >
            {getMessage}
          </p>
          <button id="CreateFinalButton" onClick={CreatePostButton}>
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
};
export default CreatePost;
