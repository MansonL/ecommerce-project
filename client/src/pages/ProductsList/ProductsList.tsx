import axios, { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  IMongoCart,
  IMongoProduct,
  IQuery,
} from "../../../../server/src/interfaces/products";
import { UserContext } from "../../components/UserProvider";
import { CartCUDResponse, ProductCUDResponse } from "../../utils/interfaces";
import { Modal } from "../../components/Modal/Modal";
import { OperationResult } from "../../components/Result/OperationResult";
import { ModalContainer } from "../../components/Modal/ModalContainer";
import { LoadingSpinner } from "../../components/Spinner/Spinner";
import "./productsList.css";
import { useNavigate } from "react-router-dom";

export interface IProductsProps {
  filterBtn: React.RefObject<HTMLButtonElement>;
  filterMenu: React.RefObject<HTMLDivElement>;
  showFilter: boolean;
  showFilterMenu: () => void;
}

export function ProductsList(props: IProductsProps) {
  const [filters, setFilters] = useState<IQuery>({
    title: "",
    code: "",
    category: "",
    price: {
      minPrice: 0,
      maxPrice: 0,
    },
    stock: {
      minStock: 0,
      maxStock: 0,
    },
  });

  const filterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const property = e.target.name;
    if (/Price/g.test(property)) {
      setFilters({
        ...filters,
        price: {
          ...filters.price,
          [property]: value,
        },
      });
    } else if (/Stock/g.test(property)) {
      setFilters({
        ...filters,
        stock: {
          ...filters.stock,
          [property]: value,
        },
      });
    } else {
      setFilters({
        ...filters,
        [property]: value,
      });
    }
  };

  const [products, setProducts] = useState<IMongoProduct[]>([]);
  const { setCart } = useContext(UserContext);
  const { updateLoginStatus } = useContext(UserContext);

  const navigate = useNavigate();

  const GETAxiosThenCallback = (response: AxiosResponse<IMongoProduct[]>) => {
    const data = response.data;
    setProducts(data);
    setLoading(false);
    document.body.style.overflow = "scroll";
  };

  const CUDAxiosThenCallback = (
    response: AxiosResponse<ProductCUDResponse | CartCUDResponse, any>
  ) => {
    const data = response.data;
    setShowResult(true);
    setOperationResult(true);
    setResultMsg(data.message);
    if (!user.isAdmin) setCart(data.data as IMongoCart);
    fetchProducts();
    setLoading(false);
    document.body.style.overflow = "scroll";
    setTimeout(async () => {
      setShowResult(false);
      setOperationResult(false);
      setResultMsg("");
    }, 2000);
  };

  const AxiosCatchCallback = (error: any) => {
    setLoading(false);
    document.body.style.overflow = "scroll";
    console.log(JSON.stringify(error.response, null, 2));
    setShowResult(true);
    setOperationResult(false);
    if (error.response) {
      if (error.response.status === 500) {
        setResultMsg(
          error.response.data.message.message
            ? error.response.data.message.message
            : error.response.data.message
        );
      } else {
        setResultMsg(
          error.response.data.message.message
            ? error.response.data.message.message
            : error.response.data.message
        );
        if (/must be logged in/g.test(error.response.data.message)) {
          updateLoginStatus(undefined);
          navigate("../login");
        }
      }
    } else if (error.request) {
      setResultMsg(`No response received from server.`);
    } else {
      setResultMsg(`Request error.`);
    }
    setTimeout(() => {
      setOperationResult(false);
      setShowResult(false);
      setResultMsg("");
    }, 2000);
  };

  const FilterApply = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    const url = `http://localhost:8080/api/products/query?${
      filters.title ? `title=${filters.title}&` : ""
    }${filters.code ? `code=${filters.code}&` : ""}${
      filters.stock.minStock ? `minStock=${filters.stock.minStock}&` : ""
    }${filters.stock.maxStock ? `maxStock=${filters.stock.maxStock}&` : ""}${
      filters.price.minPrice ? `minPrice=${filters.price.minPrice}&` : ""
    }${filters.price.maxPrice ? `maxPrice=${filters.price.maxPrice}` : ""}`;
    setLoading(true);
    document.body.style.overflow = "hidden";
    axios
      .get<IMongoProduct[]>(url)
      .then((response) => {
        const products = response.data;
        setProducts(products);
        setLoading(false);
        document.body.style.overflow = "scroll";
      })
      .catch(AxiosCatchCallback);
  };

  const filterClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    props.showFilterMenu();
  };

  const filterDropdownClassName = props.showFilter
    ? "filter-menu filter-menu-active"
    : "filter-menu";

  const [showModal, setShowModal] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [operationResult, setOperationResult] = useState(false);
  const [resultMsg, setResultMsg] = useState("");
  const [savedCode, setCode] = useState("");
  const [adminView, setAdminView] = useState(false);

  const { user, token } = useContext(UserContext);
  const { loading, setLoading } = useContext(UserContext);
  const { loggedIn } = useContext(UserContext);

  const changeToAdmingView = () => {
    setAdminView(!adminView);
  };

  const handleAdd = async (code: string) => {
    const cartData = {
      product_id: code,
      quantity: 1,
    };
    setLoading(true);
    document.body.style.overflow = "hidden";
    axios
      .post<ProductCUDResponse>(
        `http://localhost:8080/api/cart/add/`,
        cartData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      )
      .then(CUDAxiosThenCallback)
      .catch(AxiosCatchCallback);
  };

  const removeProductAttempt = (code: string) => {
    setCode(code);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const deleteProduct = () => {
    setLoading(true);
    document.body.style.overflow = "hidden";
    axios
      .delete<ProductCUDResponse>(
        `http://localhost:8080/api/products/delete/${savedCode}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      )
      .then(CUDAxiosThenCallback)
      .catch(AxiosCatchCallback);
  };

  const fetchProducts = () => {
    axios
      .get<IMongoProduct[]>("http://localhost:8080/api/products/list")
      .then(GETAxiosThenCallback)
      .catch(AxiosCatchCallback);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      {showResult && (
        <OperationResult resultMessage={resultMsg} success={operationResult} />
      )}

      {showModal && (
        <Modal
          cancelClick={handleCancel}
          confirmClick={deleteProduct}
          msg="Are you sure you want to delete the product?"
        />
      )}

      {loading && (
        <ModalContainer>
          <LoadingSpinner />
        </ModalContainer>
      )}

      <section className="body-container">
        <div className="products-filter-bar">
          <span className="total-results">{`Showing ${products.length} products of ${products.length}`}</span>
          <div className="filter-container">
            <button
              className="filter-btn"
              onClick={filterClick}
              ref={props.filterBtn}
            >
              <img
                src="https://static.thenounproject.com/png/1701541-200.png"
                alt=""
                className="filter-icon"
              />
            </button>
            <div className={filterDropdownClassName} ref={props.filterMenu}>
              <div className="filter-row">
                <label htmlFor="name" className="filter-label">
                  Product name
                </label>
                <input
                  type="text"
                  name="title"
                  value={filters.title}
                  onChange={filterChange}
                  className="filter-input"
                />
              </div>
              <div className="filter-row">
                <label htmlFor="code" className="filter-label">
                  Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={filters.code}
                  onChange={filterChange}
                  className="filter-input"
                />
              </div>
              <div className="filter-row">
                <label htmlFor="category" className="filter-label">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={filters.category}
                  onChange={filterChange}
                  className="filter-input"
                />
              </div>
              <div className="filter-row">
                <label htmlFor="stock" className="filter-label">
                  Stock
                </label>
                <div className="flex-filter">
                  <input
                    type="number"
                    className="filter-input"
                    value={filters.stock.minStock}
                    onChange={filterChange}
                    min="1"
                    name="minStock"
                  />
                  <input
                    type="number"
                    className="filter-input"
                    value={filters.stock.maxStock}
                    onChange={filterChange}
                    min="1"
                    name="maxStock"
                  />
                </div>
              </div>
              <div className="filter-row">
                <label htmlFor="price" className="filter-label">
                  Price
                </label>
                <div className="flex-filter">
                  <input
                    type="number"
                    className="filter-input"
                    value={filters.price.minPrice}
                    onChange={filterChange}
                    name="minPrice"
                    min="0.01"
                    step="0.1"
                  />
                  <input
                    type="number"
                    className="filter-input"
                    value={filters.price.maxPrice}
                    onChange={filterChange}
                    name="maxPrice"
                    min="0.01"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="filter-row" style={{ textAlign: "center" }}>
                <button className="filter-submit-btn" onClick={FilterApply}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
        {user.isAdmin && (
          <div className="see-as-admin">
            <span onClick={changeToAdmingView}>See as an admin here</span>
          </div>
        )}
        <ul className="products-list">
          {products.length > 0 ? (
            products.map((product, idx) => {
              return (
                <li className="product" key={String(idx)}>
                  <img
                    className="product-image"
                    src={product.images[0].url}
                    alt=""
                  />
                  <div className="product-info">
                    <span className="product-title">{product.title}</span>
                    <span className="product-price">{product.price}</span>
                  </div>
                  <div className="add-remove-container">
                    {!user.isAdmin && loggedIn && (
                      <button
                        className="add-remove-btn"
                        onClick={() => handleAdd(String(product._id))}
                      >
                        <img
                          src="https://cdn3.iconfinder.com/data/icons/basic-flat-svg/512/svg01-512.png"
                          alt="remove-icon"
                          className="add-remove-icon"
                        />
                      </button>
                    )}
                    {user.isAdmin && adminView && (
                      <button
                        className="add-remove-btn"
                        onClick={() =>
                          removeProductAttempt(String(product._id))
                        }
                      >
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/216/216685.png"
                          alt="add-icon"
                          className="add-remove-icon"
                        />
                      </button>
                    )}
                  </div>
                </li>
              );
            })
          ) : (
            <OperationResult
              resultMessage="There are no products stored at DB."
              success={false}
            />
          )}
        </ul>
      </section>
    </>
  );
}
