import axios from "axios";

/**
 * Defining a common structure for mocked responses, avoiding the config property object of AxiosResponse due its extent.
 */
interface MockedResponse {
  data: any;
  status: number;
  statusText: string;
  headers: {
    "x-powered-by": string;
    "access-control-allow-origin": string;
    vary: string;
    "access-control-allow-credentials": string;
    "content-type": string;
    "content-length": string;
    etag: string;
    date: string;
    connection: string;
  };
}

/* MOCKED AXIOS REST METHODS */

const mockedAxiosPost = axios.post as jest.MockedFunction<typeof axios.post>;

const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

const mockedAxiosDelete = axios.delete as jest.MockedFunction<
  typeof axios.delete
>;

const mockedAxiosPut = axios.put as jest.MockedFunction<typeof axios.put>;

/**
 * At every smallest piece of test ('it' functions) we are mocking for once the response from axios methods  * with the desired response defined inside the caller
 *
 * @param response desired response defined at caller block.
 * @param method type of axios method to be mocked.
 */

export const mockAxiosFunction = (
  response: MockedResponse,
  method: "GET" | "POST" | "DELETE" | "PUT"
): void => {
  method === "GET"
    ? mockedAxiosGet.mockImplementationOnce(
        (url, config) => new Promise((resolve, reject) => resolve(response))
      )
    : method === "POST"
    ? mockedAxiosPost.mockImplementationOnce(
        (url, config) => new Promise((resolve, reject) => resolve(response))
      )
    : method === "PUT"
    ? mockedAxiosPut.mockImplementationOnce(
        (url, config) => new Promise((resolve, reject) => resolve(response))
      )
    : mockedAxiosDelete.mockImplementationOnce(
        (url, config) => new Promise((resolve, reject) => resolve(response))
      );
};

/**
 * Function to call axios post method from the tests file
 *
 * @param url string where the request is going.
 * @param data the data to be sent with the post request to create a new resource.
 */

export const post = async (
  url: string,
  data: any
): Promise<MockedResponse> => {
    try {
        return await axios.post(url, data);
    } catch (error) {
        return error as MockedResponse
    }
};
