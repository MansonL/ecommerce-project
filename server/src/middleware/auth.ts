import { NextFunction, Request, Response, Router } from "express";
import { authController } from "../controller/auth";
import passport from "../passport/index";


export const authRouter : Router = Router();

/**
 * 
 * PASSPORT-LOCAL ROUTES
 * 
 */

authRouter.post('/signup', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('signup', function(err: any, user: any, info){
        if(err){
            return res.status(500).send(err);
        }
        if(user){
            return res.status(201).send(user)
        }
        return res.send(info)
    })(req,res,next);
});

authRouter.post('/login', passport.authenticate('login'), (req: Request, res: Response) => {
    res.status(200).send({data: req.user, message: "Successfully logged in!"});
})


authRouter.get('/login', authController.login);
authRouter.get('/logout', authController.logout)
authRouter.get('/signup', authController.signup)


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