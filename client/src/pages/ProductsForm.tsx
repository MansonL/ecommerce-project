import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INew_Product } from '../../../server/src/common/interfaces/products';
import { defaultProduct, ProductCUDResponse } from '../utils/interfaces';
import { validation } from '../utils/joiSchemas';
import { ModalContainer } from './components/Modal/ModalContainer';
import { OperationResult } from './components/Result/OperationResult';
import { LoadingSpinner } from './components/Spinner/Spinner';
import { UserContext } from './components/UserProvider';
import './productsForm.css'


export function ProductsForm() {
  
  /**
   * 
   * State of the future new products & error at submitting the Form with an invalid value.
   * 
   *
   */
  const [showResult, setShowResult] = useState(false);
  const [submitResult, setSubmitResult] = useState(false);
  const [resultMsg, setResultMsg] = useState('');

  const { user, loading, token, updateLoading } = useContext(UserContext); 
  const navigate = useNavigate();

  if(!user.isAdmin)
    navigate('../login');
  

  const [newProduct, setNewProduct] = useState<INew_Product>(defaultProduct)

  

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(JSON.stringify(e.target.value, null, '\t'));
    const property : string = e.target.name;
    const value : string | number = e.target.value 
    setNewProduct({
      ...newProduct,
      [property]: property === 'price' ? Number(value) : property === 'stock' ? Number(value) : value 
    })
  }



  const AxiosThenCallback =  (response: AxiosResponse<ProductCUDResponse, any>) => {
    const data = response.data;
      setShowResult(true);
      setSubmitResult(true);
      setResultMsg(data.message);
      updateLoading();
      document.body.style.overflow = "scroll";
      setTimeout(async () => {
           setShowResult(false);
           setSubmitResult(false);
           setResultMsg('');
      },2000)
  }

  const AxiosCatchCallback = (error: any) => {
    updateLoading();
        document.body.style.overflow = "scroll";
        console.log(JSON.stringify(error, null, '\t'));
        setShowResult(true);
        setSubmitResult(false);
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
          setSubmitResult(false);
          setShowResult(false);
          setResultMsg('')
        }, 3000)
  }




  const submitProduct = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const product : INew_Product = {
      ...newProduct,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      modifiedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    }
    const { error } = validation.newProduct.validate(product);
    if(error){

    }else{
      updateLoading();
      document.body.style.overflow = "hidden";
      axios.post<ProductCUDResponse>('http://localhost:8080/api/products/save', product, { withCredentials: true, headers: {  Authorization: `Bearer ${token}`  } })
      .then(AxiosThenCallback)
      .catch(AxiosCatchCallback)
    }
  }


  return (
        <>
        <section className="body-container">
    <div className="login-signup-header">
     <h3 className="header-title">Upload product</h3>
     <h5>Here you have all the basic fields to fill htmlFor creating a product in your website and database. <span style={{fontSize:"0.6rem"}}>(for changes ask to administrator.)</span></h5>
   </div>
   {loading && <ModalContainer>
     <LoadingSpinner/>
     </ModalContainer>}
     { showResult && <OperationResult  success={submitResult} resultMessage={resultMsg}/> }
   <div className="product-form">
    <div className="product-field">
      <input type="text" onChange={onChange} className="styled-input" id="title" name="title"/>
       <label htmlFor="title" className="animated-label"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png" alt="" className="required-field"/> Product title </label>
       <span className="input-border"></span>
    </div>
    <div className="product-field">
      <input type="text" onChange={onChange} className="styled-input" id="description" name="description"/>
       <label htmlFor="description" className="animated-label"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png" alt=""  className="required-field"/> Description</label>
       <span className="input-border"></span>
    </div>
    <div className="code-field">
      <div className="product-field">
        <input type="text" onChange={onChange} className="styled-input" id="code" name="code"/>
       <label htmlFor="code" className="animated-label"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png" alt="" className="required-field" style={{width:"5%"}}/> Code</label>
       <span className="input-border"></span>
      </div>
      <button className="code-btn">Generate code</button>
    </div>
    <div className="product-field">
      <input type="file" multiple onChange={onChange} className="styled-input" id="images" name="images"/>
       <label htmlFor="images" className="filled-input-label"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png" alt="" className="required-field"/> Images</label>
       <span className="input-border"></span>
    </div>
    <div className="product-field">
      <input type="number" className="styled-input" onChange={onChange} id="stock" name="stock" min="1" step="1"/>
       <label htmlFor="stock" className="animated-label"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png" alt="" className="required-field"/> Stock</label>
       <span className="input-border"></span>
    </div>
    <div className="product-field">
      <input type="number" className="styled-input" id="price" onChange={onChange} name="price" min="0.01" step="0.25"/>
       <label htmlFor="price" className="animated-label"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png" alt="" className="required-field"/> Price</label>
       <span className="input-border"></span>
    </div>
    <div className="product-field">
      <input type="text" onChange={onChange} className="styled-input" id="category" name="category"/>
       <label htmlFor="category" className="animated-label"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png" alt="" className="required-field"/> Category</label>
       <span className="input-border"></span>
    </div>
     <div className="submit-row">
       <button className="submit-btn" onClick={submitProduct}>Submit</button>
     </div>
   </div>
 </section>
</>
    )
}