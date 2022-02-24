/* eslint-disable no-unused-vars*/

import moment from "moment";
import { Types } from "mongoose";
import { hostURL } from "../config/config";
import { UserInfo } from "../interfaces/users";
import { logger } from "../services/logger";
import axios, { AxiosResponse } from "axios";


const testUserData: UserInfo = {
  username: "test@gmail.com",
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

const testStoredUserData = {
  createdAt: moment().format(),
  modifiedAt: moment().format(),
  _id: new Types.ObjectId(),
};

const defaultUserURL = `${hostURL}/users`;
/*
jest.mock("axios");
*/
const mockedAxios = axios.post as jest.MockedFunction<typeof axios.post>;

describe("Users API Tests", () => {
  describe("POST save user", () => {
    it("user succesfully saved", async () => {
      try {
        /*
        const mockedResponse = {
          message: "User successfully created.",
          data: {
            ...testUserData,
            ...testStoredUserData,
          },
        };

        mockedAxios.mockImplementationOnce(
          (url, data, config) =>
            new Promise((resolve, reject) => {
              resolve({
                status: 201,
                statusText: "Created",
                headers: {
                  "x-powered-by": "Express",
                  "access-control-allow-origin": "http://localhost:3000",
                  vary: "Origin",
                  "access-control-allow-credentials": "true",
                  "content-type": "application/json; charset=utf-8",
                  "content-length": "470",
                  etag: 'W/"1d6-fGnP9DO8NIs0f7u52pumcLJsC/g"',
                  date: "response date",
                  connection: "close",
                },
                data: mockedResponse,
              });
            })
        );

        const response = await axios.post(
          `${defaultUserURL}/save`,
          testUserData
        );

        expect(response.status).toBe(201);
        expect(response.statusText).toBe("Created");
        expect(response.data).toEqual(mockedResponse);
        */
      } catch (error) {
        logger.warn(error);
      }
    });

    it("user saving failed, invalid fields", async () => {
      try {
        axios
          .post(`${defaultUserURL}/save`, {
            ...testUserData,
            age: "",
          })
          .catch((error) => console.log(error));
      } catch (error) {
        logger.warn(error);
      }
    });
  });
});
