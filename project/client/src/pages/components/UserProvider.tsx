import { createContext, useEffect, useState } from "react";
import { IMongoUser } from "../../../../server/src/interfaces/interfaces";
import axios from 'axios'
import { authResponse } from '../Main';
import { isUser } from "../../utils/utilities";

interface ClickableProps {
    children: JSX.Element[] | JSX.Element;
  }


export const UserContext = createContext({
    user: {
        _id: '',
    timestamp: '',
    username: '',
    password: '',
    name: '',
    surname: '',
    alias: '',
    age: '',
    avatar: '',
    photos: [''],
    facebookID: '',
    },
    loggedIn: false,
    updateLoginStatus: () => {},
    updateDBUser: (user: IMongoUser) => {},
});

export function UserProvider (props: ClickableProps) {
    const [user, setUser] = useState<IMongoUser>({
        _id: '',
        timestamp: '',
        username: '',
        password: '',
        name: '',
        surname: '',
        alias: '',
        age: '',
        avatar: '',
        facebookID:'',
        photos: [''],
    });
    const [loggedIn, setLoggedIn] = useState(false);

    const updateLoginStatus = () => {
        setLoggedIn(loggedIn ? false : true);
        if(loggedIn){
            setUser({
            _id: '',
            timestamp: '',
            username: '',
            password: '',
            name: '',
            surname: '',
            alias: '',
            age: '',
            avatar: '',
            photos: [''],
            facebookID: ''
            })
        }
    }

    const updateDBUser = (user: IMongoUser) => {
        setUser(user)
    }


    const fetchUser = () => {
        axios.get<authResponse>('http://localhost:8080/api/auth/login', { withCredentials: true }).then(response => {
            console.log("Updating status")
            const data = response.data;
            console.log(data);
            if(isUser(data.data)){
                setLoggedIn(true);
                setUser(data.data)
            }else {
                setLoggedIn(false);
                setUser({
                    _id: '',
                timestamp: '',
                username: '',
                password: '',
                name: '',
                surname: '',
                alias: '',
                age: '',
                avatar: '',
                photos: [''],
                facebookID: '',
                })
                
            }
        })
    }

    useEffect(() => {
        fetchUser()
    },[])

    return (
        <UserContext.Provider value={{user, loggedIn, updateLoginStatus, updateDBUser}}>
            {props.children}
        </UserContext.Provider>
    )
}