import React from "react";
import { Signup ,Login,EmailVerification,PendingPage,RejectedPage,HomePage,CreatePost,ProfilePage,MainPage,SinglePostPage} from "../../pages";
import {BrowserRouter,Route,Routes} from 'react-router-dom';
const Navigation=()=>{
    return(
        <BrowserRouter>
        <Routes>
            <Route element={<HomePage/>} path="/"/>
            <Route element={<MainPage/>} path="/MainPage"/>
            <Route element={<Signup/>} path="/Signup"/>
            <Route element={<Login/>} path="/Login"/>
            <Route element={<CreatePost/>} path="/CreatePost"/>
            <Route element={<PendingPage/>} path="/PendingPage"/>
            <Route element={<RejectedPage/>} path="/RejectedPage"/>
            <Route element={<ProfilePage/>} path="/ProfilePage"/>
            <Route element={<EmailVerification/>} path="/EmailVerification"/>
            <Route element={<SinglePostPage/>} path="/Singlepost/:id"/>
        </Routes>
        </BrowserRouter>
    )
}
export default Navigation