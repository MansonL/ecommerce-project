import passport from "passport";
import { IMongoUser } from "../common/interfaces/others";
import { usersApi } from "../api/users";
import { isUser } from "../common/interfaces/checkType";
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
    console.log("Serializing")
    console.log(user)
    done(null, user._id.toString())
});

passport.deserializeUser(async (id: string, done: (err: any, user: IMongoUser | undefined | false | null) => void) => {
    console.log("Deserializing")
    const result = await usersApi.getUser(id);
    if(isUser(result)){
        const user = result as IMongoUser[]
        done(null, user[0])
    }else{
        done(result, null)
    }
})

export default passport