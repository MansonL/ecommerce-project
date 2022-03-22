import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

export function Home() {
  const navigate = useNavigate();

  console.log(
    `width: ${window.window.outerWidth}. height: ${window.window.outerHeight}`
  );

  return (
    <React.Fragment>
      <main className="body-container home-background">
        <div className="welcome-text">
          <p className="first-text">Welcome to my first</p>
          <p className="second-text">Ecommerce Project </p>
        </div>
        <button
          className="welcome-products-btn"
          onClick={() => navigate("../products")}
        >
          Start looking
        </button>
      </main>
    </React.Fragment>
  );
}
