import axios, { AxiosResponse } from 'axios';
import { Types } from 'mongoose';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAddresses } from '../../../server/src/common/interfaces/users';
import { defaultAddress, UserCUDResponse } from '../utils/interfaces';
import { validation } from '../utils/joiSchemas';
import './addressForm.css';
import { ModalContainer } from './components/Modal/ModalContainer';
import { OperationResult } from './components/Result/OperationResult';
import { LoadingSpinner } from './components/Spinner/Spinner';
import { UserContext } from './components/UserProvider';

export function AddressForm(){


    const [resultMsg, setResultMsg] = useState('');
    const [showResultMsg, setShowResult] = useState(false);
    const [addressResult, setAddressResult] = useState(false);

    const { loading, token, updateLoading, cartConfirmated } = useContext(UserContext);

    const [newAddress, setNewAddress] = useState<UserAddresses>(defaultAddress);

    const navigate = useNavigate();
    
    if(!cartConfirmated)
      navigate('../cart')

    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
      const name = ev.target.name;
      const value = ev.target.value;
      if(name === 'name'){
        setNewAddress({
          ...newAddress,
          street1: {
            ...newAddress.street1,
            [name]: value,
          }
        })
      }else if(name === 'number' ){
        setNewAddress({
          ...newAddress,
          street1: {
            ...newAddress.street1,
            [name]: Number(value),
          }
        })
      }
      setNewAddress({
        ...newAddress,
        [name]: value,
      })
    }

    

    const AxiosThenCallback =  (response: AxiosResponse<UserCUDResponse, any>) => {
      const data = response.data;
      setAddressResult(true);
      setResultMsg(data.message);
      setShowResult(true);
        updateLoading();
        document.body.style.overflow = "scroll";
        setTimeout(() => {
          setShowResult(false);
          setAddressResult(false);
          setResultMsg('')
          navigate('../addresses');
        }, 2000)
    }


    const AxiosCatchCallback = (error: any) => {
      updateLoading();
          document.body.style.overflow = "scroll";
          console.log(JSON.stringify(error, null, '\t'));
          setAddressResult(false);
          setShowResult(true);
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
            setAddressResult(false);
            setShowResult(false);
            setResultMsg('')
          }, 3000)
    }


    const saveAddress = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const { error } = validation.address.validate(newAddress);
      if(error){
        setShowResult(true);
        setAddressResult(false);
        setResultMsg(error.message)
      }else{
        updateLoading();
        document.body.style.overflow = "hidden";
        const address : UserAddresses = {
          ...newAddress,
          _id: new Types.ObjectId().toString()
        }
        axios.post('http://localhost:8080/api/users/address', address, { withCredentials: true, headers: { Authorization: `Bearer ${token}`}})
        .then(AxiosThenCallback)
        .catch(AxiosCatchCallback)
      }
    }

    return (
        <section className="body-container">
    <div className="address-header">
     <h2 className="header-title">Address</h2>
     <h5>We have noticed that you don't have any address saved...<br/
     >Before you confirm your order you need to choose one, so here you can save an address to select it after.</h5>
   </div>
   {loading && <ModalContainer>
      <LoadingSpinner/>
     </ModalContainer>}
     {showResultMsg && <OperationResult success={addressResult} resultMessage={resultMsg}/> }
    <div className="address-fields">
        <div className="address-field">
            <input type="text" onChange={onChange} value={newAddress.alias} className="styled-input" name="alias" id="alias"/>
              <label htmlFor="alias" className="animated-label"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png" alt="" className="required-field"/> Alias <span style={{fontSize:"0.4rem"}}>(optional)</span></label>
              <span className="input-border"></span>
          </div>
      <div className="street1">
        <label htmlFor="street1" style={{marginBottom:"1rem"}}><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png" alt="" className="required-field"/> Street 1</label>
        <div className="street1-container">
        <div className="address-field">
          <input type="text" onChange={onChange} value={newAddress.street1.name} className="styled-input" name="name" id="stree1name"/>
          <label htmlFor="street1name" className="animated-label"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png" alt="" className="required-field"/> Name</label>
          <span className="input-border"></span>
        </div>
        <div className="address-field">
           <input type="number" onChange={onChange} value={newAddress.street1.number} className="styled-input" name="number" id="stree1number" min="0" max="99999" step="10"/>
          <label htmlFor="street1number" className="animated-label"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png" alt="" className="required-field" style={{width:"6%"}}/> Number</label>
          <span className="input-border"></span>
        </div>
          </div>
      </div>
      <div className="dpt-floor">
        <div className="address-field">
          <input type="text" onChange={onChange} value={newAddress.department} className="styled-input" name="department" id="department"/>
          <label htmlFor="department" className="animated-label">Department <span style={{fontSize:"0.4rem"}}>(optional)</span></label>
          <span className="input-border"></span>
        </div>
        <div className="address-field">
          <input type="text" onChange={onChange} value={newAddress.floor} className="styled-input" name="floor" id="floor"/>
          <label htmlFor="floor" className="animated-label">Floor <span style={{fontSize:"0.4rem"}}>(optional)</span></label>
          <span className="input-border"></span>
        </div>
      </div>
      <div className="address-field">
        <input type="text" onChange={onChange} value={newAddress.street2} className="styled-input" name="street2" id="stree2"/>
          <label htmlFor="street2" className="animated-label"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png" alt="" className="required-field"/> Street 2 <span style={{fontSize:"0.4rem"}}>(optional)</span></label>
          <span className="input-border"></span>
      </div>
      <div className="address-field">
        <input type="text" onChange={onChange} value={newAddress.street3} className="styled-input" name="street3" id="stree3"/>
          <label htmlFor="street3" className="animated-label"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png" alt="" className="required-field"/> Street 3 <span style={{fontSize:"0.4rem"}}>(optional)</span></label>
          <span className="input-border"></span>
      </div>
      <div className="address-field">
        <input type="text" onChange={onChange} value={newAddress.city} className="styled-input" name="city" id="city"/>
          <label htmlFor="city" className="animated-label"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png" alt="" className="required-field"/> City</label>
          <span className="input-border"></span>
      </div>
      <div className="address-field">
        <input type="text" onChange={onChange} value={newAddress.zipcode} className="styled-input" name="zipcode" id="zipcode"/>
          <label htmlFor="zipcode" className="animated-label"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png" alt="" className="required-field"/> Zipcode</label>
          <span className="input-border"></span>
      </div>
      <div className="address-field">
         <input type="text" onChange={onChange} value={newAddress.extra_info} className="styled-input" name="extra_info" id="extra_info"/>
          <label htmlFor="extra_info" className="animated-label">Additional instructions <span style={{fontSize:"0.4rem"}}>(optional)</span></label>
          <span className="input-border"></span>
      </div>
      <div className="submit-row" style={{textAlign:"center"}}>
    <button className="submit-btn" onClick={saveAddress}>Save</button>
  </div>
    </div>
  
  </section>
    )
}