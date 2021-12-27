import React, { useEffect, useRef, useState } from 'react'
import './products.css'
import { CUDResponse, IMongoCartProduct, IMongoProduct, IQuery } from '../utils/interfaces'
import { socket } from '../lib/socket'
import axios from 'axios'
import { hasProductOrEmpty } from '../utils/utilities'

interface ProductsProp {
    products: IMongoProduct[] | IMongoCartProduct[];
    updateProducts: ((products: IMongoProduct[] | IMongoCartProduct[] | [], msg: string | undefined) => void) | undefined
    type: string;
    noProducts: boolean;
    noProductsMsg: string | undefined;
}

export function Products(props: ProductsProp) {
  const [filters, setFilters] = useState<IQuery>({
      title: '',
      code: '',
      price: {
        minPrice: 0,
        maxPrice: 0,
      },
      stock: {
        minStock: 0,
        maxStock: 0,
      }
    })

    const handleFiltersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const property = e.target.name
        if(/Price/g.test(property)){
          setFilters({
            ...filters,
            price: {
              ...filters.price,
              [property] : value
            }
          })
        }else if(/Stock/g.test(property)){
          setFilters({
            ...filters,
            stock: {
              ...filters.stock,
              [property]: value 
            }
          });
        }else{
          setFilters({
            ...filters,
            [property]: value
          });
        }
    }

    const handleFilterApply = async (ev: React.MouseEvent<HTMLButtonElement>) => {
      console.log(filters);
      const url = `http://localhost:8080/api/products/query?${filters.title ? `title=${filters.title}&` : ""}${filters.code ? `code=${filters.code}&` : ""}${filters.stock.minStock ? `minStock=${filters.stock.minStock}&` : ""}${filters.stock.maxStock ? `maxStock=${filters.stock.maxStock}&` : ""}${filters.price.minPrice ? `minPrice=${filters.price.minPrice}&` : ""}${filters.price.maxPrice ? `maxPrice=${filters.price.maxPrice}` : ""}`
      console.log(url)
        axios.get<IMongoProduct[]>(url, { withCredentials: true } ).then(response => {
          const filteredProducts = response.data;
          if(props.updateProducts){
            props.updateProducts(filteredProducts,undefined);
          }
        }).catch(error => {
          if(props.updateProducts){
            props.updateProducts([], error.response.data.message)
          }
        })
        
        
    }

    const [showFilters, setShowFilters] = useState(false);
    const filterDropdown = useRef<HTMLDivElement>(null);
    const filterBtn = useRef<HTMLButtonElement>(null);
    const filterDropdownClassName = showFilters ? 'filter-dropdown showMenu' : 'filter-dropdown';

    const handleFilterClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
      if(showFilters){
        setShowFilters(false);
      }else{
        setShowFilters(true)
      }
    }

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showOperationResult, setShowOperationResult] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [operationType, setOperationType] = useState('');
    const [saveCode, setCode] = useState('');

    const resultOperationStyle = operationType === 'failure' ? 'result-error' : 'result-success';

    const handleAddProduct = async (code: string) => {
      const result : CUDResponse = await (await axios.post<CUDResponse>(`http://localhost:8080/api/cart/add/${code}`)).data;
      setShowOperationResult(true);
      if(hasProductOrEmpty(result.data as IMongoProduct | [])){
          setOperationType('success');
          setResultMessage(result.message)
         socket.emit('cart')
      }else{
          setOperationType('failure');
          setResultMessage(result.message)
      }
    }

    const handleRemoveProduct = (code: string) => {
      setCode(code);
      setShowConfirmation(true);
    }

    const handleCancel = () => {
      setShowConfirmation(false);
    }

    const handleDelete = () => {
      /**
       * 
       * Here we check if we are showing the cart products or the products on the DB,
       * and based on that condition we are going to delete products from the cart or from the DB
       * 
       */
      const url = props.type === 'cart' ? `http://localhost:8080/api/cart/delete/${saveCode}` : `http://localhost:8080/api/products/delete/${saveCode}`
      axios.delete<CUDResponse>(url, { withCredentials: true }).then(response => {
        const data = response.data
        setShowOperationResult(true);
        setOperationType('success');
        setResultMessage(data.message);
        if(props.type === 'cart'){
          socket.emit('cart');
        }else{
          socket.emit('products')
        }
      }).catch(error => {
        setOperationType('failure');
        setResultMessage(error.response.data.message)
      })  
    }

    const handleAlertEnd = (ev: React.AnimationEvent<HTMLDivElement>) => {
      setShowOperationResult(false);
      setResultMessage('');
      setShowConfirmation(false);
    }

    useEffect(() => {
      document.addEventListener('click', (ev: MouseEvent) => {
        if(filterDropdown.current && filterBtn.current && ev.target){
            if(ev.target !== filterBtn.current && !filterDropdown.current.contains(ev.target as Node)){
              if(showFilters) setShowFilters(false)
            }
          }
      })
      
      

    })
    
    /**
     * 
     * This code is just in Random Products case.
     * 
     */
    const [generateRandom, setGenerateRandom] = useState('');
    
    const handleRandom = (ev: React.ChangeEvent<HTMLInputElement>) => {
      setGenerateRandom(ev.target.value);
    } 
    
    const handleRandomSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      socket.emit('randomProducts', generateRandom)
    }

    return (
        
        <>
        {showConfirmation && <div className="alert-container">
  <div className="alert">
    <div className="alert-header">
      <h3 className="alert-title">Warning!</h3>
      <button className="result-btn" onClick={handleCancel}><i className="fas fa-times"></i>
      </button>
    </div>
    <div className="alert-body">
      <span>Are you sure you want to delete the selected item?</span>
    </div>
    <div className="alert-bottom">
      <button className="alert-btn" onClick={handleCancel}>Cancel</button>
      <button className="alert-btn" onClick={handleDelete}>Delete</button>
    </div>
  </div>
  </div>
}
{
  showOperationResult && <div className="alert-container">
  <div className={resultOperationStyle} onAnimationEnd={handleAlertEnd}>
  <span className="result-message">{operationType === 'failure' ?  'A problem occured!' : 'Successfully!'}</span>
    <p className="result-code">{resultMessage}</p>
</div>
</div>
}
        <header>
      <div className="body-header">
        <h4>{props.type === 'cart' ? 'Cart' : 'Products'} List</h4>
        {props.type !== 'random' ? '' : <div className="random-generate">
  <form className='random-form' onSubmit={handleRandomSubmit}>
      <div className="random-row">
      <input className="label-styled-input" type="number" min="1" step="1" id="random-product" value={generateRandom} onChange={handleRandom}/>
    <label className={generateRandom  ? 'hasContent' : 'label-styled'} htmlFor="random-product">Amount of Random Products</label>
    <span className="form-border"/>
    
      </div>
      <button className="random-submit" type="submit">Generate</button>
  
  </form>
  </div>}
      </div>
    </header>
    <div className="upper-body">
      <h6>{`Showing ${props.products.length} results.`}</h6>
      <div className="filters">
        <button className="filter-btn" onClick={handleFilterClick} ref={filterBtn}>Filters</button>
        <div className={filterDropdownClassName} ref={filterDropdown}>

          <label htmlFor="title" className="filter-label">Title</label><br/>
          <input type="text" name="title" className="filter-input" onChange={handleFiltersChange} />
          <br/>
          <label htmlFor="code" className="filter-label">Code</label><br/>
          <input type="text" name="code" className="filter-input" onChange={handleFiltersChange} />
          <br />
          <label className=".filter-label">Price</label>
          <div className="price">
            <input type="number" min="0.1" step="0.05" name="minPrice" className="number-input" onChange={handleFiltersChange} placeholder="Min" />
            <input type="number" min="0.1" step="0.05" name="maxPrice" className="number-input" onChange={handleFiltersChange} placeholder="Max" />
          </div>
          <label className="filter-label">Stock</label>
          <div className="stock">
            <input type="number" min="0" name="minStock" className="number-input" onChange={handleFiltersChange} placeholder="Min" /><input type="number" min="0" name="maxStock" className="number-input" onChange={handleFiltersChange} placeholder="Max" />
          </div>
          <div className="apply">
      <button className="apply-filter" onClick={handleFilterApply}> Apply</button>
    </div>
        </div>
    </div>
  </div>
    <div className="products-body">
      {!props.noProducts ? props.products.map((product, idx) => {
          return (
            <div key={idx}>
            <div className="product">
              <img className='product-img' src={product.img}/>
              <div className="product-description">
                <span className="product-title">{product.title}</span>
                <span className="product-price">{product.price}</span>
              </div>
              <div className="add-remove-btns">
        {props.type !== 'cart' && <button className="add-remove-icon" onClick={(e) => handleAddProduct(product._id)}><img className='add-icon' src="https://cdn1.iconfinder.com/data/icons/user-interface-44/48/Add-512.png" alt="add-icon" /></button>}
<button className="add-remove-icon" onClick={(e) => handleRemoveProduct(props.type !== 'cart' ? product._id : product.product_id as string)}><img className='remove-icon' src="https://icons-for-free.com/iconfiles/png/512/cercle+close+delete+dismiss+remove+icon-1320196712448219692.png" alt="remove-icon" /></button>
        </div>
            </div><hr className="products-hr" />
            </div>
          )
      })
      : <div className="form-error">
      <div className="result-top">
        <span className="result-header">Oops!</span>
        <button className="result-btn"><i className="fas fa-times"></i></button>
      </div>
      <div className="result-message">
        <span>{props.noProductsMsg ? props.noProductsMsg : "There's no products stored..."}</span>
      </div>
    </div>}
    </div>
  </>
  )
}

