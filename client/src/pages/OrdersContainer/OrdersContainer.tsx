import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IMongoOrderPopulated,
  IOrderPopulated,
} from "../../../../server/src/interfaces/orders";
import { OrdersList } from "../../components/OrdersList/OrdersList";
import { OperationResult } from "../../components/Result/OperationResult";
import { ModalContainer } from "../../components/Modal/ModalContainer";
import { LoadingSpinner } from "../../components/Spinner/Spinner";
import { UserContext } from "../../components/UserProvider";
import { UsersList } from "../../components/UsersLIst/UsersList";
import { IUser } from "../../utils/interfaces";
import "./orderscontainer.css";

export function OrdersContainer() {
  const { loggedIn, token, user, loading, setLoading } =
    useContext(UserContext);

  const [operationResult, setOperationResult] = useState(
    "error" || "success" || "warning"
  );

  const [showResult, setShowResult] = useState(false);

  const [resultMessage, setResultMessage] = useState("");

  const [orders, setOrders] = useState<IOrderPopulated[]>([]);

  const [email, setEmail] = useState("");

  const [users, setUsers] = useState<IUser[]>([]);

  const [selectedUser, setSelectedUser] = useState("");

  const [showOrdersToAdmin, setShowOrdersToAdmin] = useState(false);

  const navigate = useNavigate();

  const thenAxiosCallbackOrders = (
    response: AxiosResponse<IOrderPopulated[], any>
  ) => {
    setLoading(false);
    document.body.style.overflow = "scroll";
    const data = response.data;
    setOrders(data);
  };

  const thenAxiosCallbackUsers = (response: AxiosResponse<IUser[], any>) => {
    setLoading(false);
    document.body.style.overflow = "scroll";
    const data = response.data;
    setUsers(data);
  };

  const fetchOrders = async (user_id?: string, username?: string) => {
    if (user_id && username) {
      setSelectedUser(username);
      setLoading(true);
      document.body.style.overflow = "hidden";
      axios
        .get(
          `http://localhost:8080/api/orders/admin-view/list?user_id=${user_id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(thenAxiosCallbackOrders)
        .catch(() => {
          setLoading(false);
          document.body.style.overflow = "scroll";
        });
    } else {
      setLoading(true);
      document.body.style.overflow = "hidden";
      axios
        .get(`http://localhost:8080/api/orders/list`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(thenAxiosCallbackOrders)
        .catch((error) => {
          setLoading(false);
          document.body.style.overflow = "scroll";
          setShowResult(true);
          setOperationResult("error");
          setResultMessage(error.response.data.message);
        });
    }
  };

  const handleEmailChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(ev.target.value);
  };

  const handleUserSearch = () => {
    setShowOrdersToAdmin(false);
    setLoading(true);
    document.body.style.overflow = "hidden";
    axios
      .get(`http://localhost:8080/api/users/list/${email}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(thenAxiosCallbackUsers)
      .catch((error) => {
        setLoading(false);
        document.body.style.overflow = "scroll";
        setShowResult(true);
        setOperationResult("error");
        setResultMessage(error.response.data.message);
      });
  };

  const handleUserCardClick = (user_id: string, username: string) => {
    setShowOrdersToAdmin(true);
    fetchOrders(user_id, username);
  };

  useEffect(() => {
    if (!user.isAdmin) fetchOrders();
    if (!loggedIn) {
      setOperationResult("error");
      setShowResult(true);
      setResultMessage("You need to be logged in.");
      setTimeout(() => {
        navigate("../login");
      }, 1500);
    }
  }, [loggedIn]);

  return (
    <>
      {loading && (
        <ModalContainer>
          <LoadingSpinner />
        </ModalContainer>
      )}
      <div className="body-container">
        {showResult ? (
          <OperationResult
            result={operationResult}
            resultMessage={resultMessage}
          />
        ) : (
          <>
            <header className="header">
              <h2 className="header-title">Orders</h2>
              <h5>
                {user.isAdmin
                  ? `Search for the user you want to look his address with his email.`
                  : "Here are all of your orders."}
              </h5>
            </header>
            <div className="main-content">
              {user.isAdmin && (
                <>
                  <div className="input-field">
                    <input
                      type="email"
                      className="styled-input"
                      value={email}
                      onChange={handleEmailChange}
                    />
                    <label
                      htmlFor="email"
                      className={
                        email !== "" ? "filled-input-label" : "animated-label"
                      }
                    >
                      User email
                    </label>
                    <span className="input-border" />
                  </div>
                  <div className="submit-row">
                    <button className="submit-btn" onClick={handleUserSearch}>
                      Search
                    </button>
                  </div>
                </>
              )}
              {user.isAdmin && showOrdersToAdmin && orders.length > 0 ? (
                <>
                  <span className="selected-user">{selectedUser} <b>selected</b>.</span>
                  <OrdersList orders={orders} />
                </>
              ) : user.isAdmin && showOrdersToAdmin ? (
                <OperationResult
                  result={"warning"}
                  resultMessage="The selected user has no orders created."
                />
              ) : user.isAdmin && !showOrdersToAdmin && users.length > 0 ? (
                <UsersList
                  users={users}
                  handleUserCardClick={handleUserCardClick}
                />
              ) : user.isAdmin && !showOrdersToAdmin ? (
                <OperationResult
                  result="warning"
                  resultMessage="There are no customer users created."
                />
              ) : !user.isAdmin && orders.length > 0 ? (
                <OrdersList orders={orders} />
              ) : (
                <OperationResult
                  result={"warning"}
                  resultMessage={"You have no orders created."}
                />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
