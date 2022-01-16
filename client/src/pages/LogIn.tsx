import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";

import { authResponse } from "../utils/interfaces";
import { validation } from "../utils/joiSchemas";
import { ModalContainer } from "./components/Modal/ModalContainer";
import { OperationResult } from "./components/Result/OperationResult";
import { LoadingSpinner } from "./components/Spinner/Spinner";
import { UserContext } from "./components/UserProvider";


export function LogIn (){
    
    const [showResult, setShowResult] = useState(false);
    const [loginResult, setLoginResult] = useState(false);
    const [resultMsg, setResultMsg] = useState('');

    const { updateLoginStatus, updateLoading, loading } = useContext(UserContext);

    const [showHide, setShowHide] = useState(false);
    
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });

    /**
     * Simple function for changing the Hide/Show button at password input.
     *
    */
    const showHideClick = () => {
      setShowHide(!showHide);
    }

    /**
     * At every change event in the inputs field, we are setting the state with those values.
     * @param ev event param, just for taking the target name & value.
     *
    */
    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
      const property = ev.target.name;
      const value = ev.target.value;
      setCredentials({
        ...credentials,
        [property]: value,
      })
    }

    const loginAxiosCallback =  (response: AxiosResponse<authResponse, any>) => {
      const data = response.data;
        setShowResult(true);
        setLoginResult(true);
        setResultMsg(data.message);
        updateLoginStatus(data.data)
        updateLoading();
        document.body.style.overflow = "scroll";
        setTimeout(async () => {
             setShowResult(false);
             setLoginResult(false);
             setResultMsg('');
        },2000)
    }

    /**
     * Function that receives the form submit event. Validate the current inputs value and then make the axios get 
     *
    */
    const logInSubmit = (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      const { error } = validation.login.validate(credentials);
      if(error){
        setShowResult(true);
        setLoginResult(false);
        setResultMsg(error.message);
      }else{
        updateLoading();
        document.body.style.overflow = "hidden";
        axios.post<authResponse>(`http://localhost:8080/api/auth/login`, credentials,{withCredentials: true}).then(loginAxiosCallback)
        .catch(error => {
          updateLoading();
          document.body.style.overflow = "scroll";
          console.log(JSON.stringify(error, null, '\t'));
          setShowResult(true);
          setLoginResult(false);
          if(error.response){
            if(error.response.status === 500){
              setResultMsg(error.response.data.message)
            }else{
              setResultMsg(error.response.data.message)
            }
          }else if(error.request){
              setResultMsg(`No response received from server.`)
          }else{
              setResultMsg(`Request error.`)
          }
          setTimeout(async () => {
            setShowResult(false);
            setLoginResult(false);
            setResultMsg('');
       },3000)
        })
      }
    }

    useEffect(() => {
      setCredentials({
        username: '',
        password: '',
      })
      setShowResult(false);
    }, [])
    
    return (
        <>
        {loading && <ModalContainer>
          <LoadingSpinner/>
        </ModalContainer>}
        <section className="body-container">
    <div className="login-signup-header">
      <h3 className="header-title">Log in</h3>
      <h5>Don't you have an account? Sign up here</h5> 
    </div>
    {showResult && <OperationResult success={loginResult} resultMessage={resultMsg} />}
    <div className="login-signup-fields">
      <div className="login-signup-field">
        <input type="text" id="username" name="username" className="styled-input" onChange={onChange}/>
        <label htmlFor="username" className="animated-label">Username</label>
        <span className="input-border"></span>
      </div>
      <div className="password-field">
        <div className="pswd-input-wrapper">
          <input type={showHide ? "text" : "password"} id="password" name="password" className="styled-input password-input" onChange={onChange}/>
          <label htmlFor="password" className="animated-label">Password</label>
          <span className="input-border"></span>
        </div>

        <img src="https://cdn3.iconfinder.com/data/icons/show-and-hide-password/100/show_hide_password-07-512.png" alt="" className="show-pswd-icon" onClick={showHideClick}/>

      </div>
      <div className="submit-row">
        <button className="submit-btn" onClick={logInSubmit}>Submit</button>
      </div>
    </div>
  </section>
        </>
    )
}
