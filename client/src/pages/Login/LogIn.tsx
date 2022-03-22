import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authResponse } from "../../utils/interfaces";
import { validation } from "../../utils/joiSchemas";
import { ModalContainer } from "../../components/Modal/ModalContainer";
import { OperationResult } from "../../components/Result/OperationResult";
import { LoadingSpinner } from "../../components/Spinner/Spinner";
import { UserContext } from "../../components/UserProvider";

export function LogIn() {
  const [showResult, setShowResult] = useState(false);
  const [loginResult, setLoginResult] = useState("error" || "success");
  const [resultMsg, setResultMsg] = useState("");
  const [showHide, setShowHide] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { updateLoginStatus } = useContext(UserContext);
  const { loading, setLoading } = useContext(UserContext);
  const { loggedIn, setLoggedIn } = useContext(UserContext);

  const navigate = useNavigate();

  /**
   * Simple function for changing the Hide/Show button at password input.
   *
   */
  const showHideClick = () => {
    setShowHide(!showHide);
  };

  /**
   * At every change event in the inputs field, we are setting the state with those values.
   * @param ev event param, just for taking the target name & value.
   *
   */
  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const property = ev.target.name;
    const value = ev.target.value;
    setCredentials({
      ...credentials,
      [property]: value,
    });
  };

  const thenAxiosCallback = (response: AxiosResponse<authResponse, any>) => {
    const data = response.data;
    setShowResult(true);
    setLoginResult("success");
    setResultMsg(data.message);
    setLoading(false);
    document.body.style.overflow = "scroll";
    setTimeout(async () => {
      setShowResult(false);
      setLoginResult("error");
      setResultMsg("");
      updateLoginStatus(data.data);
      setLoggedIn(true);
      navigate("../products");
    }, 2000);
  };

  /**
   * Function that receives the form submit event. Validate the current inputs value and then make the axios get
   *
   */
  const logInSubmit = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    const { error } = validation.login.validate(credentials);
    if (error) {
      setShowResult(true);
      setLoginResult("error");
      setResultMsg(error.message);
    } else {
      setLoading(true);
      document.body.style.overflow = "hidden";
      axios
        .post<authResponse>(
          `http://localhost:8080/api/auth/login`,
          credentials,
          { withCredentials: true }
        )
        .then(thenAxiosCallback)
        .catch((error) => {
          setLoading(false);
          document.body.style.overflow = "scroll";
          console.log(JSON.stringify(error.response, null, 2));
          setShowResult(true);
          setLoginResult("error");
          if (error.response) {
            if (error.response.status === 500) {
              setResultMsg(error.response.data.message);
            } else {
              setResultMsg(error.response.data.message);
            }
          } else if (error.request) {
            setResultMsg(`No response received from server.`);
          } else {
            setResultMsg(`Request error.`);
          }
          setTimeout(async () => {
            setShowResult(false);
            setResultMsg("");
          }, 3000);
        });
    }
  };

  useEffect(() => {
    setCredentials({
      username: "",
      password: "",
    });

    setShowResult(false);
    if (loggedIn) {
      navigate("../cart");
    }
  }, []);

  return (
    <>
      {loading && (
        <ModalContainer>
          <LoadingSpinner />
        </ModalContainer>
      )}
      <main className="body-container">
        <div className="header">
          <h3 className="header-title">Log in</h3>
          <h5>
            Don't you have an account?{" "}
            <span
              style={{ cursor: "pointer" }}
              onClick={() => navigate("../signup")}
            >
              Sign up here
            </span>
          </h5>
        </div>
        {showResult && (
          <OperationResult result={loginResult} resultMessage={resultMsg} />
        )}
        <div className="login-signup-fields">
          <div className="login-signup-field">
            <input
              type="text"
              id="username"
              name="username"
              className="styled-input"
              onChange={onChange}
              value={credentials.username}
            />
            <label
              htmlFor="username"
              className={
                credentials.username !== ""
                  ? "filled-input-label"
                  : "animated-label"
              }
            >
              Username
            </label>
            <span className="input-border"></span>
          </div>
          <div className="password-field">
            <div className="pswd-input-wrapper">
              <input
                type={showHide ? "text" : "password"}
                id="password"
                name="password"
                className="styled-input password-input"
                onChange={onChange}
              />
              <label
                htmlFor="password"
                className={
                  credentials.password !== ""
                    ? "filled-input-label"
                    : "animated-label"
                }
              >
                Password
              </label>
              <span className="input-border"></span>
            </div>

            <img
              src="https://cdn3.iconfinder.com/data/icons/show-and-hide-password/100/show_hide_password-07-512.png"
              alt=""
              className="show-pswd-icon"
              onClick={showHideClick}
            />
          </div>
          <div className="submit-row">
            <button className="submit-btn" onClick={logInSubmit}>
              Submit
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
