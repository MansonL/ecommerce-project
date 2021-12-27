import axios from "axios";
import { useEffect, useState } from "react";
import { IMongoCartProduct, IMongoProduct } from "../utils/interfaces" ;
import { socket } from "../lib/socket";
import { Products } from "./Products";
import React from "react";

export function DBProducts () {
    const [products, setProducts] = useState<IMongoProduct[]>([]);
    const [noProducts, setNoProducts] = useState(true);
    const [noProductsMsg, setNoProductsMsg] = useState(''); 

    const updateProducts = (newProducts: IMongoProduct[] | IMongoCartProduct[] | [], msg: string | undefined) => {
      setProducts(newProducts);
      if(newProducts.length > 0 && noProducts){
        setNoProducts(false);
      }else if(msg){
        setNoProducts(true);
        setNoProductsMsg(msg)
      }
    }

    const updateListener = async () => {
      axios.get<IMongoProduct[]>('http://localhost:8080/api/products/list').then(response => {
            console.log(`Cart Products received`);
            const newProducts = response.data
            setProducts(newProducts);
            setNoProducts(false)
          }).catch(error => {
            setNoProducts(true);
          })
      }

    useEffect(() => {
      socket.emit('products');
      socket.on('productsUpdate', updateListener);
      return () => {socket.off('productsUpdate', updateListener)}
    }, [])

      return (
        <React.Fragment>
        <Products updateProducts={updateProducts} products={products} noProductsMsg={noProductsMsg}type="normal" noProducts={noProducts}/>
        </React.Fragment>
    )
}


