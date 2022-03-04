/* eslint-disable no-unused-vars*/

import moment from "moment";
import { Types } from "mongoose";
import { hostURL } from "../../config/config";
import { UserInfo } from "../../interfaces/users";
import { logger } from "../../services/logger";
import axios from "axios";
import { mockAxiosFunction, post } from "../api";

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

jest.mock("axios");

describe("Users API Tests", () => {
  describe("POST save user", () => {
    it("user succesfully saved", async () => {
      try {
        const mockedResponse = {
          status: 201,
          statusText: "Created",
          headers: {
            "x-powered-by": "Express",
            "access-control-allow-origin": "http://localhost:3000",
            vary: "Origin",
            "access-control-allow-credentials": "true",
            "content-type": "application/json; charset=utf-8",
            "content-length": "response lenght",
            etag: "request etag",
            date: "response date",
            connection: "close",
          },
          data: {
            message: "User successfully created.",
            data: {
              ...testUserData,
              ...testStoredUserData,
            },
          },
        };

        mockAxiosFunction(mockedResponse, "POST");

        const response = await axios.post(
          `${defaultUserURL}/save`,
          testUserData
        );

        expect(response.status).toBe(201);
        expect(response.statusText).toBe("Created");
        expect(response.data).toEqual(mockedResponse);
      } catch (error) {
        logger.error(error);
      }
    });

    it("user saving failed, invalid fields", async () => {
      try {
        const mockedResponse = {
          status: 400,
          statusText: "Bad Request",
          headers: {
            "x-powered-by": "Express",
            "access-control-allow-origin": "http://localhost:3000",
            vary: "Origin",
            "access-control-allow-credentials": "true",
            "content-type": "application/json; charset=utf-8",
            "content-length": "response length",
            etag: "request etag",
            date: "response server date",
            connection: "close",
          },
          data: {
            error: 400,
            message: "You must provide a valid date.",
          },
        };

        mockAxiosFunction(mockedResponse, "POST");

        const response = await axios.post(`${defaultUserURL}/save`, {
          ...testUserData,
          age: "",
        });

        expect(response.status).toBe(400);
        expect(response.statusText).toBe("Bad Request");
        expect(response.data).toEqual(mockedResponse.data);
      } catch (error) {
        logger.error(error);
      }
    });

    it("user saving failed, missing required fields", async () => {
      try {
        const mockedResponse = {
          status: 400,
          statusText: "Bad Request",
          headers: {
            "x-powered-by": "Express",
            "access-control-allow-origin": "http://localhost:3000",
            vary: "Origin",
            "access-control-allow-credentials": "true",
            "content-type": "application/json; charset=utf-8",
            "content-length": "response length",
            etag: "request etag",
            date: "response server date",
            connection: "close",
          },
          data: { error: 400, message: '"username" is required' },
        };

        const { username, ...missingFieldsData } = testUserData;

        mockAxiosFunction(mockedResponse, "POST");
        const response = await axios.post(
          `${defaultUserURL}/save`,
          missingFieldsData
        );

        expect(response.status).toBe(400);
        expect(response.statusText).toBe("Bad Request");
        expect(response.data).toEqual(mockedResponse.data);
      } catch (error) {
        logger.error(error);
      }
    });
  });
});
