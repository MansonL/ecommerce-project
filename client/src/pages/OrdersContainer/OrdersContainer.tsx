import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import {
  IOrderPopulated,
} from "../../../../server/src/interfaces/orders";
import { OrdersList } from "../../components/OrdersList/OrdersList";
import { OperationResult } from "../../components/Result/OperationResult";
import { UserContext } from "../../components/UserProvider";
import "./orderscontainer.css";

export function OrdersContainer() {
 
  const { loggedIn, token, user } = useContext(UserContext);
  
  const [operationResult, setOperationResult] = useState(false);

  const [showResult, setShowResult] = useState(false);

  const [resultMessage, setResultMessage] = useState("");

  const [orders, setOrders] = useState<IOrderPopulated[]>([]);

  const thenAxiosCallback = (
    response: AxiosResponse<IOrderPopulated[], any>
  ) => {
    console.log(response);
    const data = response.data;
    setOrders(data);
  };

  const fetchOrders = async () => {
    axios
      .get("http://localhost:8080/api/orders/list", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(thenAxiosCallback)
      .catch((error) => {
        console.log(error);
        setShowResult(true);
        setOperationResult(false);
        setResultMessage(error.response.data.message);
      });
  };

  useEffect(() => {
    if(!user.isAdmin) fetchOrders();
  }, [loggedIn]);

  return (
    <div className="body-container">
      <header className="header">
        <h2 className="header-title">Orders</h2>
        <h5>Here are all of your orders.</h5>
      </header>
      <ul className="orders-list">
        {orders?.length > 0 && !showResult ? (
          <OrdersList orders={orders} />
        ) : (
          <OperationResult
            success={operationResult}
            resultMessage={
              resultMessage !== "" ? resultMessage : "No orders created."
            }
          />
        )}
      </ul>
    </div>
  );
}
