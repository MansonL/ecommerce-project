import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { verifyToken } from "../../utils/utilities";
import { authResponse, cartDefault, CartCUDResponse, IUserInfo, userDefaultValue } from "../../utils/interfaces";
import { IMongoCart } from "../../../../server/src/common/interfaces/products";

interface ClickableProps {
    children: JSX.Element[] | JSX.Element;
  }



export const UserContext = createContext({
    user: userDefaultValue,
    loggedIn: false,
    loading: false,
    cart: cartDefault,
    token: '',
    updateLoginStatus: (token: string | undefined): void => {},
    updateLoading: (): void => {},
    updateCart: (cart: IMongoCart): void => {},
    selectAddress: (address: string): void => {},
    selectedAddress: '',
    confirmateCart: (): void => {},
    cartConfirmated: false,
});

export function UserProvider (props: ClickableProps) {
    const [user, setUser] = useState<IUserInfo>(userDefaultValue);
    const [cart, setCart] = useState<IMongoCart>(cartDefault)
    const [cartConfirmated, setCartConfirmated] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [token, setToken] = useState('');
    const [selectedAddress, setSelectedAddress] = useState('');

    const [loading, setLoading] = useState(false);

    const updateLoading = () => {
        setLoading(!loading);
    }

    const selectAddress = (address: string) => {
        setSelectedAddress(address)
    }

    const updateCart = (cart: IMongoCart) => {
        setCart(cart);
    }

    const confirmateCart = () => {
        setCartConfirmated();
    }

    const updateLoginStatus = async (token: string | undefined) => {
        if(token){
            const user = await verifyToken(token);
        setToken(token)
        setUser(user)
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
               setToken(response.data.data);
                const user = await verifyToken(response.data.data);
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

    const fetchUserCart = () => {
        axios.get<CartCUDResponse>(`http://localhost:8080/api/cart/list/${user.user_id}`, { withCredentials: true, headers: { Authorization: `Bearer ${token}` }}).then(async response => {
            if(response.status >= 200){
                const data = response.data;
                setCart(data.data[0]);
             }
         }).catch(error => {
             if(error.response){
                 setCart(cartDefault);
             }
         })
    }

    console.log(loading)
    useEffect(() => {
        fetchUser();
        fetchUserCart();
    },[])

    return (
        <UserContext.Provider value={{user, cart, loggedIn, updateLoginStatus, updateLoading, updateCart, confirmateCart, selectAddress, selectedAddress, cartConfirmated, loading, token}}>
            {props.children}
        </UserContext.Provider>
    )
}