import { Request } from "express";
import passportFacebook, {
  Profile,
  VerifyFunctionWithRequest,
} from "passport-facebook";
import { IMongoUser, INew_User, isUser } from "../interfaces/users";
import { ApiError } from "../api/errorApi";
import * as dotenv from "dotenv";
import moment from "moment";
import { usersApi } from "../api/users";
import passport from "passport";

dotenv.config();

// eslint-disable-next-line no-unused-vars
type doneFunction = (error: any, user?: any, options?: any) => void;

/**
 *
 *
 * Login & SignUp Passport Facebook Functions
 *
 *
 */

export const facebookVerify: VerifyFunctionWithRequest = async (
  req: Request,
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: doneFunction
) => {
  const firstResult: IMongoUser | ApiError = await usersApi.getUserByFacebookID(
    profile.id
  );
  if (isUser(firstResult)) {
    return done(null, firstResult);
  } else if (firstResult instanceof ApiError) {
    const newUser: INew_User = {
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      modifiedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      username: profile.emails ? profile.emails[0].value : "",
      name: profile.displayName.split(" ")[0],
      surname: profile.displayName.split(" ")[1],
      age: profile.birthday ? profile.birthday : "none",
      facebookID: profile.id,
      password: "",
      phoneNumber: "",
      repeatedPassword: "",
      avatar: profile.photos
        ? profile.photos[0].value
        : "https://scontent.fmdz5-1.fna.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=12b3be&_nc_eui2=AeGFVppcWlKdc7aGtqBjr_qUik--Qfnh2B6KT75B-eHYHjmg8hXUxKd83x9Quvqm7QJihxiVWmgPNHt_JQZRXFjE&_nc_ohc=lreSzZHG1jMAX8WENYk&_nc_ht=scontent.fmdz5-1.fna&edm=AP4hL3IEAAAA&oh=7ca8884c54739b55368dd37ab5389c49&oe=61DA6438",
      isAdmin: false,
    };
    const result = await usersApi.addUser(newUser);
    if (result instanceof ApiError) return done(result);
    else return done(null, result.data);
  }
};

/**
 *
 * PASSPORT CONFIGS
 *
 */

export const commandData = process.argv.slice(2);

const clientID =
  commandData[1] && commandData[1].length > 4 && !isNaN(Number(commandData[1]))
    ? commandData[1]
    : (process.env.FACEBOOK_APP_ID as string);

const clientSecret =
  commandData[2] && commandData[2].length > 4 && isNaN(Number(commandData[2]))
    ? commandData[2]
    : (process.env.FACEBOOK_APP_SECRET as string);

export const FacebookStrategy = passportFacebook.Strategy;
export const passportFBConfig: passportFacebook.StrategyOptionWithRequest = {
  clientID: clientID,
  clientSecret: clientSecret,
  callbackURL: "http://localhost:8080/api/auth/index",
  passReqToCallback: true,
  profileFields: ["id", "displayName", "emails", "photos"],
};

passport.use(new FacebookStrategy(passportFBConfig, facebookVerify));

export default passport;
