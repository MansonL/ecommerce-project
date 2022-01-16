import {  verify } from "jsonwebtoken"
import { IMongoPopulatedMessages } from "../../../server/src/common/interfaces/messages";
import { UserInfo, UserAddresses } from "../../../server/src/common/interfaces/users";
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

export const cleanEmptyProperties : (user: UserInfo) => UserInfo = (user: UserInfo) => {
    if(user.avatar === '') delete user.avatar;
    if(user.addresses && user.addresses[0].street1.name !== '') delete user.addresses;
    return user
}

export const takeChats = (user_id: string, messages: IMongoPopulatedMessages[]) => {
    const receivedMessages : {
        [index: string]: IMongoPopulatedMessages[];
    } = {};
    const sentMessages: {
        [index: string]: IMongoPopulatedMessages[];
    } = {};
    messages.forEach(message => {
        if(message.from._id){
            if(receivedMessages[message.from._id])
                receivedMessages[message.from._id].push(message);
            else
                receivedMessages[message.from._id] = [message];
            
        }else{
            if(sentMessages[message.to._id])
                sentMessages[message.to._id].push(message);
            else
                sentMessages[message.to._id] = [message];
        }
    });
    return {receivedMessages, sentMessages}
}