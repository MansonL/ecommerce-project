import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "./UserProvider";
import './userInfo.css'
import { authResponse } from "../Main";
import axios from "axios";

export function UserInfo (){
    
  const { user, loggedIn, updateLoginStatus } = useContext(UserContext)
  const [loggingOut, setLoggingOut] = useState(false);
  const [showResult, setShowResult] = useState(false)
  const navigate = useNavigate()

  /**
     * Click handler for logging out. We show a goodbye message and after 2 seconds come back to the login form.
     */
   const logOutClick = async () => {
    setLoggingOut(true);
    axios.get<authResponse>('http://localhost:8080/api/auth/logout', { withCredentials: true }).then(response => {
      const data = response.data;
      if(data.message.match(/Logged out/g)){
        setLoggingOut(true);
        setShowResult(false);
        setTimeout(() => {
          updateLoginStatus();
          navigate("/login")
        }, 2000)
      }         // Need to implement few modifications and UI for showing error in case of server
    })          // error at the attempt of logging out.
  }

  /**
     * Simple function for deleting the result message of the form submission attempt.
     */

   const deleteResultMsg = () => {
    setShowResult(false);
  }

  useEffect(() => {
    if(!loggedIn) navigate("/login");
  })

  return (
        <>
        { loggingOut ? <span>{`Goodbye ${user.name} ${user.surname}`}</span> :
         <>
    <header>
      <div className="title">
        <div className="title-header">
          <h4>Profile</h4>
          <button className="submit-form header-logout-btn" onClick={logOutClick}>Log Out</button>
        </div>
        <div className="sub-header">
          <p>We're glad to have you back here.</p>
          <p>Here you can change your personal and account information.</p>
        </div>
      </div>
    </header>
    <section>
      <div className="avatar-info">
        <img className="profile-avatar" src={user.avatar} alt="User profile avatar."/>
        <p>Change your avatar image</p>
      </div>
      <div className="personal-information">
        
        <div className="info-row">
          <div className="row-form">
            <input type="text" className="label-styled-input" disabled={true} value={user.name} /><label className="hasContent">Name</label><span className="form-border"/>
          </div> <div className="change-container">
          <span className="info-change">Change</span>
          </div>
        </div>
        <div className="info-row">
          <div className="row-form">
            <input type="text" className="label-styled-input" disabled={true} value={user.surname} /><label className="hasContent">Surname</label><span className="form-border"/>
          </div>
          <div className="change-container">
          <span className="info-change">Change</span>
            </div>
        </div>
        
        <div className="info-row">
          <div className="row-form"><input type="text" className="label-styled-input" disabled={true} value={user.alias} /><label className="hasContent">Alias</label>
            <span className="form-border"></span>
          </div>
         <div className="change-container">
          <span className="info-change">Change</span>
        </div>
          </div>
        
        <div className="info-row">
          <div className="row-form"><input type="email" className="label-styled-input" disabled={true} value={user.username}/><label className="hasContent">Email</label>
            <span className="form-border"></span>
          </div>
           <div className="change-container">
          <span className="info-change">Change</span>
            </div>
        </div>
        
        <div className="info-row">
          <div className="row-form"><input type="password" className="label-styled-input" disabled={true} value={user.password}/><label className="hasContent">Password</label>
            <span className="form-border"></span>
          </div>
          <div className="change-container">
  <span className="info-change">Change</span> </div>
       
          </div>
        
      </div>
    </section>
 </>}
    </>
        )
}