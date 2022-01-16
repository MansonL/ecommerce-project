import axios, { AxiosResponse } from 'axios';
import React, { useContext, useState } from 'react';
import { IMongoProduct, IQuery } from '../../../server/src/common/interfaces/products';
import { UserContext } from './components/UserProvider';
import {defaultProductFromDB, ProductCUDResponse } from '../utils/interfaces';
import './products.css';
import { Modal } from './components/Modal/Modal';
import { OperationResult } from './components/Result/OperationResult';
import { ModalContainer } from './components/Modal/ModalContainer';
import { LoadingSpinner } from './components/Spinner/Spinner';

export interface IProductsProps {
  filterBtn: React.MutableRefObject<null>,
  showFilter: boolean;
  showFilterMenu: () => void;
}


export function Products(props: IProductsProps) {
  
  const [filters, setFilters] = useState<IQuery>({
      title: '',
      code: '',
      category: '',
      price: {
        minPrice: 0,
        maxPrice: 0,
      },
      stock: {
        minStock: 0,
        maxStock: 0,
      }
    })

    const filterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const [products, setProducts] = useState<IMongoProduct[]>([defaultProductFromDB])


    const AxiosThenCallback =  (response: AxiosResponse<ProductCUDResponse, any>) => {
      const data = response.data;
        setShowResult(true);
        setOperationResult(true);
        setResultMsg(data.message);
        setProducts(data.data)
        updateLoading();
        document.body.style.overflow = "scroll";
        setTimeout(async () => {
             setShowResult(false);
             setOperationResult(false);
             setResultMsg('');
        },2000)
    }
  
    const AxiosCatchCallback = (error: any) => {
      updateLoading();
          document.body.style.overflow = "scroll";
          console.log(JSON.stringify(error, null, '\t'));
          setShowResult(true);
          setOperationResult(false);
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
            setOperationResult(false);
            setShowResult(false);
            setResultMsg('')
          }, 3000)
    }



    const FilterApply = async (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      const url = `http://localhost:8080/api/products/query?${filters.title ? `title=${filters.title}&` : ""}${filters.code ? `code=${filters.code}&` : ""}${filters.stock.minStock ? `minStock=${filters.stock.minStock}&` : ""}${filters.stock.maxStock ? `maxStock=${filters.stock.maxStock}&` : ""}${filters.price.minPrice ? `minPrice=${filters.price.minPrice}&` : ""}${filters.price.maxPrice ? `maxPrice=${filters.price.maxPrice}` : ""}`
      updateLoading();
      document.body.style.overflow = "hidden";
      axios.get<IMongoProduct[]>(url).then(response => {
        const products = response.data;
        setProducts(products);
        updateLoading();
        document.body.style.overflow = "scroll";
      }).catch(AxiosCatchCallback)
      
        
    }

    const filterClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      props.showFilterMenu();
    }

    const filterDropdownClassName = props.showFilter ? 'filter-menu filter-menu-active' : 'filter-menu';

   

    const [showModal, setShowModal] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [operationResult, setOperationResult] = useState(false);
    const [resultMsg, setResultMsg] = useState('');
    const [savedCode, setCode] = useState('');

    const { user, loading, updateLoading, updateCart, token } = useContext(UserContext);
    const [adminView, setAdminView] = useState(false);

    const changeToAdmingView = () => {
      setAdminView(!adminView)
    }

    

    const handleAdd = async (code: string) => {
      updateLoading();
      document.body.style.overflow = "hidden";
      axios.delete<ProductCUDResponse>(`http://localhost:/api/cart/add/${savedCode}`, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
      .then(AxiosThenCallback)
      .catch(AxiosCatchCallback)
    }

    const removeProductAttempt = (code: string) => {
      setCode(code);
      setShowModal(true);
    }

    const handleCancel = () => {
      setShowModal(false);
    }

    const deleteProduct = () => {
      updateLoading();
      document.body.style.overflow = "hidden";  
      axios.delete<ProductCUDResponse>(`http://localhost:/api/cart/delete/${savedCode}`, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
      .then(AxiosThenCallback)
      .catch(AxiosCatchCallback)
    }


    return (
        <>
        {showResult && <OperationResult resultMessage={resultMsg} success={operationResult}/>}

        {showModal  && <Modal cancelClick={handleCancel} confirmClick={deleteProduct} msg='Are you sure you want to delete the product?'/>}

        { loading && <ModalContainer>
          <LoadingSpinner/>
        </ModalContainer> }

        <section className="body-container">
    <div className="products-filter-bar"><span className="total-results">Showing 20 results of 20.</span>
      <div className="filter-container">
      <button className="filter-btn" onClick={filterClick} ref={props.filterBtn}><img src="https://static.thenounproject.com/png/1701541-200.png" alt="" className="filter-icon"/></button>
        <div className={filterDropdownClassName}>
          <div className="filter-row">
            <label htmlFor="name" className="filter-label">Product name</label>
            <input type="text" name="title" value={filters.title} onChange={filterChange} className="filter-input"/>
          </div>
          <div className="filter-row">
            <label htmlFor="code" className="filter-label">Code</label>
            <input type="text" name="code" value={filters.code} onChange={filterChange} className="filter-input"/>
          </div>
          <div className="filter-row">
            <label htmlFor="category" className="filter-label">Category</label>
            <input type="text" name="category" value={filters.category} onChange={filterChange} className="filter-input"/>
          </div>
          <div className="filter-row">
            <label htmlFor="stock" className="filter-label">Stock</label>
            <div className="flex-filter">
            <input type="number" className="filter-input" value={filters.stock.minStock} onChange={filterChange} min="1" name="minStock"/>
              <input type="number" className="filter-input" value={filters.stock.maxStock} onChange={filterChange} min="1" name="maxStock"/>
            </div>
          </div>
          <div className="filter-row">
            <label htmlFor="price" className="filter-label">Price</label>
            <div className="flex-filter">
            <input type="number" className="filter-input" value={filters.price.minPrice} onChange={filterChange} name="minPrice" min="0.01" step="0.1"/>
              <input type="number" className="filter-input"  value={filters.price.maxPrice} onChange={filterChange} name="maxPrice"  min="0.01" step="0.1"/>
            </div>
          </div>
          <div className="filter-row" style={{textAlign: "center"}}>
            <button className="filter-submit-btn" onClick={FilterApply}>Apply</button>
          </div>
        </div>
   </div>
    </div>
    {user.isAdmin && <div className="see-as-admin" onClick={changeToAdmingView}>
    <span>See as an admin here</span>
  </div>}
    <ul className="products-results">
     {products.length > 0 ? 
      products.map((product, idx) => {
        return (
          <li className="product" id={String(idx)}>
          <img className="product-image" src={product.product.images[0].url} alt="" />
          <div className="product-info">
            <span className="product-title">{product.product.title}</span>
            <span className="product-price">{product.product.price}</span>
          </div>
          <div className="add-remove-container">
            {!user.isAdmin && <button className="add-remove-btn" onClick={() => handleAdd(String(product.product._id))}><img src="https://cdn-icons-png.flaticon.com/512/216/216685.png" alt="remove-icon" className="add-remove-icon"/></button>}
            {(user.isAdmin && adminView) && <button className="add-remove-btn" onClick={() => removeProductAttempt(String(product.product._id))}><img src="https://cdn3.iconfinder.com/data/icons/basic-flat-svg/512/svg01-512.png" alt="add-icon" className="add-remove-icon"/></button>}
         </div>
        </li>
        )
      }) :
      <OperationResult resultMessage="There are no products stored at DB." success={false}/>}
       
    </ul>
  </section>
  </>
  )
}

