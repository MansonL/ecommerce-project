import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';


export function Home () {
    
    const navigate = useNavigate();

    return(
        <React.Fragment>
       <section className="body-container home-background">
<div className="welcome-text">
    <p className="first-text">Welcome to my first</p>
    <p className="second-text">Ecommerce Project </p>
  </div>
   <button className="welcome-products-btn" onClick={() => navigate('../products')}>Start looking</button>
</section>
    </React.Fragment>
    )
}