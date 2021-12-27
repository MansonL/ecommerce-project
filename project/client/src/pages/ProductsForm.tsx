import axios from 'axios';
import moment from 'moment';
import React, { useState } from 'react';
import { CUDResponse, IMongoProduct, INew_Product } from '../utils/interfaces';
import { socket } from '../lib/socket';
import { validation } from '../utils/joiSchemas';
import { hasProductOrEmpty } from '../utils/utilities';
import './productsForm.css';

export function ProductsForm() {
  
  /**
   * 
   * State of the future new products & error at submitting the form with an invalid value.
   * 
   */
  const [errorForm, setErrorForm] = useState(false);
  const [successForm, setSuccessForm] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [newProduct, setNewProduct] = useState<INew_Product>({
    timestamp: '',
    title: '',
    description: '',
    code: '',
    img: '',
    price: 0,
    stock: 0,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    const product = {
      ...newProduct,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    console.log(product)
    const { error } = validation.newProduct.validate(product);
    console.log(error)
    if(error){
      if(!errorForm){
        setErrorForm(true);
        setSuccessForm(false);
        setResultMessage(error.message)
      }
    }else{
      const result = await (await axios.post<CUDResponse>('http://localhost:8080/products/save', product)).data;
      if(hasProductOrEmpty(result.data as IMongoProduct | [])){ // Here need to check if there's an instance of MongoProduct or an empty array (error);
        setErrorForm(false);
        setSuccessForm(true)
        setResultMessage(result.message);
        socket.emit('products')
      }else{
        setErrorForm(true);
        setSuccessForm(false);
        setResultMessage(result.message)
      }
    }
    
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const property : string = e.target.name;
    const value : string | number = e.target.value 
    setNewProduct({
      ...newProduct,
      [property]: value
    })
  }

  return (
        <>
        <header>
    <div className="title">
      <h4>Products Form</h4>
    </div>
  </header>
  <form className="form" onSubmit={handleSubmit}>
    <div className="row-form">
      <input type="text" name='title' className="label-styled-input"  onChange={handleFormChange} id="title" />
      <label className={newProduct.title != '' ? 'hasContent ' : 'label-styled'} htmlFor="title">Title</label>
      <span className="form-border"/>
    </div>
    <div className="row-form">
      <input type="text" name='description' className="label-styled-input"  onChange={handleFormChange} id="description"/>
      <label className={newProduct.description != '' ? 'hasContent ' : 'label-styled'} htmlFor="description">Description</label>
      <span className="form-border"/>
    </div>
    <div className="row-form"><input type="text" name='img' className="label-styled-input"  onChange={handleFormChange} id="image"/>
      <label className={newProduct.img != '' ? 'hasContent ' : 'label-styled'} htmlFor="img">Image link</label>
      <span className="form-border"/>
    </div>
    <div className="row-form"><input type="text" name='code' className="label-styled-input"  onChange={handleFormChange}   id="code"/>
      <label className={newProduct.code != '' ? 'hasContent ' : 'label-styled'} htmlFor="code">Code</label>
      <span className="form-border"/>
    </div>
    <div className="row-form">
      <input type="number" name='stock' className="label-styled-input"  onChange={handleFormChange} id="stock"/>
      <label className={newProduct.stock ? 'hasContent ' : 'label-styled'} htmlFor="stock">Stock</label>
      <span className="form-border"/>
    </div>
    <div className="row-form"><input type="number"  name='price' className="label-styled-input"  onChange={handleFormChange} id="price"/>
      <label className={newProduct.price ? 'hasContent ' : 'label-styled'} htmlFor="price">Price</label>
      <span className="form-border"/>
    </div>
    <div className="row-form submit-row">
      <button className="submit-form" type="submit">Save</button>
    </div>
  </form>
  {successForm && <div className="form-success">
      <div className="result-top">
        <span className="result-header">Successful!</span>
        <button className="result-btn"><i className="fas fa-times"></i></button>
      </div>
      <div className="result-message">
        <span>{resultMessage}</span>
      </div>
    </div>}
  {errorForm && <div className="form-error">
      <div className="result-top">
        <span className="result-header">Oops!</span>
        <button className="result-btn"><i className="fas fa-times"></i></button>
      </div>
      <div className="result-message">
        <span>{resultMessage}</span>
      </div>
    </div>}
</>
    )
}