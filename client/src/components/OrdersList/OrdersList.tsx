import { useState } from "react";
import { IOrderPopulated } from "../../../../server/src/interfaces/orders";
import { formatAddress } from "../../utils/utilities";
import "./orderslist.css";

interface IOrdersListProps {
  orders: IOrderPopulated[];
}

export function OrdersList(props: IOrdersListProps) {
  const [shownDetail, setShownDetail] = useState(-1);

  const hideDetails = (idx: number) => {
    idx !== shownDetail ? setShownDetail(idx) : setShownDetail(-1);
  };

  return (
    <>
      {props.orders.map((order, idx) => {
        return (
          <li className="order">
            <header className="order-header">
              <span>
                Order ID:{" "}
                <span className="order-id">{order._id.toString()}</span>
              </span>
              <span className="order-list-total">${order.total}</span>
              <i
                className={`arrow-icon-container ${
                  shownDetail === idx ? "arrow-icon-container-rotated" : ""
                }`}
              >
                {" "}
                <img
                  className="dropdown-icon"
                  src="/icons/dropdown-arrow.png"
                  alt="dropdown icon container"
                  style={{ cursor: "pointer" }}
                  onClick={() => hideDetails(idx)}
                />
              </i>
            </header>
            <div
              className={`order-detail ${
                idx === shownDetail ? "" : "order-detail-hidden"
              }`}
            >
              <span style={{ display: "block", margin: ".5rem 0 0 .4rem" }}>
                Status:{` ${order.status}`} <br />
                Created at: {` ${order.createdAt}`}
              </span>
              <table className="order-detail-table">
                <tr>
                  <th>Product</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                  <th>Total Price</th>
                </tr>
                {order.products.map((product) => {
                  return (
                    <tr>
                      <td>{product.product_title}</td>
                      <td>{product.price}</td>
                      <td>{product.quantity}</td>
                      <td>
                        {Math.floor(product.quantity * product.price * 100) /
                          100}
                      </td>
                    </tr>
                  );
                })}
              </table>
              <span className="order-table-end" />
              <div className="order-table-total">
                <b>Total:</b>
                <span>{order.total}</span>
              </div>
              <div className="order-detail-address">
                <b className="order-detail-modify">Modify</b>
                <br />
                <b>Address selected:</b> {formatAddress(order.address)}
              </div>
              <footer className="order-detail-footer">
                <button className="order-btn">Cancel</button>
                <button className="order-btn">Help</button>
              </footer>
            </div>
          </li>
        );
      })}
    </>
  );
}
