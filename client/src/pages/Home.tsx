import React from 'react';
import './home.css';


export function Home () {
    return(
        <React.Fragment>
       <section className="body-container">
<div className="welcome-text">
    <p className="first-text">Welcome to my first</p>
    <p className="second-text">Ecommerce Project </p>
  </div>
   <button className="welcome-products-btn">Start looking</button>
</section>
    </React.Fragment>
    )
}