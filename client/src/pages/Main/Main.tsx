import { UserContext } from "../../components/UserProvider";
import { Routes, Link, Route, BrowserRouter } from "react-router-dom";
import { ProductsForm } from "../ProductsForm/ProductsForm";
import { Home } from "../Home/Home";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Cart } from "../Cart/Cart";
import { LogIn } from "../Login/LogIn";
import { ProductsList } from "../ProductsList/ProductsList";
import { SignUp } from "../Signup/SignUp";
import { AddressForm } from "../AddressForm/AddressForm";
import { AddressesList } from "../AddressesList/AddressesList";
import { CreateOrder } from "../CreateOrder/CreateOrder";
import "./main.css";
import { OrdersContainer } from "../OrdersContainer/OrdersContainer";
import { ChatContainer } from "../ChatContainer/ChatCointainer";

export function Main() {
  const dropdownBtn = useRef<HTMLButtonElement>(null);
  const filterBtn = useRef<HTMLButtonElement>(null);
  const sideMenu = useRef<HTMLDivElement>(null);
  const filterMenu = useRef<HTMLDivElement>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  const showFilterMenu = () => {
    setShowFilter(!showFilter);
  };

  const { loggedIn, user, cart, updateLoginStatus } = useContext(UserContext);

  let cartAmount = 0;
  cart.products.forEach((product) => (cartAmount += product.quantity));

  const clickEvent = (ev: MouseEvent) => {
    if (
      dropdownBtn &&
      filterBtn &&
      filterMenu &&
      sideMenu &&
      ev.target &&
      ev.target instanceof Element
    ) {
      if (
        ev.currentTarget !== dropdownBtn.current &&
        !sideMenu.current?.contains(ev.target) &&
        showSideMenu
      )
        setShowSideMenu(false);
      else if (
        ev.currentTarget !== filterBtn.current &&
        !filterMenu.current?.contains(ev.target) &&
        showFilter
      )
        setShowFilter(false);
    }
  };

  const sideMenuHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowSideMenu(true);
  };

  const handleLogout = () => updateLoginStatus(undefined);

  useEffect(() => {
    document.addEventListener("click", clickEvent);
    return () => document.removeEventListener("click", clickEvent);
  }, [showSideMenu, showFilter, cart]);

  return (
    <BrowserRouter>
      <div className="container">
        <nav
          className={`main-menu ${showSideMenu ? "main-menu-active" : ""}`}
          ref={sideMenu}
        >
          <ul className="avatar-row">
            <img
              src={user.avatar ? user.avatar : "/icons/avatar.png"}
              alt=""
              className="avatar-img"
            />
            {!loggedIn ? (
              <>
                <li className="login-logout-avatar">
                  <Link to="/login">Login</Link>
                </li>
                <li className="login-logout-avatar">
                  <Link to="/signup">SignUp</Link>
                </li>
              </>
            ) : (
              <>
                <li className="login-logout-avatar">
                  <Link to="/profile">{user.name}</Link>
                </li>
                <li className="login-logout-avatar" onClick={handleLogout}>
                  <Link to="/login">Logout</Link>
                </li>
              </>
            )}
          </ul>
          <ul className="menu-rows">
            <li className="first-menu-row">
              <Link to="/">Home</Link>
            </li>
            <li className="menu-row">
              <Link to="/products">Products</Link>
            </li>
            {user.isAdmin && (
              <li className="menu-row">
                <Link to="/new-product">Products form</Link>
              </li>
            )}
            {loggedIn && (
              <li className="menu-row">
                <Link to="/chat">Chat</Link>
              </li>
            )}
            {loggedIn && (
              <li className="menu-row">
                <Link to="/orders">Orders</Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="nav-bar">
          <button
            className="main-menu-btn"
            onClick={sideMenuHandler}
            ref={dropdownBtn}
          >
            <img
              src="/icons/hamburguer-menu.png"
              alt=""
              className="navbar-icon"
              style={{ width: "70%" }}
            />
          </button>
          <div className="main-products-search-container">
            <input
              type="text"
              className="products-search"
              placeholder="Search products now..."
            />
          </div>
          <div className="cart-icon-container">
            <Link to="/cart">
              <button
                className="cart-navbar-btn"
                style={{ position: "relative" }}
              >
                {" "}
                <img
                  className="navbar-icon"
                  src="/icons/white-shopping-bag.jpg"
                  alt=""
                />
                <span className="cart-counter">{cartAmount}</span>
              </button>
            </Link>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/products"
            element={
              <ProductsList
                filterBtn={filterBtn}
                filterMenu={filterMenu}
                showFilterMenu={showFilterMenu}
                showFilter={showFilter}
              />
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/new-product" element={<ProductsForm />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/chat" element={<ChatContainer />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/new-address" element={<AddressForm />} />
          <Route path="/addresses" element={<AddressesList />} />
          <Route path="/order" element={<CreateOrder />} />
          <Route path="/orders" element={<OrdersContainer />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
