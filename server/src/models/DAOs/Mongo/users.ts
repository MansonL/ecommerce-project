/* eslint-disable no-unused-vars */

import { model, Model, Schema } from "mongoose";
import { ApiError } from "../../../api/errorApi";
import { EUsersErrors } from "../../../interfaces/EErrors";
import {
  IMongoUser,
  INew_User,
  UserAddresses,
} from "../../../interfaces/users";
import { CUDResponse } from "../../../interfaces/others";
import bcrypt from "bcrypt";
import { logger } from "../../../services/logger";
import { Config } from "../../../config/config";
import cluster from "cluster";
import { cartApi } from "../../../api/cart";
import moment from "moment";

const usersSchema = new Schema({
  createdAt: { type: String, required: true },
  modifiedAt: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  repeatedPassword: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  age: { type: String, required: true },
  avatar: { type: String },
  phoneNumber: { type: String, required: true },
  images: [
    {
      url: { type: String, required: true },
      photo_id: { type: String, required: true },
      _id: false,
    },
  ],
  facebookID: { type: String },
  addresses: [
    {
      alias: { type: String },
      street1: {
        name: { type: String },
        number: { type: String },
      },
      street2: { type: String },
      street3: { type: String },
      zipcode: { type: String },
      floor: { type: String },
      department: { type: String },
      city: { type: String },
      extra_info: { type: String },
    },
  ],
  isAdmin: { type: Boolean, required: true },
});

usersSchema.set("toJSON", {
  transform: (document, returnedDocument) => {
    delete returnedDocument.__v;
    if (returnedDocument.password && returnedDocument.repeatedPassword) {
      delete returnedDocument.password;
      delete returnedDocument.repeatedPassword;

      // Cause this function executes on every doc retrieving, so in some populated documents this fields won't be defined, such as cart populated doc...
    }
  },
});

usersSchema.methods.isValidPassword = async function (
  password: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const response = bcrypt.compareSync(password, this.password);
    response ? resolve(response) : reject(response);
  });
};

usersSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  this.repeatedPassword = hash;
  if (this.images.length === 0)
    this.images.push({
      url: "https://www.pinclipart.com/picdir/middle/169-1692839_default-avatar-transparent-clipart.png",
      photo_id: "default_avatar_image",
    });
  if (this.avatar)
    this.avatar =
      "https://www.pinclipart.com/picdir/middle/169-1692839_default-avatar-transparent-clipart.png";
  next();
});

const usersModel = model<INew_User, Model<INew_User>>("users", usersSchema);

export const botData: INew_User = {
  createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  modifiedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  username: Config.GOOGLE_EMAIL,
  password: "test123",
  repeatedPassword: "test123",
  name: `Ecommerce`,
  surname: `BOT`,
  age: "12-27-2000",
  phoneNumber: "+5492612345678",
  avatar: "",
  facebookID: "",
  isAdmin: true,
};

export const customerTest: INew_User = {
  createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  modifiedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  username: `lautaromanson@outlook.es`,
  password: "test123",
  repeatedPassword: "test123",
  name: `Lautaro`,
  surname: `Manson`,
  age: "12-27-2000",
  phoneNumber: "+5492612345678",
  avatar: "",
  facebookID: "",
  isAdmin: false,
};

// const WelcomeBot = new usersModel(botData);
// const CustomerTest = new usersModel(customerTest);

export class MongoUsers {
  private users: Model<INew_User>;
  constructor() {
    this.users = usersModel;
    this.init();
  }
  async init() {
    // if (Config.MODE === "CLUSTER") {
    //   if (cluster.isMaster) {
    //     if (Config.NODE_ENV !== "test") {
    //       await this.users.deleteMany({});
    //       await WelcomeBot.save();
    //       const customerTestId = String((await CustomerTest.save())._id);
    //       await cartApi.createEmptyCart(customerTestId);
    //       logger.info(`Users initialized`);
    //     } else await this.users.deleteMany({});
    //   }
    // } else {
    //   if (Config.NODE_ENV !== "test") {
    //     await this.users.deleteMany({});
    //     await WelcomeBot.save();
    //     const customerTestId = String((await CustomerTest.save())._id);
    //     await cartApi.createEmptyCart(customerTestId);
    //     logger.info(`Users initialized`);
    //   } else await this.users.deleteMany({});
    // }
  }
  async get(id?: string | undefined): Promise<IMongoUser[] | ApiError> {
    try {
      if (id != null) {
        const doc = await this.users.findOne({ _id: id });
        if (doc) return [doc] as unknown as IMongoUser[];
        else return ApiError.badRequest(EUsersErrors.UserNotFound);
      } else {
        const docs = await this.users.find({});
        if (docs.length > 0) return docs as unknown as IMongoUser[];
        else return ApiError.notFound(EUsersErrors.NoUsers);
      }
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }
  /* NEW USER CREATION */
  async getByUser(username: string): Promise<IMongoUser | ApiError> {
    try {
      const doc = await this.users.findOne({ username: username });
      if (doc) return doc as unknown as IMongoUser;
      else return ApiError.notFound(EUsersErrors.UserNotFound);
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }
  /*  FOR EMAILING TO ALL ADMINS AT A NEW ORDER   */
  async getAdmins(): Promise<string[] | ApiError> {
    try {
      const docs = await this.users.find({ isAdmin: true });
      if (docs.length > 0) {
        const emails = docs.map((document) => document.username);
        return emails;
      }
      // This line is just for any error at app launching. At launching there should be at least
      // one user as administrator.
      else return ApiError.notFound(`No admin users created.`);
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }

  /* PASSPORT SIGNUP & LOGIN FACEBOOK */
  async getByFacebookID(id: string): Promise<IMongoUser | ApiError> {
    try {
      const doc = await this.users.findOne({ facebookID: id });
      if (doc) return doc as unknown as IMongoUser;
      else return ApiError.notFound(EUsersErrors.UserNotFound);
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }

  async add(user: INew_User): Promise<CUDResponse | ApiError> {
    try {
      const doc = await this.users.create(user);
      return {
        message: `User successfully created.`,
        data: doc as unknown as IMongoUser,
      };
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }
  async addAddress(
    user_id: string,
    address: UserAddresses
  ): Promise<CUDResponse | ApiError> {
    try {
      const doc = await this.users.findOne({ _id: user_id }).lean();
      if (doc) {
        doc.addresses
          ? doc.addresses.push(address)
          : (doc.addresses = [address]);
        await this.users.findByIdAndUpdate(user_id, doc);
        return {
          message: `Address added succesfully`,
          data: doc as unknown as IMongoUser,
        };
      } else return ApiError.notFound(EUsersErrors.UserNotFound);
    } catch (error) {
      return ApiError.internalError(`An error occured.`);
    }
  }
}
