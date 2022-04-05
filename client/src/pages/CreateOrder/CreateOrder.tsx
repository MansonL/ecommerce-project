import axios, { AxiosResponse } from "axios";
import { Types } from "mongoose";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAddresses } from "../../../../server/src/interfaces/users";
import { orderResponse } from "../../utils/interfaces";
import { ModalContainer } from "../../components/Modal/ModalContainer";
import { OperationResult } from "../../components/Result/OperationResult";
import { LoadingSpinner } from "../../components/Spinner/Spinner";
import { UserContext } from "../../components/UserProvider";
import "./createorder.css";
import { formatAddress } from "../../utils/utilities";

export function CreateOrder() {
  const [showResult, setShowResult] = useState(false);
  const [orderResult, setOrderResult] = useState("error" || "success");
  const [resultMsg, setResultMsg] = useState("");

  const { cart } = useContext(UserContext);
  const { user, token } = useContext(UserContext);
  const { loading, setLoading } = useContext(UserContext);
  const { selectedAddress } = useContext(UserContext);

  const navigate = useNavigate();

  const modifyAddress = () => {
    navigate("../addresses");
  };

  const modifyCart = () => {
    navigate("../cart");
  };

  let totalOrder = 0;

  cart.products.forEach((product) => {
    totalOrder += product.quantity * product.product.price;
  });

  totalOrder = Math.floor(totalOrder * 100) / 100;

  const fullAddress = (user.addresses as UserAddresses[]).filter(
    (address) => address.alias === selectedAddress
  )[0];

  const formattedAddress = formatAddress(fullAddress);

  const AxiosThenCallback = (response: AxiosResponse<orderResponse, any>) => {
    const data = response.data;
    setShowResult(true);
    setOrderResult("success");
    setResultMsg(data.message);
    setLoading(false);
    document.body.style.overflow = "scroll";
    setTimeout(async () => {
      setShowResult(false);
      setOrderResult("error");
      setResultMsg("");
    }, 2000);
  };

  const AxiosCatchCallback = (error: any) => {
    setLoading(false);
    document.body.style.overflow = "scroll";
    console.log(JSON.stringify(error.response, null, 2));
    setShowResult(true);
    setOrderResult("error");
    if (error.response) {
      if (error.response.status === 500) {
        setResultMsg(error.response.data.message.message);
      } else {
        setResultMsg(error.response.data.message.message);
      }
    } else if (error.request) {
      setResultMsg(`No response received from server.`);
    } else {
      setResultMsg(`Request error.`);
    }
    setTimeout(() => {
      setShowResult(false);
      setResultMsg("");
    }, 3000);
  };

  const confirmOrder = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const data = {
      products: cart.products.map((product) => {
        return {
          product_id: product.product._id,
          product_title: product.product.title,
          quantity: product.quantity,
          price: product.product.price,
        };
      }),
      total: totalOrder,
      address: new Types.ObjectId(fullAddress._id),
    };
    setLoading(true);
    document.body.style.overflow = "hidden";
    axios
      .post<orderResponse>("http://localhost:8080/api/orders/create", data, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(AxiosThenCallback)
      .catch(AxiosCatchCallback);
  };

  
  const closeMsg = () => setShowResult(false)

  return (
    <main className="body-container">
      <div className="header">
        <h2 className="header-title">Order Confirmation</h2>
        <h5>
          Here's the resume of your order, please check the details before
          confirming it...
        </h5>
      </div>
      {loading && (
        <ModalContainer>
          <LoadingSpinner />
        </ModalContainer>
      )}
      {showResult && (
        <OperationResult
          closeMsg={closeMsg}
          result={orderResult}
          resultMessage={resultMsg}
        />
      )}
      <div className="order-container">
        <div>
          <span>Products:</span>{" "}
          <span
            style={{ float: "right", fontSize: "0.8rem", cursor: "pointer" }}
            onClick={modifyCart}
          >
            Modify
          </span>
          <div className="order-products-container">
            <ul className="products">
              {cart.products.map((product, idx) => {
                return (
                  <li className="cart-product" key={String(idx)}>
                    <img
                      src={product.product.images[0].url}
                      alt=""
                      className="product-image"
                    />
                    <div className="product-info">
                      <span className="product-title">
                        {product.product.title}
                      </span>
                      <span className="order-product-price">
                        {product.product.price}{" "}
                        <span className="order-product-qty">
                          x {product.quantity}
                        </span>
                      </span>
                    </div>
                    <div style={{ textAlign: "center", maxWidth: "25%" }}>
                      <span className="product-subtotal-text">Subtotal:</span>
                      <br />
                      <span className="product-subtotal-value">
                        {product.quantity * product.product.price}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="order-total">
              <span>Total</span>
              <br />
              <span style={{ fontSize: "1.5rem" }}>{totalOrder}</span>
            </div>
          </div>
        </div>
        <div className="order-address">
          <span>
            The <b>address</b> you selected:
          </span>
          <span
            style={{ fontSize: "0.8rem", float: "right", cursor: "pointer" }}
            onClick={modifyAddress}
          >
            Modify
          </span>
          <br />
          <span>{formattedAddress}</span>
        </div>
        <div
          className="submit-row"
          style={{ marginBottom: "1rem", textAlign: "center" }}
        >
          <button className="submit-btn" onClick={confirmOrder}>
            Confirm order
          </button>
        </div>
      </div>
    </main>
  );
}
