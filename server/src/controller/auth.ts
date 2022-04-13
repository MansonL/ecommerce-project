import { NextFunction, Request, Response } from "express";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { ApiError } from "../api/errorApi";
import { usersApi } from "../api/users";
import { EUsersErrors } from "../interfaces/EErrors";
import { IMongoCart } from "../interfaces/products";
import { IMongoUser, INew_User } from "../interfaces/users";
import { Config } from "../config/config";
import { Utils } from "../utils/utils";

declare global {
  namespace Express {
    interface User extends IMongoUser {
      user_cart: IMongoCart;
    }
  }
}

class AuthController {
  async login(req: Request, res: Response) {
    const jwt = req.cookies.auth;
    if (jwt) {
      const result = verify(jwt, Config.JWT_SECRET);
      if (typeof result === "string") res.status(200).send("Need to log in.");
      res.status(400).send(ApiError.badRequest("You're already logged in."));
    } else res.status(200).send("Need to login");
  }

  async loginPost(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    const result: IMongoUser | ApiError = await usersApi.getUserByUsername(
      username
    );
    if (result instanceof ApiError) next(result);
    else {
      result
        .isValidPassword(password)
        .then(() => {
          Utils.getUserCartOrDefault(result._id.toString()).then((userCart) => {
            const response = {
              user: Object.assign(
                { user_cart: userCart },
                JSON.parse(JSON.stringify(result))
              ),
            };
            const jwt = sign(
              { user_id: result._id.toString() },
              Config.JWT_SECRET,
              {
                expiresIn: Config.JWT_EXPIRATION_TIME,
              }
            );
            res
              .cookie("auth", jwt, {
                httpOnly: true,
                secure: true,
                sameSite: true,
              })
              .json({ message: "Succesfully logged in.", data: response });
          });
        })
        .catch(() => {
          next(ApiError.badRequest(EUsersErrors.WrongCredentials));
        });
    }
  }

  async signup(req: Request, res: Response) {
    const jwt = req.cookies.auth;
    if (jwt) {
      const result: JwtPayload | string = verify(jwt, Config.JWT_SECRET);
      if (typeof result === "string") res.status(200).send("You can sign up.");
      res.status(400).send(ApiError.badRequest("You're already logged in."));
    } else res.status(200).send("You can sign up.");
  }

  async signupPost(req: Request, res: Response, next: NextFunction) {
    const newUser: INew_User = req.body;
    const result: IMongoUser | ApiError = await usersApi.getUserByUsername(
      newUser.username
    );
    if (result instanceof ApiError) {
      next();
    } else
      res.status(400).json({
        error: 404,
        message: `Username already taken.`,
      });
  }

  async isAuthorized(req: Request, res: Response, next: NextFunction) {
    const jwt = req.cookies.auth;
    if (jwt) {
      const result: JwtPayload | string = verify(jwt, Config.JWT_SECRET);
      if (typeof result === "string") res.status(400).send("Need to log in.");
      next();
    } else res.status(400).send("Need to login");
  }

  async isAdmin(req: Request, res: Response, next: NextFunction) {
    const jwt = req.cookies.auth;
    if (jwt) {
      const result: JwtPayload | string = verify(jwt, Config.JWT_SECRET);
      if (typeof result === "string" || result["user_id"])
        res.status(200).send("Need to log in.");
      else {
        const possibleUser = await usersApi.getUsers(result["user_id"]);
        if (possibleUser instanceof ApiError)
          res.status(400).send("Need to log in.");
        else {
          if (possibleUser[0].isAdmin) next();
          else res.status(400).send("You have no permissions.");
        }
      }
    } else res.status(200).send("Need to login");
  }
}

export const authController = new AuthController();
