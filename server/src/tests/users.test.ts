import fetch from "node-fetch";
import { Config, hostURL } from "../config/config";
import { UserInfo } from '../interfaces/users'

const botData : UserInfo = {
  username: Config.GOOGLE_EMAIL,
  password: "test123",
  repeatedPassword: "test123",
  name: `Ecommerce`,
  surname: `BOT`,
  age: "12-27-2000",
  phoneNumber: "+5492612345678",
  avatar: "",
  facebookID: "",
  isAdmin: false,
};

const defaultUserURL = `${hostURL}/users`;


describe('Users API Tests', () => {
  it("POST users", async () => {
    try{
      const adminPostResponse  = await fetch(`${defaultUserURL}/save`, {
        body: JSON.stringify(botData),
        method: 'POST',
        headers : { 'Content-Type': 'application/json'},
      });
      console.log(await adminPostResponse.json())
    }catch (error) {
      console.log(error)
    }
  })
})


/*
test("GET users", async () => {
  const getAllUsersByAdmin: Response = await fetch(`${defaultUserURL}/list`);
});
*/