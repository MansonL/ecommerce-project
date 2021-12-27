import { CUDResponse, IMongoCartProduct, IMongoMessage, IMongoProduct, IMongoUser, InternalError } from "./interfaces"


/* This implementation is for when we request an array of data 
 from the db and need to check if there was an error or everything 
 gone well.
*/

export const isCartProduct = (data: any): data is IMongoCartProduct  => {
   return data.length ? 'product_id' in data[0] : 'product_id' in data                                 
}

export const isProduct = (data: any): data is IMongoProduct => {
    return data.length ? '_id' in data[0] : '_id' in data  
}

export const isUser = (data: any): data is IMongoUser => {
    return data.length ? 'username' in data[0] : 'username' in data 
}

export const isMessages = (data: any): data is IMongoMessage => {
    return data.length ? 'author' in data[0] : 'author' in data 
}

export const isCUDResponse = (data: any): data is CUDResponse => {
    return 'data' in data
}