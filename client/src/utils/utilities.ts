import {  verify } from "jsonwebtoken"
import { INew_User, UserAddresses } from "../../../server/src/common/interfaces/users";
import { IUserInfo } from "./interfaces";

declare module "jsonwebtoken" {
    export interface JwtPayload {
        user:  {
            username: string;
            password: string;
            repeatedPassword: string;
            name: string;
            surname: string;
            age: string;
            avatar?: string | undefined;
            phoneNumber: string;
            facebookID?: string | undefined;
            addresses?: UserAddresses[] | undefined;
            isAdmin: boolean;
            user_id: string;
        };
    }
}

export const verifyToken = async (token: string) => {
    const userData = await verify(token, 'secret').user;
    return userData
}

export const cleanEmptyProperties : (user: INew_User) => INew_User = (user: INew_User) => {
    if(user.data.avatar === '') delete user.data.avatar;
    if(user.data.addresses && user.data.addresses[0].street1.name !== '') delete user.data.addresses;
    return user
}