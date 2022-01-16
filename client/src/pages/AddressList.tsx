import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAddresses } from '../../../server/src/common/interfaces/users';
import './addressesList.css';
import { UserContext } from './components/UserProvider';

export function AddressesList (){

    const { user, cartConfirmated, selectAddress, selectedAddress } = useContext(UserContext);
    const navigate = useNavigate();
    
    if(!cartConfirmated)
      navigate('../cart')
    if(!(user.addresses && user.addresses.length > 0))
      navigate('../new-address');

    const goToCreateAddress = () => {
      navigate('../new-address');
    }

    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
      selectAddress(ev.target.value)
    }

    const addressConfirmation = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if(selectedAddress === '' && user.addresses)
        selectAddress((user.addresses[0]).alias)
      navigate('../order')
    }

    return (
        <section className="body-container">
    <div className="address-header">
     <h2 className="header-title">Address</h2>
     <h5>Please, select the address where you want us to deliver your package:</h5>
   </div>
     <div style={{width:"85%", fontSize:"0.8rem", margin:"auto"}} onClick={goToCreateAddress}>Create a new address</div>
     <ul className="addresses-list">
       
       {user.addresses?.map((address, idx)=> {
         return (
          <li className="address" id={String(idx)}>
            <input type="radio" onChange={onChange} checked={idx === 0} id={address.alias} name="address" value={address.alias}/>
            <label htmlFor={address.alias}><b>Home1</b></label>
            <div className="address-info">
              <span style={{fontSize:"0.8rem"}}>{`${address.street1.name} ${address.street1.number},${!address.street2 ? '' : address.street3 ? ` ${address.street2} and ${address.street3}` : ` ${address.street2}` }`}</span>
              {address.department && <span style={{fontSize:"0.8rem"}}>{`Department: ${address.department}`}</span>}
              {address.floor && <span style={{fontSize:"0.8rem"}}>{`Floor: ${address.floor}`}</span>}
              <span style={{fontSize:"0.8rem"}}>{`${address.city}, ${address.zipcode}`}</span>
              <span style={{fontSize:"0.8rem"}}>{address.extra_info}</span>
            </div>
          </li>
         )
       })}
     </ul>
     <div className="submit-row">
       <button className="submit-btn" onClick={addressConfirmation}>Confirm address</button>
     </div>
   </section>
    )
}