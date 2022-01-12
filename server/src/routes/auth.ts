import { Router } from "express";
import passport from "passport";
import { authController } from "../controller/auth";
import { usersController } from "../controller/users";



export const authRouter : Router = Router();

/**
 * 
 * JWT AUTH ROUTES
 * 
 */

authRouter.get('/login', authController.login);
authRouter.get('/signup', authController.signup)
authRouter.post('/login', authController.loginPost) 
authRouter.post('/signup', authController.signupPost, usersController.save);


/**
 * 
 * PASSPORT-FACEBOOK ROUTES
 * 
 */

authRouter.get('/facebook', passport.authenticate('facebook'));
authRouter.get('/index', passport.authenticate('facebook', {
    successRedirect: 'http://localhost:3000/profile',
    failureRedirect: 'http://localhost:3000/login'
}))