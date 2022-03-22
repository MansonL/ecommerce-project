import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../components/UserProvider";
import "./addressesList.css";

export function AddressesList() {
  const { cartConfirmated } = useContext(UserContext);
  const { user } = useContext(UserContext);
  const { selectedAddress, setSelectedAddress } = useContext(UserContext);

  const navigate = useNavigate();

  if (!cartConfirmated) navigate("../cart");
  if (!(user.addresses && user.addresses.length > 0))
    navigate("../new-address");

  const goToCreateAddress = () => {
    navigate("../new-address");
  };

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAddress(ev.target.value);
  };

  const addressConfirmation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (selectedAddress === "" && user.addresses)
      setSelectedAddress(user.addresses[0].alias);
    navigate("../order");
  };

  console.log(selectedAddress);

  return (
    <main className="body-container">
      <div className="header">
        <h3 className="header-title">Address</h3>
        <h5>
          Please, select the address where you want us to deliver your package:
        </h5>
      </div>
      <div
        className="create-new-address"
        style={{ width: "85%", margin: "auto", marginTop: "3rem" }}
        onClick={goToCreateAddress}
      >
        Create a new address
      </div>
      <ul className="addresses-list">
        {user.addresses?.map((address, idx) => {
          return (
            <li className="address" key={String(idx)}>
              <input
                type="radio"
                onChange={onChange}
                checked={selectedAddress === address.alias}
                id={address.alias}
                name="address"
                value={address.alias}
              />
              <label htmlFor={address.alias} className="address-label">
                <b>{address.alias}</b>
              </label>
              <div className="address-info">
                <span>{`${address.street1.name} ${address.street1.number},${
                  !address.street2
                    ? ""
                    : address.street3
                    ? ` ${address.street2} and ${address.street3}`
                    : ` ${address.street2}`
                }`}</span>
                {address.department && (
                  <span>{`Department: ${address.department}`}</span>
                )}
                {address.floor && <span>{`Floor: ${address.floor}`}</span>}
                <span>{`${address.city}, ${address.zipcode}`}</span>
                <span>{address.extra_info}</span>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="submit-row">
        <button className="submit-btn" onClick={addressConfirmation}>
          Confirm address
        </button>
      </div>
    </main>
  );
}
