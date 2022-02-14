import moment from "moment";
import { Config } from "../config/config";
import { INew_User } from "../interfaces/users";

export const botData: INew_User = {
    createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    modifiedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    username: Config.GOOGLE_EMAIL,
    password: "test123",
    repeatedPassword: "test123",
    name: `Manson`,
    surname: `Bot`,
    age: "27/12/2000",
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
    name: `Manson`,
    surname: `Lautaro`,
    age: "27/12/2000",
    phoneNumber: "+5492612345678",
    avatar: "",
    facebookID: "",
    isAdmin: false,
  };

  