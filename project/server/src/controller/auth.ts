import { Request, Response } from "express";

class AuthController {

    login(req: Request, res: Response){
        console.log(req.user)
        if(req.isAuthenticated()){
            res.send({
                message: "Already logged in.", 
                data: req.user
            })
        }else{
            res.send({
                message: "Need to login.",
                data: {}
            })
        }
    }

    logout(req: Request, res: Response){
        req.logout();
        res.send({
            message: "Logged out.",
            data: {},
        })
    }

    signup(req: Request, res: Response){
        if(req.isAuthenticated()){
            res.send({
                message: "Already logged in.",
                data: req.user
            })
        }else{
            res.send({
                message: "Log in or sign up",
                data: {}
            })
        }
    }
}

export const authController = new AuthController();