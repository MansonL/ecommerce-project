import axios from "axios";
import moment from "moment";
import React from "react";
import { useContext, useState } from "react";
import { INew_User } from "../../../server/src/common/interfaces/users";
import { validator } from "../../../server/src/common/interfaces/joiSchemas";
import { SignUpForm } from "./components/SignUpForm";
import { authResponse } from "./Main";
import { UserContext } from './components/UserProvider'
import './SignUp.css'
import { Profile } from "./Profile";
import { LogSignHeaderWrapper } from "./components/LogSignHeaderWrapper";
import { newUserDefault } from "../utils/interfaces";
import { cleanEmptyProperties } from "../utils/utilities";

export function SignUp () {
    
    const [showResult, setShowResult] = useState(false);
    const [loginSignResult, setLoginSignResult] = useState(false);
    const [msgResult, setMsgResult] = useState('');

    const { loggedIn } = useContext(UserContext)

    /**
     * Simple function for deleting the result message of the form submission attempt.
     */
    const deleteResultMsg = () => {
      setShowResult(false);
    }

    const [newUser, setNewUser] = useState<INew_User>(newUserDefault)
    const [repeatedPassword, setRepeatedPassword] = useState('')
    //const [showPassRequirements, setShowPassRequirements] = useState([false, false]);
    
    /**
     * 
     * @param ev with this param we are getting the value of the target fields "name" & "value"
     * With them we are going to make a dinamic change of the user data state, accessing to the user data
     * properties via [key : string]. 
     * 
     */
    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const property = ev.target.name;
        const value = ev.target.value;
        setNewUser({
            ...newUser,
            [property]: value
        })
    }
    

    /**
     * 
     * @param ev just for preventing default submit action.
     * 
     * Description:
     * First complete the user object timestamp for requesting the signing up to the backend. 
     * Check if there's an error or not with the user data validation. Then make the POST request & show if
     * it was successful or there was an error.
     * 
     */
    const signupSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        let user : INew_User= {
               ...newUser,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            modifiedAt: moment().format('YYYY-MM-DD HH:mm:ss')
        };
        user =  cleanEmptyProperties(user);
        const { error } = validator.user.validate(user);
        if(error){
          setShowResult(true);
          setLoginSignResult(false);
          setMsgResult(error.message);
        }else{
          axios.post<authResponse>('http://localhost:8080/api/auth/signup', user, { withCredentials: true }).then(response => {
            const data = response.data;
            if(data.data){
              setShowResult(true);
              setLoginSignResult(true);
              setMsgResult(data.message);  
            }else{
              setShowResult(true);
              setLoginSignResult(false);
              setMsgResult(data.message)
            }
          }).catch(error => {
            setShowResult(true);
            setLoginSignResult(false);
            setMsgResult(error.response.data.message)
          })
          
        }
        
    }

    return (
        <>
        {!loggedIn ?  <>
        <LogSignHeaderWrapper showResult={showResult} msgResult={msgResult} type="signup" deleteResultMsg={deleteResultMsg} logSignResult={loginSignResult}/>
    <section>
      <SignUpForm signupSubmit={signupSubmit} onChange={onChange} newUser={newUser} repeatedPassword={repeatedPassword} setRepeatedPassword={setRepeatedPassword}/>

    </section>
    </> : <Profile/>}
    </>
    ) 
}