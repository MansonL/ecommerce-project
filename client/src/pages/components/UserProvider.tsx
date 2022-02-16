import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { verifyToken } from "../../utils/utilities";
import {
  authResponse,
  cartDefault,
  IUserInfo,
  userDefault,
} from "../../utils/interfaces";
import { IMongoCart } from "../../../../server/src/interfaces/products";
import { JwtPayload } from "jsonwebtoken";
interface ClickableProps {
  children: JSX.Element[] | JSX.Element;
}

export const UserContext = createContext({
  user: userDefault,
  setUser: (user: IUserInfo): void => {},
  loggedIn: false,
  setLoggedIn: (boolean: boolean): void => {},
  loading: false,
  setLoading: (boolean: boolean): void => {},
  cart: cartDefault,
  setCart: (cart: IMongoCart): void => {},
  token: "",
  selectedAddress: "",
  setSelectedAddress: (address: string): void => {},
  cartConfirmated: false,
  setCartConfirmated: (boolean: boolean): void => {},
  updateLoginStatus: (token: string | undefined): void => {},
});

export function UserProvider(props: ClickableProps) {
  const [user, setUser] = useState<IUserInfo>(userDefault);

  const [cart, setCart] = useState<IMongoCart>(cartDefault);

  const [cartConfirmated, setCartConfirmated] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);

  const [token, setToken] = useState("");

  const [selectedAddress, setSelectedAddress] = useState("");

  const [loading, setLoading] = useState(false);

  const updateLoginStatus = async (tokenParam: string | undefined) => {
    if (tokenParam) {
      const isValidToken: string | JwtPayload = await verifyToken(tokenParam);
      if (typeof isValidToken !== "string") {
        const { user_cart, ...user } = isValidToken.user;
        if (token !== tokenParam) setToken(tokenParam);
        console.log(user_cart);
        setCart(user_cart);
        setUser(user);
        setLoggedIn(true);
      }
    } else {
      setLoggedIn(false);
      if (loggedIn) {
        setUser(userDefault);
        setCart(cartDefault);
      }
    }
  };

  const fetchUser = () => {
    axios
      .get<authResponse>("http://localhost:8080/api/auth/login", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (response) => {
        if (response.status >= 200) {
          setLoggedIn(true);
          updateLoginStatus(response.data.data);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(JSON.stringify(error.response, null, 2));
          setLoggedIn(false);
          updateLoginStatus(undefined);
        }
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
        token,
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
