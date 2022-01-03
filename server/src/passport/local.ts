import { Request } from "express";
import passportLocal, { IStrategyOptionsWithRequest, VerifyFunctionWithRequest } from "passport-local";
import { doneFunction } from ".";
import { usersApi } from "../api/users";
import { Utils } from "../common/utils";
import { isCUDResponse, isUser } from "../common/interfaces/checkType";
import { CUDResponse, IMongoUser, INew_User, InternalError } from "../common/interfaces/others";
import { ApiError } from "../api/errorApi";


export const passportLogin: VerifyFunctionWithRequest = async (req: Request, username: string, password: string, done: doneFunction) => {
    console.log('Inside passportLogin');
    const result : IMongoUser | ApiError | InternalError = await usersApi.getUserByUsername(username);
    if(isUser(result)){
        if(Utils.validPassword(result, password)){
            return done(null, result)
        }else{
            return done(null, null, {message: "Wrong credentials."});
        }
    }else if(result instanceof ApiError){
        return done(null, null, {message: result.message});
    }else{
        return done(result)
    }
 }
 
 export const passportSignUp : VerifyFunctionWithRequest = async (req: Request, username: string, password: string, done: doneFunction) => {
        console.log('Inside passportSignUp')     
        console.log('\n----------------- REQ BODY -------------------------\n');
        console.log(req.body);
        const firstResult : IMongoUser | ApiError | InternalError = await usersApi.getUserByUsername(username);
        if(isUser(firstResult)){
            return done(null, null, { message: `The email submitted is already in use.` });
        }else if(firstResult instanceof ApiError){
            const newUser : INew_User = {
                timestamp: req.body.timestamp,
                username: username,
                password: Utils.createHash(password),
                name: req.body.name,
                surname: req.body.surname,
                age: req.body.age,
                alias: req.body.alias,
                avatar: req.body.avatar,
                facebookID: '',
                photos: [req.body.avatar],
            };
            const result : CUDResponse | InternalError = await usersApi.addUser(newUser);
            if(isCUDResponse(result)){
                return done(null, result)
            }else{
                return done(result)  // Internal Error sent, generated at the attempt to register a new user.
            }
        }else{
            return done(firstResult) // Internal Error sent, generated at the search of an existing user with the submitted username.
        }
 }

export const LocalStrategy = passportLocal.Strategy
export const passportLocalConfig : IStrategyOptionsWithRequest = {
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
    
}
