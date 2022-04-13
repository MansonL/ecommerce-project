import axios, { AxiosResponse } from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAddresses } from '../../../../server/src/interfaces/users';
import { IUser, UserCUDResponse } from '../../utils/interfaces';
import { validation } from '../../utils/joiSchemas';
import { ModalContainer } from '../../components/Modal/ModalContainer';
import { OperationResult } from '../../components/Result/OperationResult';
import { LoadingSpinner } from '../../components/Spinner/Spinner';
import { UserContext } from '../../components/UserProvider';
import './addressForm.css';

export function AddressForm() {
    const [resultMsg, setResultMsg] = useState('');
    const [showResultMsg, setShowResult] = useState(false);
    const [addressResult, setAddressResult] = useState('error' || 'success');

    const [newAddress, setNewAddress] = useState<UserAddresses>();

    const { loading, setLoading } = useContext(UserContext);
    const { cartConfirmated } = useContext(UserContext);
    const { user, setUser, updateLoginStatus } = useContext(UserContext);

    const navigate = useNavigate();

    if (!cartConfirmated) navigate('../cart');

    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const name = ev.target.name;
        let value = ev.target.value;
        if (name === 'name') {
            setNewAddress({
                ...newAddress as UserAddresses,
                street1: {
                    ...(newAddress as UserAddresses).street1,
                    [name]: value,
                },
            });
        } else if (name === 'number') {
            setNewAddress({
                ...newAddress as UserAddresses,
                street1: {
                    ...(newAddress as UserAddresses).street1,
                    [name]: Number(value),
                },
            });
        } else {
            setNewAddress({
                ...newAddress as UserAddresses,
                [name]: value,
            });
        }
    };

    const AxiosThenCallback = (response: AxiosResponse<UserCUDResponse, any>) => {
        const data = response.data;
        setAddressResult('success');
        setResultMsg(data.message);
        setUser({
            ...user as IUser,
            addresses: data.data.addresses,
        });
        setShowResult(true);
        setLoading(false);
        document.body.style.overflow = 'scroll';
        setTimeout(() => {
            setShowResult(false);
            setAddressResult('error');
            setResultMsg('');
            navigate('../addresses');
        }, 2000);
    };

    const AxiosCatchCallback = (error: any) => {
        setLoading(false);
        document.body.style.overflow = 'scroll';
        console.log(JSON.stringify(error.response, null, 2));
        setAddressResult('error');
        setShowResult(true);
        if (error.response) {
            if (error.response.status === 500) {
                setResultMsg(error.response.data.message);
            } else {
                setResultMsg(error.response.data.message);
                if (/must be logged in/g.test(error.response.data.message)) {
                    updateLoginStatus(undefined);
                    navigate('../login');
                }
            }
        } else if (error.request) {
            setResultMsg(`No response received from server.`);
        } else {
            setResultMsg(`Request error.`);
        }
        setTimeout(() => {
            setShowResult(false);
            setResultMsg('');
        }, 3000);
    };

    const saveAddress = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const cleanAddress = JSON.parse(JSON.stringify(newAddress));
        if (newAddress?.street2 === '') delete cleanAddress.street2;
        if (newAddress?.street3 === '') delete cleanAddress.street3;
        if (newAddress?.floor === '') delete cleanAddress.floor;
        if (newAddress?.department === '') delete cleanAddress.department;
        if (newAddress?.extra_info === '') delete cleanAddress.extra_info;
        delete cleanAddress._id;
        console.log(cleanAddress);
        const { error } = validation.address.validate(cleanAddress);
        if (error) {
            setShowResult(true);
            setAddressResult('error');
            setResultMsg(error.message);
        } else {
            setLoading(true);
            document.body.style.overflow = 'hidden';
            const address: UserAddresses = {
                ...cleanAddress,
                _id: '',
            };
            console.log(address);
            axios
                .post('http://localhost:8080/api/users/address', address)
                .then(AxiosThenCallback)
                .catch(AxiosCatchCallback);
        }
    };

    const closeMsg = () => setShowResult(false);

    return (
        <main className="body-container">
            <div className="header">
                <h3 className="header-title">Address</h3>
            </div>
            <h5 style={{ width: '80%', margin: 'auto', marginTop: '3rem' }}>
                We have noticed that you <b>don't</b> have any address saved...
                <br />
                Before you confirm your order you need to choose one, so here you can save an
                address to select it after.
            </h5>
            {loading && (
                <ModalContainer>
                    <LoadingSpinner />
                </ModalContainer>
            )}
            {showResultMsg && (
                <OperationResult
                    closeMsg={closeMsg}
                    result={addressResult}
                    resultMessage={resultMsg}
                />
            )}
            <div className="address-fields">
                <div className="address-field">
                    <input
                        type="text"
                        onChange={onChange}
                        value={newAddress?.alias}
                        className="styled-input"
                        name="alias"
                        id="alias"
                    />
                    <label
                        htmlFor="alias"
                        className={
                            newAddress?.alias !== '' ? 'filled-input-label' : 'animated-label'
                        }
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                            alt=""
                            className="required-field"
                        />{' '}
                        Alias
                    </label>
                    <span className="input-border"></span>
                </div>
                <div className="street1">
                    <label htmlFor="street1" className="street1-label">
                        Street 1
                    </label>
                    <div className="street1-container">
                        <div className="address-field">
                            <input
                                type="text"
                                onChange={onChange}
                                value={newAddress?.street1.name}
                                className="styled-input"
                                name="name"
                                id="stree1name"
                            />
                            <label
                                htmlFor="street1name"
                                className={
                                    newAddress?.street1.name !== ''
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
                                Name
                            </label>
                            <span className="input-border"></span>
                        </div>
                        <div className="address-field">
                            <input
                                type="number"
                                onChange={onChange}
                                value={newAddress?.street1.number}
                                className="styled-input"
                                name="number"
                                id="stree1number"
                                min="0"
                                max="99999"
                                step="10"
                            />
                            <label htmlFor="street1number" className="filled-input-label">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                                    alt=""
                                    className="required-field"
                                    style={{ width: '6%' }}
                                />{' '}
                                Number
                            </label>
                            <span className="input-border"></span>
                        </div>
                    </div>
                </div>
                <div className="dpt-floor">
                    <div className="address-field">
                        <input
                            type="text"
                            onChange={onChange}
                            value={newAddress?.department}
                            className="styled-input"
                            name="department"
                            id="department"
                        />
                        <label
                            htmlFor="department"
                            className={
                                newAddress?.department !== ''
                                    ? 'filled-input-label'
                                    : 'animated-label'
                            }
                        >
                            Department{' '}
                            {window.innerWidth > 400 ? (
                                <span className="optional-label">(optional)</span>
                            ) : newAddress?.department === '' ? (
                                <span className="optional-label">(optional)</span>
                            ) : (
                                ''
                            )}
                        </label>
                        <span className="input-border"></span>
                    </div>
                    <div className="address-field">
                        <input
                            type="text"
                            onChange={onChange}
                            value={newAddress?.floor}
                            className="styled-input"
                            name="floor"
                            id="floor"
                        />
                        <label
                            htmlFor="floor"
                            className={
                                newAddress?.floor !== '' ? 'filled-input-label' : 'animated-label'
                            }
                        >
                            Floor <span className="optional-label">(optional)</span>
                        </label>
                        <span className="input-border"></span>
                    </div>
                </div>
                <div className="address-field">
                    <input
                        type="text"
                        onChange={onChange}
                        value={newAddress?.street2}
                        className="styled-input"
                        name="street2"
                        id="stree2"
                    />
                    <label
                        htmlFor="street2"
                        className={
                            newAddress?.street2 !== '' ? 'filled-input-label' : 'animated-label'
                        }
                    >
                        {' '}
                        Street 2 <span className="optional-label">(optional)</span>
                    </label>
                    <span className="input-border"></span>
                </div>
                <div className="address-field">
                    <input
                        type="text"
                        onChange={onChange}
                        value={newAddress?.street3}
                        className="styled-input"
                        name="street3"
                        id="stree3"
                    />
                    <label
                        htmlFor="street3"
                        className={
                            newAddress?.street3 !== '' ? 'filled-input-label' : 'animated-label'
                        }
                    >
                        {' '}
                        Street 3 <span className="optional-label">(optional)</span>
                    </label>
                    <span className="input-border"></span>
                </div>
                <div className="address-field">
                    <input
                        type="text"
                        onChange={onChange}
                        value={newAddress?.city}
                        className="styled-input"
                        name="city"
                        id="city"
                    />
                    <label
                        htmlFor="city"
                        className={newAddress?.city !== '' ? 'filled-input-label' : 'animated-label'}
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                            alt=""
                            className="required-field"
                        />{' '}
                        City
                    </label>
                    <span className="input-border"></span>
                </div>
                <div className="address-field">
                    <input
                        type="text"
                        onChange={onChange}
                        value={newAddress?.zipcode}
                        className="styled-input"
                        name="zipcode"
                        id="zipcode"
                    />
                    <label
                        htmlFor="zipcode"
                        className={
                            newAddress?.zipcode !== '' ? 'filled-input-label' : 'animated-label'
                        }
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                            alt=""
                            className="required-field"
                        />{' '}
                        Zipcode
                    </label>
                    <span className="input-border"></span>
                </div>
                <div className="address-field">
                    <input
                        type="text"
                        onChange={onChange}
                        value={newAddress?.extra_info}
                        className="styled-input"
                        name="extra_info"
                        id="extra_info"
                    />
                    <label
                        htmlFor="extra_info"
                        className={
                            newAddress?.extra_info !== '' ? 'filled-input-label' : 'animated-label'
                        }
                    >
                        Additional instructions <span className="optional-label">(optional)</span>
                    </label>
                    <span className="input-border"></span>
                </div>
                <div className="submit-row" style={{ textAlign: 'center' }}>
                    <button className="submit-btn" onClick={saveAddress}>
                        Save
                    </button>
                </div>
            </div>
        </main>
    );
}
