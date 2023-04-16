import React, { useState } from "react";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import app from "../../config/firebase"
import {getAuth,createUserWithEmailAndPassword,sendEmailVerification} from "firebase/auth"
import {getFirestore,setDoc,doc,updateDoc} from "firebase/firestore"
const db =getFirestore(app)
const Signup = () => {
  let auth=getAuth()

  const navigation = useNavigate();
  var emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var passwformat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
  let [Getfirstname, Setfirstname] = useState("");
  let [Getlastname, Setlastname] = useState("");
  let [Getmobilenumber, Setmobilenumber] = useState("");
  let [Getemail, Setemail] = useState("");
  let [Getpassword, Setpassword] = useState("");
  let [GetConfirmpassword, SetConfirmpassword] = useState("");
  let [GetInputMessage, SetInputMessage] = useState("");
  let [GetMessageType, SetMessageType] = useState("");
  let signup = () => {
    if (Getfirstname === "") {
      SetInputMessage("Please enter your firstname !");
      SetMessageType("error")
    } else if (Getlastname === "") {
      SetInputMessage("Please enter your lastname !");
      SetMessageType("error")
    } else if (Getmobilenumber === "") {
      SetInputMessage("Please enter your mobile Number !");
      SetMessageType("error")
    } else if (Getmobilenumber.length !== 11) {
      SetInputMessage("you have entered wrong number !");
      SetMessageType("error")
    } else if (Getemail === "") {
      SetInputMessage("please enter email address !");
      SetMessageType("error")
    } else if (!Getemail.match(emailformat)) {
      SetInputMessage("you have entered incorrect email address !");
      SetMessageType("error")
    }else if (!Getpassword.match(passwformat)){
SetInputMessage("password must have more than 6 characters with atleast one numeric digit, one uppercase and lowercase letter")
SetMessageType("error")   
} else if (Getpassword === "") {
      SetInputMessage("please enter password !");
      SetMessageType("error")
    } else if (GetConfirmpassword === "") {
      SetInputMessage("confirm your password !");
      SetMessageType("error")
    } else if (GetConfirmpassword !== Getpassword) {
      SetInputMessage("Password doesn't match !");
      SetMessageType("error")
    } else {
      let userObject = {
        firstname: Getfirstname,
        lastname: Getlastname,
        mobilenumber: Getmobilenumber,
        email: Getemail,
        password: Getpassword,
        profileImage:"",
        uid:"",
        status:"pending"
      };
      // auth
      const auth = getAuth();
      createUserWithEmailAndPassword (auth, userObject.email,userObject.password)
  .then((userCredential) => {
    
    setDoc(doc(db,"users",userCredential.user.uid),userObject)
    SetInputMessage("Sign Up successfully")
    SetMessageType("sucess")
updateDoc(doc(db,"users",userCredential.user.uid),{
  uid:userCredential.user.uid
})
    sendEmailVerification(auth.currentUser).then((res)=>{
      setTimeout(() => {
        
        navigation("/EmailVerification")
      }, 2000);
    })
  })
  .catch((error) => {
    SetInputMessage(error.message)
    SetMessageType("error")
  
  });
  // auth
      console.log(userObject);
    }

    setTimeout(() => {
      SetInputMessage("");
    }, 2000);
  };
  return (
    <div id="Signup_returndiv">
      <div id="Signup_Maindiv">
        <h1 id="Signup_mainHeading">Sign Up</h1>
        <div id="Signup_inputsDIv">
          <h1 className="Signup_InputsHeading">First Name</h1>
          <input
            type="text"
            name="FirstName"
            id="Signup_FirstName"
            className="Signup_Inputs"
            placeholder="Enter first name"
            value={Getfirstname}
            onChange={(e) => Setfirstname(e.target.value)}
          />
          <h1 className="Signup_InputsHeading">Last Name</h1>
          <input
            type="text"
            name="LastName"
            id="Signup_LastName"
            className="Signup_Inputs"
            placeholder="Enter last name"
            value={Getlastname}
            onChange={(e) => Setlastname(e.target.value)}
          />
          <h1 className="Signup_InputsHeading">Mobile Number</h1>
          <input
            type="number"
            name="Mobile Number"
            id="Signup_Mobile"
            className="Signup_Inputs"
            placeholder="Enter mobile number"
            value={Getmobilenumber}
            onChange={(e) => Setmobilenumber(e.target.value)}
          />
          <h1 className="Signup_InputsHeading">Email Address</h1>
          <input
            type="email"
            name="Email Address"
            id="Signup_Email"
            className="Signup_Inputs"
            placeholder="Enter email address"
            value={Getemail}
            onChange={(e) => Setemail(e.target.value)}
          />
          <h1 className="Signup_InputsHeading">Password</h1>
          <input
            type="password"
            name="Password"
            id="Signup_Password"
            className="Signup_Inputs"
            placeholder="Enter password"
            value={Getpassword}
            onChange={(e) => Setpassword(e.target.value)}
          />
          <h1 className="Signup_InputsHeading">confirm Password</h1>
          <input
            type="password"
            name="confirm Password"
            id="Signup_ConfrimPassword"
            className="Signup_Inputs"
            placeholder="confirm password"
            value={GetConfirmpassword}
            onChange={(e) => SetConfirmpassword(e.target.value)}
          />
          <p
            id={
              GetInputMessage === "" ? "Signup_NullMessage" : "Signup_Message"
            }style={{color:GetMessageType==="error"?"red":"green"}}
          >
            {GetInputMessage}
          </p>
          <button id="Signup_button" onClick={signup}>
            Sign Up
          </button>
        </div>
        <h1 id="Signup_LoginNavigate">
          Already user? <span onClick={() => navigation("/Login")}>Log In</span>
        </h1>
      </div>
    </div>
  );
};
export default Signup;
