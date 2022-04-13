import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import { useContext, useState } from 'react';
import { UserCUDResponse, UserInfo } from '../../utils/interfaces';
import { maxDate, minDate, validation } from '../../utils/joiSchemas';
import { cleanEmptyProperties } from '../../utils/utilities';
import { ModalContainer } from '../../components/Modal/ModalContainer';
import { OperationResult } from '../../components/Result/OperationResult';
import { LoadingSpinner } from '../../components/Spinner/Spinner';
import { UserContext } from '../../components/UserProvider';
import './signup.css';

export function SignUp() {
    const [showResult, setShowResult] = useState(false);
    const [signUpResult, setSignUpResult] = useState('error' || 'success');
    const [resultMsg, setResultMsg] = useState('');
    const [showHide, setShowHide] = useState(false);
    const [newUser, setNewUser] = useState<UserInfo>();

    const { loading, setLoading } = useContext(UserContext);

    /**
     * Simple function for changing the Hide/Show button at password input.
     *
     */
    const showHideClick = () => {
        setShowHide(!showHide);
    };

    /**
     *
     * @param ev with this param we are getting the value of the target fields "name" & "value"
     * With them we are going to make a dinamic change of the user data state, accessing to the user data
     * properties via [key : string].
     *
     */
    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const property = ev.target.name;
        const value = ev.target.value;
        setNewUser({
            ...newUser as UserInfo,
            [property]: value,
        });
    };

    const thenAxiosCallback = (response: AxiosResponse<UserCUDResponse, any>) => {
        const data = response.data;
        setShowResult(true);
        setSignUpResult('success');
        setResultMsg(data.message);
        setLoading(false);
        document.body.style.overflow = 'scroll';
        setTimeout(async () => {
            setShowResult(false);
            setSignUpResult('error');
            setResultMsg('');
        }, 2000);
    };

    /**
     *
     * @param ev just for preventing default submit action.
     *
     * Description:
     * First complete the user object timestamp for requesting the signing up to the backend.
     * Check if there's an error or not with the user data validation. Then make the POST request & show if
     * it was successful or there was an error.
     *
     */
    const signupSubmit = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();
        let user = { ...newUser };
        cleanEmptyProperties(user as UserInfo);
        console.log(user);
        const { error } = validation.user.validate(user);
        if (error) {
            setShowResult(true);
            setSignUpResult('error');
            setResultMsg(error.message);
        } else {
            setLoading(true);
            document.body.style.overflow = 'hidden';
            axios
                .post<UserCUDResponse>('http://localhost:8080/api/auth/signup', user)
                .then(thenAxiosCallback)
                .catch((error) => {
                    console.log(JSON.stringify(error.response, null, 2));
                    setLoading(false);
                    document.body.style.overflow = 'scroll';
                    setShowResult(true);
                    setSignUpResult('error');
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
                        setResultMsg('');
                    }, 3000);
                });
        }
    };

    const closeMsg = () => setShowResult(false);

    return (
        <>
            {loading && (
                <ModalContainer>
                    <LoadingSpinner />
                </ModalContainer>
            )}
            <main className="body-container">
                <div className="header">
                    <h3 className="header-title">Sign Up</h3>
                    <h5>You already have an account? Log in here.</h5>
                </div>
                {showResult && (
                    <OperationResult
                        closeMsg={closeMsg}
                        resultMessage={resultMsg}
                        result={signUpResult}
                    />
                )}
                <div className="login-signup-fields">
                    <div className="login-signup-field">
                        <input
                            type="text"
                            onChange={onChange}
                            value={newUser?.name}
                            className="styled-input"
                            id="name"
                            name="name"
                        />
                        <label
                            htmlFor="name"
                            className={
                                newUser?.name !== '' ? 'filled-input-label' : 'animated-label'
                            }
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                                alt=""
                                className="required-field"
                            />{' '}
                            Name{' '}
                        </label>
                        <span className="input-border"></span>
                    </div>
                    <div className="login-signup-field">
                        <input
                            type="text"
                            onChange={onChange}
                            value={newUser?.surname}
                            className="styled-input"
                            id="surname"
                            name="surname"
                        />
                        <label
                            htmlFor="surname"
                            className={
                                newUser?.surname !== '' ? 'filled-input-label' : 'animated-label'
                            }
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                                alt=""
                                className="required-field"
                            />{' '}
                            Surname{' '}
                        </label>
                        <span className="input-border"></span>
                    </div>
                    <div className="login-signup-field">
                        <label
                            htmlFor="age"
                            className="filled-input-label"
                            style={{ top: '-1.2rem' }}
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                                alt=""
                                className="required-field"
                            />{' '}
                            Age:
                        </label>
                        <br />
                        <input
                            type="date"
                            onChange={onChange}
                            value={newUser?.age}
                            className="age-input"
                            id="age"
                            name="age"
                            max={maxDate}
                            min={minDate}
                        />
                        <span className="input-border"></span>
                    </div>
                    <div className="login-signup-field">
                        <input
                            type="url"
                            onChange={onChange}
                            value={newUser?.avatar}
                            id="avatar"
                            name="avatar"
                            className="styled-input"
                        />
                        <label
                            htmlFor="avatar"
                            className={
                                newUser?.avatar !== '' ? 'filled-input-label' : 'animated-label'
                            }
                        >
                            Avatar URL<span className="optional-label">(optional)</span>:
                        </label>
                        <br />
                        <span className="input-border"></span>
                    </div>
                    <div className="login-signup-field">
                        <input
                            type="text"
                            onChange={onChange}
                            value={newUser?.phoneNumber}
                            id="phoneNumber"
                            name="phoneNumber"
                            className="styled-input"
                        />
                        <label
                            htmlFor="phoneNumber"
                            className={
                                newUser?.phoneNumber !== '' ? 'filled-input-label' : 'animated-label'
                            }
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                                alt=""
                                className="required-field"
                            />{' '}
                            Phone number:
                        </label>
                        <span className="input-border"></span>
                    </div>
                    <div className="login-signup-field">
                        <input
                            type="text"
                            onChange={onChange}
                            value={newUser?.username}
                            id="username"
                            name="username"
                            className="styled-input"
                        />
                        <label
                            htmlFor="username"
                            className={
                                newUser?.username !== '' ? 'filled-input-label' : 'animated-label'
                            }
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                                alt=""
                                className="required-field"
                            />{' '}
                            Username{' '}
                        </label>
                        <span className="input-border"></span>
                    </div>
                    <div className="password-field">
                        <div className="pswd-input-wrapper">
                            <input
                                type={showHide ? 'text' : 'password'}
                                onChange={onChange}
                                value={newUser?.password}
                                id="password"
                                name="password"
                                className="styled-input password-input"
                            />
                            <label
                                htmlFor="password"
                                className={
                                    newUser?.password !== ''
                                        ? 'filled-input-label'
                                        : 'animated-label'
                                }
                            >
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                                    alt=""
                                    className="required-field"
                                    style={{ width: '4%' }}
                                />{' '}
                                Password{' '}
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
                    <div className="password-field">
                        <div className="pswd-input-wrapper">
                            <input
                                type={showHide ? 'text' : 'password'}
                                onChange={onChange}
                                value={newUser?.repeatedPassword}
                                id="repeatedPassword"
                                name="repeatedPassword"
                                className="styled-input password-input"
                            />
                            <label
                                htmlFor="repeteadPassword"
                                className={
                                    newUser?.repeatedPassword !== ''
                                        ? 'filled-input-label'
                                        : 'animated-label'
                                }
                            >
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                                    alt=""
                                    className="required-field"
                                    style={{ width: '4%' }}
                                />{' '}
                                Repeat your password{' '}
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
                        <button className="submit-btn" onClick={signupSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
