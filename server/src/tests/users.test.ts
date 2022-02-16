import fetch, { Response } from "node-fetch";
import { Config, hostURL } from "../config/config";
import { INew_User} from '../interfaces/users'
import moment from 'moment';

const botData: INew_User = {
  createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  modifiedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
  username: Config.GOOGLE_EMAIL,
  password: "test123",
  repeatedPassword: "test123",
  name: `Ecommerce`,
  surname: `BOT`,
  age: "27/12/2000",
  phoneNumber: "+5492612345678",
  avatar: "",
  facebookID: "",
  isAdmin: true,
};

const defaultUserURL = `${hostURL}/users`;
describe('Users API Tests', () => {
  it("POST users", async () => {
    const adminPostResponse : Response = await fetch(`${defaultUserURL}/save`, {
      body: JSON.stringify(botData),
      method: 'POST',
      headers : { 'Content-Type': 'application/json'},
    });
    console.log(adminPostResponse)
  })
})


/*
test("GET users", async () => {
  const getAllUsersByAdmin: Response = await fetch(`${defaultUserURL}/list`);
});
*/