import { Request } from "express";
import passportLocal, { IStrategyOptionsWithRequest, VerifyFunctionWithRequest } from "passport-local";
import { doneFunction } from ".";
import { usersApi } from "../api/users";
import { ApiError } from "../api/errorApi";
import { IMongoUser, INew_User } from "../common/interfaces/users";
import { logger } from "../services/logger";
import { CUDResponse, isCUDResponse } from "../common/interfaces/others";


export const passportLogin: VerifyFunctionWithRequest = async (req: Request, username: string, password: string, done: doneFunction) => {
    logger.info(`
    ----------------------- PASSPORT LOCAL (FUTURE JWT) LOGIN--------------------------------------
    `);
    const result : IMongoUser | ApiError  = await usersApi.getUserByUsername(username);
    if(result instanceof ApiError && result.error !== 500)
        return done(null, null, {message: result.message});
    else if(result instanceof ApiError)
        return done(result)
    else{
        if(await result.isValidPassword(password))
        return done(null, result)
    else
        return done(null, null, {message: "Wrong credentials."});
    }
 }
 
 export const passportSignUp : VerifyFunctionWithRequest = async (req: Request, username: string, password: string, done: doneFunction) => {
        logger.info(`
        --------------------- PASSPORT LOCAL (FUTURE JWT) SIGN UP -------------------------------
        
                                          REQ.BODY
                                        
        `);
        logger.info(req.body)
        
        const firstResult : IMongoUser | ApiError  = await usersApi.getUserByUsername(username);
        if(firstResult instanceof ApiError && firstResult.error !== 500){
            const newUser : INew_User = {
                createdAt: req.body.createdAt,
                modifiedAt: req.body.modifiedAt,
                data: {
                    username: username,
                    password: password,
                    repeatedPassword: password, // Checked at fronted if both passwords matches
                    name: req.body.name,
                    surname: req.body.surname,
                    age: req.body.age,
                    avatar: req.body.avatar,
                    facebookID: '',
                    photos: [req.body.avatar]
                },
                isAdmin: false,
            };
            const result : CUDResponse | ApiError = await usersApi.addUser(newUser);
            if(result instanceof ApiError && result.error !== 500)
                return done(null, null, result.message)
            else if(result instanceof ApiError && result.error === 500 )
                return done(result)  // Internal Error sent, generated at the attempt to register a new user.
            else if(isCUDResponse(result))
                return done(null, result.data)

        }else if(firstResult instanceof ApiError && firstResult.error === 500)
            return done(firstResult)   // Internal Error sent, generated at the search of an existing user with the submitted username.
        else  
            return done(null, null, { message: `The email submitted is already in use.` });
 }

export const LocalStrategy = passportLocal.Strategy
export const passportLocalConfig : IStrategyOptionsWithRequest = {
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
    
}
