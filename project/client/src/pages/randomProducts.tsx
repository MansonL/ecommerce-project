import axios from "axios";
import { useEffect, useState } from "react";
import { IMongoCartProduct, IMongoProduct } from "../utils/interfaces";
import { socket } from "../lib/socket";
import { Products } from "./Products";
import React from "react";

export function RandomProducts () {
    const [products, setProducts] = useState<IMongoProduct[] | IMongoCartProduct[]>([]);
    const [noProducts, setNoProducts] = useState(false);

    const updateListener = (qty: string) => {
            if(qty !== ''){
                axios.get<IMongoProduct[]>('http://localhost:8080/api/products/test-view', {params: {qty: qty}}).then(response => {
                    const newProducts = response.data;
                    console.log(`Products received`);
                    setProducts(newProducts)
                    setNoProducts(false); 
                }).catch(error => {
                    setNoProducts(true);
                })
                 
            }else{
                axios.get<IMongoProduct[]>('http://localhost:8080/api/products/test-view').then(response => {
                    const newProducts = response.data;
                    console.log(`Products received`);
                    setProducts(newProducts)
                    setNoProducts(false);
                }).catch(error => {
                    setNoProducts(true);
                })   
            }
        }

    useEffect(() => {
        socket.emit('randomProducts');
        socket.on('randomProductsUpdate', updateListener);
        return () => { socket.off('randomProductsUpdate', updateListener) }
    }, [])

    return (
        <React.Fragment>
        <Products updateProducts={undefined} products={products} noProductsMsg={undefined} type="random" noProducts={noProducts}/>
        </React.Fragment>
    )
}