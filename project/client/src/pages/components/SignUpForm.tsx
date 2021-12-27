import React, { useState } from "react";
import { INew_User } from "../../utils/interfaces";
import '../SignUp.css'

interface SignUpFormProps {
    signupSubmit: (ev: React.FormEvent<HTMLFormElement>) => void;
    onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
    newUser: INew_User;
    repeatedPassword: string;
    setRepeatedPassword: React.Dispatch<React.SetStateAction<string>>
}

export function SignUpForm(props: SignUpFormProps) {
    
    const [showHide, setShowHide] = useState(false);

    /**
     * Simple function for changing the Hide/Show button at password input.
     */
    const showHideClick = () => setShowHide(!showHide) ;
    
    return (
        <form onSubmit={props.signupSubmit}>
        <div className="user-login">

          <div className="row-form">

            <div className="effect-input"><input type="text" className="label-styled-input" value={props.newUser.name} onChange={props.onChange} name="name" />
              <label className={props.newUser.name !== '' ? "hasContent" : "label-styled"}>Name</label>
              <span className="form-border" />
            </div>
          </div>
          <div className="row-form">
            <div className="effect-input">
              <input type="text" className="label-styled-input" name="surname" onChange={props.onChange} value={props.newUser.surname}/>
              <label className={props.newUser.surname !== '' ? "hasContent" : "label-styled"}>Surname</label>
              <span className="form-border"/>
            </div>
          </div>
          <div className="row-form">
            <div className="effect-input">
              <input type="date" min="1922-11-28" max="2011-11-28" className="label-styled-input" name="age" onChange={props.onChange} value={props.newUser.age}/>
              <label className="hasContent">Born date</label>
              <span className="form-border"/>
            </div>
          </div>
          <div className="row-form">
            <div className="effect-input">
              <input type="text" className="label-styled-input" name="alias" onChange={props.onChange} value={props.newUser.alias}/>
              <label className={props.newUser.alias !== '' ? "hasContent" : "label-styled"}>Alias</label>
              <span className="form-border"/>
            </div>
          </div>
          <div className="row-form">
            <div className="effect-input">
              <input type="url" className="label-styled-input" name="avatar" onChange={props.onChange} value={props.newUser.avatar}/>
              <label className={props.newUser.avatar !== '' ? "hasContent" : "label-styled"}>Avatar (url image)</label>
              <span className="form-border"/>
            </div>
          </div>
          <div className="row-form">
            <div className="effect-input">
              <input type="email" className="label-styled-input" name="username" onChange={props.onChange} value={props.newUser.username}/>
              <label className={props.newUser.username !== '' ? "hasContent" : "label-styled"}>Email</label>
              <span className="form-border"/>
            </div>
          </div>
          <div className="pswd-form">
            
            <div className="effect-input"><input type={showHide ? "text" : "password" } className="label-styled-input" value={props.newUser.password} onChange={props.onChange} name="password" />
              <label className={props.newUser.password !== '' ? "hasContent" : "label-styled"}>Password</label>
              <span className="form-border"></span>
              
            </div>
            <img className="info-icon" src="https://img.icons8.com/ios/50/000000/info.png"
                
            />
            <span className="pswd-requirement">Remember that your password should have at least <b>6 characters</b> with a maximum of <b>20</b>. At least <b>one uppercase </b>and <b>one number</b>.</span>
            <span className="show-pswd" onClick={showHideClick}>{showHide ? "Hide" : "Show"}</span>
          </div>
          <div className="pswd-form">
            
              
            <div className="effect-input">
              <input type={showHide ? "text" : "password" } className="label-styled-input" value={props.repeatedPassword} onChange={(ev) => props.setRepeatedPassword(ev.target.value)} name="password" />
              <label className={props.repeatedPassword !== '' ? "hasContent" : "label-styled"}>Repeat your password</label>
              <span className="form-border"></span>
         
            </div>
            
            <img className="info-icon" src="https://img.icons8.com/ios/50/000000/info.png"
                alt=""
                
            />
            <span className="pswd-requirement">Remember that your password should have at least <b>6 characters</b> with a maximum of <b>20</b>. At least <b>one uppercase </b>and <b>one number</b>.</span>
            <span className="show-pswd" onClick={showHideClick}>{showHide ? "Hide" : "Show"}</span>
          </div>
          <div className="submit-row">
            <button type="submit" className="submit-form">Submit</button>
          </div>
        </div>
      </form>
    )
}