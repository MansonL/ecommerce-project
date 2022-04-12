import { verify } from 'jsonwebtoken';
import { IMongoPopulatedMessages } from '../../../server/src/interfaces/messages';
import { IMongoCart } from '../../../server/src/interfaces/products';
import { UserAddresses, UserInfo } from '../../../server/src/interfaces/users';
import { IUser } from './interfaces';

declare module 'jsonwebtoken' {
    export interface JwtPayload {
        user: IUser & {
            user_cart: IMongoCart;
        };
    }
}

export const verifyToken = async (token: string) => {
    const userData = await verify(token, 'secret');
    return userData;
};

export const cleanEmptyProperties: (user: UserInfo) => UserInfo = (user: UserInfo) => {
    if (user.avatar === '') delete user.avatar;
    if (user.addresses && user.addresses[0].street1.name !== '') delete user.addresses;
    return user;
};

export const formatAddress = (address: UserAddresses): string => {
    return `${address.street1.name} ${address.street1.number},${
        address.department && address.floor ? ` ${address.department} ${address.floor}, ` : ' '
    }${address.city} ${address.zipcode}`;
};
