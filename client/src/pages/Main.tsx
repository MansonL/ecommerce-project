import { UserContext, UserProvider } from './components/UserProvider'
import { Routes, Link, Route, BrowserRouter } from 'react-router-dom';
import { ProductsForm } from './ProductsForm';
import { Home } from './Home';
import './main.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Cart } from './Cart';
import { LogIn } from './LogIn';
import { Chat } from './Chat';
import { Products } from './Products';
import { SignUp } from './SignUp';
import { AddressForm } from './AddressForm';
import { AddressesList } from './AddressList';
import { Order } from './Order';




export function Main () {
  
  
  const dropdownBtn = useRef(null);
  const filterBtn = useRef(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showMenu, setShowMenu] = useState(false)

  const showFilterMenu = () => {
    setShowMenu(!showMenu)
  }


  const { loggedIn, user, cart } = useContext(UserContext)

  let cartAmount = 0;
  cart.products.forEach(product => cartAmount+=product.quantity);

  const clickEvent = (ev: MouseEvent) => {
    if(dropdownBtn && filterBtn && ev.target){
        if(ev.currentTarget !== dropdownBtn.current){
          console.log(ev.target);
          console.log(dropdownBtn.current)
          if(showMenu) setShowMenu(false)
        }else if(ev.currentTarget !== filterBtn.current){
          if(showFilter) setShowFilter(false);
        }
      }
    }
  useEffect(() => {
  document.addEventListener('click', clickEvent)
    return () => document.removeEventListener('click', clickEvent)
}, [showMenu, showFilter])
  
  
  const menuBtnHandleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setShowMenu(true)
  }

  return (
    <UserProvider>
        <BrowserRouter>
        <div className="main">
  <div className={`main-menu ${showMenu ? "main-menu-active" : ""}`}>
    <div className="avatar-row">
      <img src={user.avatar ? user.avatar : "https://cdn4.iconfinder.com/data/icons/light-ui-icon-set-1/130/avatar_2-512.png"} alt="" className="avatar-img" />
      <span className="login-logout-avatar"><Link to={loggedIn ? "/profile" : "/login"}>{loggedIn ? "Profile" : "Login/Signup"}</Link></span>
    </div>
    <div className="menu-rows">
      <div className="first-menu-row"><Link to="/">Home</Link></div>
      <div className="menu-row"><Link to="/products">Products</Link></div>
      {loggedIn && <div className="menu-row"><Link to ="/chat">Chat</Link></div>}
      {user.isAdmin && <div className="menu-row"><Link to ="/new-product">Products form</Link></div>}
    </div>
  </div>
  <div className="nav-bar">
    <div className="dropdown-menu-container" onClick={menuBtnHandleClick} ref={dropdownBtn}>
      <button className="main-menu-btn">
        <img src="https://www.pngkey.com/png/full/332-3321462_mobile-menu-for-barefoot-resort-vacations-hamburger-menu.png" alt="" className="navbar-icon" style={{width: "70%"}} />
      </button>
    </div>
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
      <Route path="/products" element={<Products filterBtn={filterBtn} showFilterMenu={showFilterMenu} showFilter={showFilter}/>} />
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
</UserProvider>
    )
}

   
  