import passport from "passport";
import { ApiError } from "../api/errorApi";
import { usersApi } from "../api/users";
import { IMongoUser } from "../common/interfaces/users";
import { logger } from "../services/logger";
import { FacebookStrategy, facebookVerify, passportFBConfig } from "./facebook";
import { LocalStrategy, passportLocalConfig, passportLogin, passportSignUp } from "./local";

export type doneFunction = (error: any, user?: any, options?: any) => void

declare global {
    namespace Express {
        interface User extends IMongoUser {}
    }
}


passport.use(new FacebookStrategy(passportFBConfig, facebookVerify))
passport.use('login', new LocalStrategy(passportLocalConfig, passportLogin));
passport.use('signup', new LocalStrategy(passportLocalConfig, passportSignUp))


passport.serializeUser((user, done: (err: any, id?: string) => void) => {
    logger.info(`Serializing`)
    logger.info(user)
    done(null, user._id.toString())
});

passport.deserializeUser(async (id: string, done: (err: any, user: IMongoUser | undefined | false | null) => void) => {
    logger.info(`Deserializing`)
    const result : IMongoUser[] | ApiError = await usersApi.getUser(id);
    if(result instanceof ApiError)
        done(result, null)
    else
        done(null, result[0])
})

export default passport