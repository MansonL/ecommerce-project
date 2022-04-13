import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INew_Product } from '../../../../server/src/interfaces/products';
import { ProductCUDResponse } from '../../utils/interfaces';
import { validation } from '../../utils/joiSchemas';
import { ModalContainer } from '../../components/Modal/ModalContainer';
import { OperationResult } from '../../components/Result/OperationResult';
import { LoadingSpinner } from '../../components/Spinner/Spinner';
import { UserContext } from '../../components/UserProvider';
import './productsForm.css';

export function ProductsForm() {
    /**
     *
     * State of the future new products & error at submitting the Form with an invalid value.
     *
     *
     */
    const [showResult, setShowResult] = useState(false);
    const [submitResult, setSubmitResult] = useState('error' || 'success');
    const [resultMsg, setResultMsg] = useState('');

    const { user } = useContext(UserContext);
    const { loading, setLoading } = useContext(UserContext);

    const navigate = useNavigate();

    if (!user?.isAdmin) navigate('../login');

    const [newProduct, setNewProduct] = useState<INew_Product | undefined>();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        console.log(JSON.stringify(e.target.value, null, 2));
        const property: string = e.target.name;
        const value: string | number = e.target.value;
        setNewProduct({
            ...newProduct as INew_Product,
            [property]:
                property === 'price' ? Number(value) : property === 'stock' ? Number(value) : value,
        });
    };

    const generateCode = () => {
        setNewProduct({
            ...newProduct as INew_Product,
            code: `${Math.random().toString(36).substr(2, 9)}`,
        });
    };

    const AxiosThenCallback = (response: AxiosResponse<ProductCUDResponse, any>) => {
        const data = response.data;
        setShowResult(true);
        setSubmitResult('success');
        setResultMsg(data.message);
        setLoading(false);
        document.body.style.overflow = 'scroll';
        setTimeout(async () => {
            setShowResult(false);
            setSubmitResult('error');
            setResultMsg('');
        }, 2000);
    };

    const AxiosCatchCallback = (error: any) => {
        setLoading(false);
        document.body.style.overflow = 'scroll';
        console.log(JSON.stringify(error.response, null, 2));
        setShowResult(true);
        setSubmitResult('error');
        if (error.response) {
            if (error.response.status === 500) {
                setResultMsg(error.response.data.message.message);
            } else {
                setResultMsg(error.response.data.message.message);
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

    const submitProduct = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const product: INew_Product = {
            ...newProduct as INew_Product,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            modifiedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        const { error } = validation.newProduct.validate(product);
        if (error) {
        } else {
            setLoading(true);
            document.body.style.overflow = 'hidden';
            axios
                .post<ProductCUDResponse>('http://localhost:8080/api/products/save', product)
                .then(AxiosThenCallback)
                .catch(AxiosCatchCallback);
        }
    };

    const closeMsg = () => setShowResult(false);

    return (
        <>
            <main className="body-container">
                <header className="header">
                    <h3 className="header-title">Upload product</h3>
                    <h5>
                        Here you have all the basic fields to fill for creating a product in your
                        website and database.{' '}
                        <span className="ask-admin">(for changes ask to administrator.)</span>
                    </h5>
                </header>
                {loading && (
                    <ModalContainer>
                        <LoadingSpinner />
                    </ModalContainer>
                )}
                {showResult && (
                    <OperationResult
                        closeMsg={closeMsg}
                        result={submitResult}
                        resultMessage={resultMsg}
                    />
                )}
                <div className="product-form">
                    <div className="input-field">
                        <input
                            type="text"
                            onChange={onChange}
                            className="styled-input"
                            id="title"
                            name="title"
                            value={newProduct?.title}
                        />
                        <label
                            htmlFor="title"
                            className={
                                newProduct?.title !== '' ? 'filled-input-label' : 'animated-label'
                            }
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                                alt=""
                                className="required-field"
                            />{' '}
                            Product title{' '}
                        </label>
                        <span className="input-border"></span>
                    </div>
                    <div className="input-field">
                        <input
                            type="text"
                            onChange={onChange}
                            className="styled-input"
                            id="description"
                            name="description"
                            value={newProduct?.description}
                        />
                        <label
                            htmlFor="description"
                            className={
                                newProduct?.description !== ''
                                    ? 'filled-input-label'
                                    : 'animated-label'
                            }
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                                alt=""
                                className="required-field"
                            />{' '}
                            Description
                        </label>
                        <span className="input-border"></span>
                    </div>
                    <div className="code-field">
                        <div className="input-field">
                            <input
                                type="text"
                                onChange={onChange}
                                className="styled-input"
                                id="code"
                                name="code"
                                value={newProduct?.code}
                            />
                            <label
                                htmlFor="code"
                                className={
                                    newProduct?.code !== '' ? 'filled-input-label' : 'animated-label'
                                }
                            >
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                                    alt=""
                                    className="required-field"
                                    style={{ width: '5%' }}
                                />{' '}
                                Code
                            </label>
                            <span className="input-border"></span>
                        </div>
                        <button className="code-btn" onClick={generateCode}>
                            Generate code
                        </button>
                    </div>
                    <div className="input-field">
                        <input
                            type="file"
                            multiple
                            onChange={onChange}
                            className="styled-input"
                            id="images"
                            name="images"
                        />
                        <label htmlFor="images" className="filled-input-label">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                                alt=""
                                className="required-field"
                            />{' '}
                            Images
                        </label>
                        <span className="input-border"></span>
                    </div>
                    <div className="input-field">
                        <input
                            type="number"
                            className="styled-input"
                            onChange={onChange}
                            id="stock"
                            name="stock"
                            min="1"
                            step="1"
                            value={newProduct?.stock}
                        />
                        <label htmlFor="stock" className="filled-input-label">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                                alt=""
                                className="required-field"
                            />{' '}
                            Stock
                        </label>
                        <span className="input-border"></span>
                    </div>
                    <div className="input-field">
                        <input
                            type="number"
                            className="styled-input"
                            id="price"
                            onChange={onChange}
                            name="price"
                            min="0.01"
                            step="0.25"
                            value={newProduct?.price}
                        />
                        <label htmlFor="price" className="filled-input-label">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                                alt=""
                                className="required-field"
                            />{' '}
                            Price
                        </label>
                        <span className="input-border"></span>
                    </div>
                    <div className="input-field">
                        <input
                            type="text"
                            onChange={onChange}
                            className="styled-input"
                            id="category"
                            name="category"
                            value={newProduct?.category}
                        />
                        <label
                            htmlFor="category"
                            className={
                                newProduct?.category !== '' ? 'filled-input-label' : 'animated-label'
                            }
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Red_asterisk.svg/1200px-Red_asterisk.svg.png"
                                alt=""
                                className="required-field"
                            />{' '}
                            Category
                        </label>
                        <span className="input-border"></span>
                    </div>
                    <div className="submit-row">
                        <button className="submit-btn" onClick={submitProduct}>
                            Submit
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
