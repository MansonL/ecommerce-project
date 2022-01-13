import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { authResponse } from '../Main';
import { verifyToken } from "../../utils/utilities";
import { IUserInfo, userDefaultValue } from "../../utils/interfaces";

interface ClickableProps {
    children: JSX.Element[] | JSX.Element;
  }



export const UserContext = createContext({
    user: userDefaultValue,
    loggedIn: false,
    updateLoginStatus: (): void => {}
});

export function UserProvider (props: ClickableProps) {
    const [user, setUser] = useState<IUserInfo>(userDefaultValue);
    const [loggedIn, setLoggedIn] = useState(false);
    const [token, setToken] = useState('');

    const updateLoginStatus = () => {
        setLoggedIn(loggedIn ? false : true);
        if(loggedIn){
            setUser(userDefaultValue)
        }
    }

    const fetchUser = () => {
        axios.get<authResponse>('http://localhost:8080/api/auth/login', { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }).then(async response => {
            if(response.status >= 200){
               setToken(response.data.data as string);
                const user = await verifyToken(response.data.data as string);
               setLoggedIn(true);
               setUser(user)
            }
        }).catch(error => {
            if(error.response){
                setLoggedIn(false);
                setUser(userDefaultValue);
            }
        })
    }

    useEffect(() => {
        fetchUser()
    },[])

    return (
        <UserContext.Provider value={{user, loggedIn, updateLoginStatus}}>
            {props.children}
        </UserContext.Provider>
    )
}