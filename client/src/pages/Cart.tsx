import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import React from "react";
import { CartCUDResponse, cartDefault } from "../utils/interfaces";
import { UserContext } from "./components/UserProvider";
import { OperationResult } from "./components/Result/OperationResult";
import { useNavigate } from "react-router-dom";
import { ModalContainer } from "./components/Modal/ModalContainer";
import { LoadingSpinner } from "./components/Spinner/Spinner";
import './cart.css';

export function Cart () {
    
  const [showModificationResult, setShowModificationResult] = useState(false);
  const [modificationResult, setModificationResult] = useState(false);
  const [resultMsg, setResultMsg] = useState('');

  const {cart, setCart} = useContext(UserContext);
  const {loading, setLoading} = useContext(UserContext);
  const { cartConfirmated, setCartConfirmated } = useContext(UserContext);
  const { user, token } = useContext(UserContext);
  

  const navigate = useNavigate();

    const AxiosThenCallback =  (response: AxiosResponse<CartCUDResponse, any>) => {
      const data = response.data;
      setModificationResult(true);
      setResultMsg(data.message);
      setShowModificationResult(true);
        setCart(data.data)
        setLoading(false);
        document.body.style.overflow = "scroll";
        setTimeout(() => {
          setModificationResult(false);
          setShowModificationResult(false);
          setResultMsg('')
        }, 2000)
    }

    const AxiosCatchCallback = (error: any) => {
      setLoading(false);
          document.body.style.overflow = "scroll";
          console.log(JSON.stringify(error.response, null, 2))
          setShowModificationResult(true);
          setModificationResult(false);
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
          setTimeout(() => {
            setModificationResult(false);
            setShowModificationResult(false);
            setResultMsg('')
          }, 3000)
    }


    const handleRemove = (id: string) => {
      const cartData = {
        product_id: id,
        quantity: 1,
      }
      setLoading(true);
      document.body.style.overflow = "hidden";
      axios.delete<CartCUDResponse>('http://localhost:8080/api/cart/delete', { data: cartData,       withCredentials: true, headers: { Authorization: `Bearer ${token}` }})
      .then(AxiosThenCallback)
      .catch(AxiosCatchCallback)
    }


    const handleAdd = (id: string) => {
      const cartData = {
        product_id: id,
        quantity: 1,
      }
      setLoading(true);
      document.body.style.overflow = "hidden";
      axios.post<CartCUDResponse>('http://localhost:8080/api/cart/add', cartData , { withCredentials: true, headers: { Authorization: `Bearer ${token}` }})
      .then(AxiosThenCallback)
      .catch(AxiosCatchCallback)
    }

    const cartConfirmation = () => {
      setCartConfirmated(true);
      if(user.addresses && user.addresses.length > 0) 
        navigate('../addresses')
      else 
        navigate('../new-address')
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

    useEffect(() => {
      fetchUserCart();
    }, []);

    return (
      <React.Fragment>
        <section className="body-container">
    <div className="cart-header">
      <h3 className="header-title">Cart</h3>
    </div>

    {loading && <ModalContainer>
      <LoadingSpinner/>
      </ModalContainer>}

      {showModificationResult && 
      <OperationResult success={modificationResult} resultMessage={resultMsg}/>}

      <ul className="cart-products">
     {cart.products.length > 0 ? cart.products.map((product, idx) => {
       return (
        <li className="cart-product" id={String(idx)}>
          <img className="product-image" src={product.product.images[0].url} alt="" />
          <div className="product-info">
            <span className="product-title">{product.product.title}</span>
            <span className="product-price">{product.product.price}</span>
            <div className="qty-container">
              <span style={{fontSize:"0.8rem", position:"relative", width:"30%"}}>Quantity:<span className="qty-underline"></span></span><span style={{fontSize:"1.1rem"}}>{product.quantity}</span>
            </div>
          </div>
          <div className="add-remove-container">
            <button className="add-remove-btn" onClick={() => handleRemove(String(product.product._id))}><img src="https://cdn3.iconfinder.com/data/icons/basic-flat-svg/512/svg01-512.png" alt="add-icon" className="add-remove-icon"/></button> 
            <button className="add-remove-btn" onClick={() => handleAdd(String(product.product._id))}><img src="https://cdn-icons-png.flaticon.com/512/216/216685.png" alt="remove-icon" className="add-remove-icon"/></button> 
         </div>
        </li>
       )
     }) : ""}
     </ul>
    {cart.products.length > 0 ? <>
    <div className="cart-confirmation">
     <p>Everything right? Let's confirm and finish your order!</p>
      <p><b>After clicking the button you're going to be asked to select your desired address where the package will be delivered.</b></p> <br/>
        <div style={{paddingBottom:"3rem", textAlign:"center"}} className="submit-row">
        <button className="submit-btn"onClick={cartConfirmation}>Confirm cart</button>
          </div>
    </div></> : <OperationResult resultMessage="Your cart is empty! Let's buy." success={false}/>}
  </section>
        </React.Fragment>
    )
}