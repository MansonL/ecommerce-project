import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { verifyToken } from "../../utils/utilities";
import { authResponse, cartDefault, IUserInfo, userDefaultValue } from "../../utils/interfaces";
import { IMongoCart } from "../../../../server/src/common/interfaces/products";
interface ClickableProps {
    children: JSX.Element[] | JSX.Element;
  }



export const UserContext = createContext({
    user: userDefaultValue,
    loggedIn: false,
    setLoggedIn: (boolean: boolean): void => {},
    loading: false,
    setLoading: (boolean: boolean): void => {},
    cart: cartDefault,
    setCart: (cart:IMongoCart): void => {},
    token: '',
    selectedAddress: '',
    setSelectedAddress: (address: string): void => {},
    cartConfirmated: false,
    setCartConfirmated: (boolean: boolean): void => {},
    updateLoginStatus: (token: string | undefined): void => {},
});

export function UserProvider (props: ClickableProps) {

    const [user, setUser] = useState<IUserInfo>(userDefaultValue);

    const [cart, setCart] = useState<IMongoCart>(cartDefault)

    const [cartConfirmated, setCartConfirmated] = useState(false);

    const [loggedIn, setLoggedIn] = useState(false);

    const [token, setToken] = useState('');

    const [selectedAddress, setSelectedAddress] = useState('');


    const [loading, setLoading] = useState(false);
    

    
    const updateLoginStatus = async (tokenParam: string | undefined) => {
        if(tokenParam){
            const user = await verifyToken(tokenParam);
        if(token !== tokenParam)
            setToken(tokenParam)
        setUser(user)
        console.log(user.isAdmin)
        setLoggedIn(true);
        }else{
            setLoggedIn(false);
            if(loggedIn){
                setUser(userDefaultValue)
            }
        }
    }

    const fetchUser = () => {
        axios.get<authResponse>('http://localhost:8080/api/auth/login', { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }).then(async response => {
            if(response.status >= 200){
               setLoggedIn(true);
               updateLoginStatus(response.data.data)
            }
        }).catch(error => {
            if(error.response){
              console.log(JSON.stringify(error.response, null, 2))
                setLoggedIn(false);
                updateLoginStatus(undefined);
            }
        })
    }

    useEffect(() => {
        fetchUser();
    }, [])

    return (
        <UserContext.Provider value={{user, updateLoginStatus, cart, setCart, cartConfirmated, setCartConfirmated, token, loading, setLoading, loggedIn, setLoggedIn, selectedAddress, setSelectedAddress}}>
            {props.children}
        </UserContext.Provider>
    )
}