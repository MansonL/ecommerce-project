import { createContext, useState } from 'react';
import { AppContext, Authenticated, IUser } from '../utils/interfaces';
import { IMongoCart } from '../../../server/src/interfaces/products';

interface ClickableProps {
    children: JSX.Element[] | JSX.Element;
}

export const UserContext = createContext<AppContext>({
    user: undefined,
    setUser: (user: IUser): void => {},
    loggedIn: false,
    setLoggedIn: (boolean: boolean): void => {},
    loading: false,
    setLoading: (boolean: boolean): void => {},
    cart: undefined,
    setCart: (cart: IMongoCart): void => {},
    selectedAddress: '',
    setSelectedAddress: (address: string): void => {},
    cartConfirmated: false,
    setCartConfirmated: (boolean: boolean): void => {},
    updateLoginStatus: (userData: Authenticated | undefined): void => {},
});

export function UserProvider(props: ClickableProps) {
    const [user, setUser] = useState<IUser>();

    const [cart, setCart] = useState<IMongoCart>();

    const [cartConfirmated, setCartConfirmated] = useState(false);

    const [loggedIn, setLoggedIn] = useState(false);

    const [selectedAddress, setSelectedAddress] = useState('');

    const [loading, setLoading] = useState(false);

    const updateLoginStatus = async (userData: Authenticated | undefined) => {
        if (userData) {
            const { user_cart, ...user_data } = userData;
            setLoggedIn(true);
            setUser(user_data);
            setCart(user_cart);
        } else {
            setLoggedIn(false);
            setUser(undefined);
            setCart(undefined);
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                updateLoginStatus,
                cart,
                setCart,
                cartConfirmated,
                setCartConfirmated,
                loading,
                setLoading,
                loggedIn,
                setLoggedIn,
                selectedAddress,
                setSelectedAddress,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
}
