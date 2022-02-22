/* eslint-disable no-unused-vars*/

import moment from "moment";
import { Types } from "mongoose";
import fetch, { Response } from "node-fetch";
import { hostURL } from "../config/config";
import { UserInfo } from "../interfaces/users";
import { logger } from "../services/logger";

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

const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("Users API Tests", () => {
  describe("POST save user", () => {
    it("user succesfully saved", async () => {
      try {
        mockedFetch.mockImplementationOnce(
          (url, requestOptions) =>
            new Promise<Response>((resolve, reject) =>
              setTimeout(
                () =>
                  resolve(
                    new Response(
                      JSON.stringify({
                        message: "User successfully created.",
                        data: { ...testStoredUserData, ...testUserData },
                      }),
                      {
                        url: url.toString(),
                        status: 201,
                        statusText: "Created",
                      }
                    )
                  ),
                1
              )
            )
        );

        const response = await mockedFetch(`${defaultUserURL}/save`, {
          body: JSON.stringify(testUserData),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const responseJSON = await response.json();
        expect(response.status).toBe(201);
        expect(response.statusText).toBe("Created");
        expect(responseJSON).toEqual({
          message: "User successfully created.",
          data: { ...testStoredUserData, ...testUserData },
        });

        /*
        const response: Response = await fetch(`${defaultUserURL}/save`, {
          body: JSON.stringify(botData),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const responseJSON = await response.json();
        console.log(responseJSON);
        console.log(response.headers);
        */
      } catch (error) {
        logger.warn(error);
      }
    });
  });
});

/*
test("GET users", async () => {
  const getAllUsersByAdmin: Response = await fetch(`${defaultUserURL}/list`);
});
*/
