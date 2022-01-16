import axios, { AxiosResponse } from 'axios';
import { Types } from 'mongoose';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAddresses } from '../../../server/src/common/interfaces/users';
import { orderResponse } from '../utils/interfaces';
import { ModalContainer } from './components/Modal/ModalContainer';
import { OperationResult } from './components/Result/OperationResult';
import { LoadingSpinner } from './components/Spinner/Spinner';
import { UserContext } from './components/UserProvider';
import './order.css';

export function Order(){

    const [showResult, setShowResult] = useState(false);
    const [orderResult, setOrderResult] = useState(false);
    const [resultMsg, setResultMsg] = useState('');

    const { selectedAddress, loading, cart, user, token, updateLoading } = useContext(UserContext);

    const navigate = useNavigate();

    const modifyAddress = () => {
      navigate('../addresses');
    }

    let totalOrder = [0]
    cart.products.forEach(product => {
      totalOrder[0] += product.quantity * product.product.price;
    })

    const fullAddress = (user.addresses as UserAddresses[]).filter(address => address.alias === selectedAddress)[0];
    const formattedAddres = `${fullAddress.street1.name} ${fullAddress.street1.number},${fullAddress.department && fullAddress.floor ? ` ${fullAddress.department} ${fullAddress.floor}, ` : ''}${fullAddress.city} ${fullAddress.zipcode}`



    const AxiosThenCallback =  (response: AxiosResponse<orderResponse, any>) => {
      const data = response.data;
        setShowResult(true);
        setOrderResult(true);
        setResultMsg(data.message);
        updateLoading();
        document.body.style.overflow = "scroll";
        setTimeout(async () => {
             setShowResult(false);
             setOrderResult(false);
             setResultMsg('');
        },2000)
    }

    const AxiosCatchCallback = (error: any) => {
      updateLoading();
          document.body.style.overflow = "scroll";
          console.log(JSON.stringify(error, null, '\t'));
          setShowResult(true);
          setOrderResult(false);
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
            setOrderResult(false);
            setShowResult(false);
            setResultMsg('')
          }, 3000)
    }


    const confirmOrder = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const data = {
        products: cart.products.map(product => {
          return {
          product_id: product.product._id,
          product_title: product.product.title,
          quantity: product.quantity,
          price: product.product.price
          }
        }),
        total: totalOrder[0],
        address: new Types.ObjectId(fullAddress._id),
        }
        updateLoading();
        document.body.style.overflow = "hidden";
      axios.post<orderResponse>('http://localhost:8080/api/orders/create', data, { withCredentials: true, headers: { Authorization: `Bearer ${token}` }})
      .then(AxiosThenCallback)
      .catch(AxiosCatchCallback)
    }

    return (
        <section className="body-container">
    <div className="order-header">
      <h2 className="header-title">Order Confirmation</h2>
      <h5>Here's the resume of your order, please check the details before confirming it...</h5>
    </div>
    { loading && <ModalContainer>
      <LoadingSpinner/>
      </ModalContainer>}
    { showResult && <OperationResult success={orderResult} resultMessage={resultMsg}/> }
    <div className="order-container">
      <div className="order-products">
        <span>Products:</span> <span style={{float:"right", fontSize:"0.8rem"}}>Modify</span>
        <div className="products-container">
          <ul className="products">
            {cart.products.map((product, idx) => {
              return (
                <li className="product" id={String(idx)}><img src={product.product.images[0].url} alt="" className="product-image"/><div className="product-info"><span className="product-title">{product.product.title}</span>
       <span className="product-price">{product.product.price} <span style={{fontSize:"0.8rem"}}>{product.quantity}</span></span></div><div style={{textAlign:"center", maxWidth:"25%"}}>
              <span style={{fontSize:"0.8rem"}}>Subtotal:</span><br/><span style={{fontSize:"1.5rem"}}>{product.quantity*product.product.price}</span>
              </div>
              </li>
              )
            })}            
          </ul>
           <div className="order-total">
                   <span>Total</span>
                   <br/><span style={{fontSize:"1.5rem"}}>{totalOrder}</span>
                 </div> 
        </div>
      </div>
      <div className="order-address">
        <span>The <b>address</b> you selected:</span><span style={{fontSize:"0.8rem", float:"right"}} onClick={modifyAddress}>Modify</span><br/>
        <span>{formattedAddres}</span>
      </div>
      <div className="submit-row" style={{marginBottom:"1rem", textAlign:"center"}}>
        <button className="submit-btn" onClick={confirmOrder}>Confirm order</button>
      </div>
    </div>
  </section>
    )
}