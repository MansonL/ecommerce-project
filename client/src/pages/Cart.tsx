import axios from "axios";
import { useEffect, useState } from "react";
import { socket } from "../lib/socket";
import { Products } from "./Products";
import React from "react";
import { cartGetResponse } from "../utils/interfaces";

export function Cart () {
    const [products, setProducts] = useState<IMongoCartProduct[]>([]);
    const [noProducts, setNoProducts] = useState(true);
    const [noProductsMsg, setNoProductsMsg] = useState(''); 

    const updateProducts = (newProducts: IMongoProduct[] | IMongoCartProduct[] | [], msg: string | undefined) => {
      setProducts(newProducts as IMongoCartProduct[]);
      if(newProducts.length > 0 && noProducts){
        setNoProducts(false);
      } /*else if(msg){
        setNoProducts(true); If we need to filter products inside the cart, we'll implement these lines
        setNoProductsMsg(msg)
      }*/else{
        setNoProducts(true);
      }
    }

      const updateListener = () => {
          axios.get<cartGetResponse>('http://localhost:8080/api/cart/list')
          .then(response => {
            const newProducts = response.data.data;
            setProducts(newProducts);
            setNoProducts(false)
          }).catch(error => {
            setNoProducts(true);
          })
        }

        useEffect(() => {
          socket.emit('cart');
          socket.on('cartUpdate', updateListener);
          return () => { socket.off('cartUpdate', updateListener) }
        }, [])
        

    return (
      <React.Fragment>
        <Products updateProducts={updateProducts} products={products} noProductsMsg={undefined} type="cart" noProducts={noProducts}/>
        </React.Fragment>
    )
}