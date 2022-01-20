import { UserContext } from './components/UserProvider'
import { Routes, Link, Route, BrowserRouter } from 'react-router-dom';
import { ProductsForm } from './ProductsForm';
import { Home } from './Home';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Cart } from './Cart';
import { LogIn } from './LogIn';
import { Chat } from './Chat';
import { Products } from './Products';
import { SignUp } from './SignUp';
import { AddressForm } from './AddressForm';
import { AddressesList } from './AddressList';
import { Order } from './Order';
import './main.css';



export function Main () {
  
  
  const dropdownBtn = useRef<HTMLButtonElement>(null);
  const filterBtn = useRef<HTMLButtonElement>(null);
  const sideMenu = useRef<HTMLDivElement>(null);
  const filterMenu = useRef<HTMLDivElement>(null)
  const [showFilter, setShowFilter] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false)

  const showFilterMenu = () => {
    setShowFilter(!showFilter)
  }


  const { loggedIn, user, cart } = useContext(UserContext)

  let cartAmount = 0;
  cart.products.forEach(product => cartAmount+=product.quantity);

  const clickEvent = (ev: MouseEvent) => {
    if(dropdownBtn && filterBtn && filterMenu && sideMenu && ev.target && ev.target instanceof Element){
        if(ev.currentTarget !== dropdownBtn.current && !sideMenu.current?.contains(ev.target) && showSideMenu)
          setShowSideMenu(false)
        else if(ev.currentTarget !== filterBtn.current && !filterMenu.current?.contains(ev.target) && showFilter)
          setShowFilter(false)
      }
    }
  useEffect(() => {
  document.addEventListener('click', clickEvent)
    return () => document.removeEventListener('click', clickEvent)
}, [showSideMenu, showFilter])
  
  const currentRoute = window.location.pathname === '/'

  const sideMenuHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setShowSideMenu(true)
  }

  return (
    
        <BrowserRouter>
        <div className={`main ${currentRoute ? "main-background" : ""}`}>
  <div className={`main-menu ${showSideMenu ? "main-menu-active" : ""}`} ref={sideMenu}>
    <div className="avatar-row">
      <img src={user.avatar ? user.avatar : "https://cdn4.iconfinder.com/data/icons/light-ui-icon-set-1/130/avatar_2-512.png"} alt="" className="avatar-img" />
      {!loggedIn ? <><span className="login-logout-avatar"><Link to="/login">Login</Link></span>
      <span className="login-logout-avatar"><Link to="/signup">SignUp</Link></span></> : <span className="login-logout-avatar" style={{flexGrow: "1", textAlign:"left"}}><Link to="/profile">Profile</Link></span>}
    </div>
    <div className="menu-rows">
      <div className="first-menu-row"><Link to="/">Home</Link></div>
      <div className="menu-row"><Link to="/products">Products</Link></div>
      {user.isAdmin && <div className="menu-row"><Link to ="/new-product">Products form</Link></div>}
      {loggedIn && <div className="menu-row"><Link to ="/chat">Chat</Link></div>}
      
    </div>
  </div>
  <div className="nav-bar">
      <button className="main-menu-btn" onClick={sideMenuHandler} ref={dropdownBtn}>
        <img src="https://www.pngkey.com/png/full/332-3321462_mobile-menu-for-barefoot-resort-vacations-hamburger-menu.png" alt="" className="navbar-icon" style={{width: "70%"}} />
      </button>
    <div className="main-products-search-container">
      <input type="text" className="products-search" placeholder="Search products now..." />
    </div>
    <div className="cart-icon-container">
      <Link to="/cart"><button className="cart-navbar-btn" style={{position:"relative"}}> <img className="navbar-icon" src="https://icon-library.com/images/white-shopping-bag-icon/white-shopping-bag-icon-4.jpg" alt="" />
        <span className="cart-counter">{cartAmount}</span>
      </button></Link>
    </div>
  </div>
  
    <Routes>
      
      <Route path="/" element={<Home/>} />
      <Route path="/products" element={<Products filterBtn={filterBtn} filterMenu={filterMenu} showFilterMenu={showFilterMenu} showFilter={showFilter}/>} />
      <Route path="/cart" element={<Cart/>} />
      <Route path="/new-product" element={<ProductsForm/>} />
      <Route path="/login" element={<LogIn/>}/>
      <Route path="/chat" element={ <Chat />} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/new-address" element={<AddressForm/>} />
      <Route path="/addresses" element={<AddressesList/>} />
      <Route path="/order" element={<Order/>} />
    </Routes>
    
</div>
</BrowserRouter>
    )
}

   
  