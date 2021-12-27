import { UserContext, UserProvider } from './components/UserProvider'
import { Routes, Link, Route, Router, BrowserRouter } from 'react-router-dom';
import { Messages } from './Messages';
import { ProductsForm } from './ProductsForm';
import { Home } from './Home';
import './main.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { RandomProducts } from './randomProducts';
import { DBProducts } from './DBProducts';
import { Cart } from './Cart';
import { LogIn } from './LogIn';
import { SignUp } from './SignUp';
import { IMongoUser } from '../utils/interfaces';
import { Profile } from './Profile';


export interface authResponse {
    message: string;
    data: IMongoUser 
}

export function Main () {
  const dropdownMenu = useRef(null);
  const dropdownBtn = useRef(null);
  const [showMenu, setShowMenu] = useState(false)

  const { loggedIn } = useContext(UserContext)

  useEffect(() => {
    document.addEventListener('click', (ev: MouseEvent) => {
      if(dropdownMenu && dropdownBtn && ev.target){
          if(ev.target !== dropdownBtn.current && ev.target !== dropdownMenu.current){
            if(showMenu) setShowMenu(false)
          }
        }
    })
  })
  
  
  const menuBtnHandleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setShowMenu(true)
  }

  const menuClass = `products-dropdown ${showMenu ? 'showMenu' : ''}`;
  return (
    <UserProvider>
        <BrowserRouter>
        <div className="container">
          
  <div className="top-bar">
  <div className="products-menu"><button className="top-buttons" ref={dropdownBtn} id="product-menu-button" onClick={menuBtnHandleClick}>Products</button>
      <div className={menuClass} ref={dropdownMenu}><Link to="/randomProducts"><button className="top-buttons">Random Generated</button></Link>
        <hr className="hr-menu"/><Link to="/form" ><button className="top-buttons">Form</button></Link>
        <hr className="hr-menu"/><Link to="/DBProducts"><button className="top-buttons">DB Products</button></Link>
        <hr className="hr-menu"/><Link to="/cart"><button className="top-buttons">DB Cart</button></Link>
      </div>
    </div>
    <Link to="/messages"><button className="top-buttons">Messages</button></Link>
    <Link to="/login"><button className="top-buttons">{loggedIn ? "Log out" : "Log In"}</button></Link>
  </div><hr/>
  <div className="content-body">
  
    <Routes>
      
    <Route path="/" element={<Home/>} />
      <Route path="/messages" element={<Messages/>}/>
      <Route path="/randomProducts" element={<RandomProducts/>} />
      <Route path="/DBProducts" element={<DBProducts/>} />
      <Route path="/cart" element={<Cart/>} />
      <Route path="/form" element={<ProductsForm/>} />
      <Route path="/login" element={<LogIn/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/profile" element={ <Profile />} />
    
    </Routes>
    
</div>
</div>
</BrowserRouter>
</UserProvider>
    )
}