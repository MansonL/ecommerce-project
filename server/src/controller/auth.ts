import { NextFunction, Request, Response } from "express";
import { JwtPayload, sign, verify, VerifyErrors } from "jsonwebtoken";
import { ApiError } from "../api/errorApi";
import { usersApi } from "../api/users";
import { EAuthErrors, EUsersErrors } from "../interfaces/EErrors";
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

declare module "jsonwebtoken" {
  export interface JwtPayload extends IMongoUser {
    user_cart: IMongoCart;
  }
}

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const bearerJWToken = authHeader.split(" ")[1];
      verify(
        bearerJWToken,
        Config.JWT_SECRET,
        (err: VerifyErrors | null, token: JwtPayload | undefined) => {
          if (err) next(ApiError.badRequest(EAuthErrors.NotLoggedIn));
          else
            res.send({
              message: "Already logged in.",
              data: token,
            });
        }
      );
    } else next(ApiError.badRequest(EAuthErrors.NotLoggedIn));
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
            const userData = {
              user: Object.assign(
                {
                  user_cart: userCart,
                },
                JSON.parse(JSON.stringify(result))
              ),
            };
            sign(
              Object.assign({}, userData),
              Config.JWT_SECRET,
              { expiresIn: Config.JWT_EXPIRATION_TIME },
              (err, token) => {
                if (err) next(ApiError.internalError(err.message));
                else
                  res.send({
                    message: "Successfully logged in.",
                    data: token,
                  });
              }
            );
          });
        })
        .catch(() => {
          next(ApiError.badRequest(EUsersErrors.WrongCredentials));
        });
    }
  }

  async signup(req: Request, res: Response) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const bearerJWToken = authHeader.split(" ")[1];
      verify(
        bearerJWToken,
        Config.JWT_SECRET,
        (err: VerifyErrors | null, token: JwtPayload | undefined) => {
          if (err)
            res.json({
              message: "You can sign up.",
              data: {},
            });
          else
            res.json({
              message: "Already logged in.",
              data: token,
            });
        }
      );
    } else
      res.json({
        message: "You can sign up.",
        data: {},
      });
  }

  async signupPost(req: Request, res: Response, next: NextFunction) {
    const newUser: INew_User = req.body;
    const result: IMongoUser | ApiError = await usersApi.getUserByUsername(
      newUser.username
    );
    if (result instanceof ApiError) {
      next();
    } else res.status(400).json({
        error: 404,
        message: `Username already taken.`
    });
  }

  async isAuthorized(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const bearerJWToken = authHeader.split(" ")[1];
      verify(
        bearerJWToken,
        Config.JWT_SECRET,
        (err: VerifyErrors | null, token: JwtPayload | undefined) => {
          if (err) next(ApiError.badRequest(EAuthErrors.NotLoggedIn));
          // For going directly to the error handler adn refusing the main routing
          else if (token) {
            req.user = token.user; // Passing user logged in data to the next function in req.user
            next();
          }
        }
      );
    } else next(ApiError.badRequest(EAuthErrors.NotLoggedIn)); // For going directly to the error handler and refusing the main routing
  }

  async isAdmin(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const bearerJWToken = authHeader.split(" ")[1];
      verify(
        bearerJWToken,
        Config.JWT_SECRET,
        (err: VerifyErrors | null, token: JwtPayload | undefined) => {
          console.log(token?.user);
          if (err) next(ApiError.badRequest(EAuthErrors.NotAuthorizedUser));
          else if (token && token.user.isAdmin) {
            req.user = token.user;
            next();
          }
        }
      );
    } else next(ApiError.badRequest(EAuthErrors.NotLoggedIn));
  }
}

export const authController = new AuthController();
