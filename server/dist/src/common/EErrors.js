"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EOrdersErrors = exports.EAuthErrors = exports.ECartErrors = exports.EUsersErrors = exports.EProductsErrors = void 0;
var EProductsErrors;
(function (EProductsErrors) {
    EProductsErrors["NoProducts"] = "There's no products...";
    EProductsErrors["ProductNotFound"] = "The product wasn't found. Try another id...";
    EProductsErrors["PropertiesIncorrect"] = "Properties are incorrect, try again...";
    EProductsErrors["IdIncorrect"] = "Invalid id.";
    EProductsErrors["NoImagesUploaded"] = "Please, upload at least one product image...";
    EProductsErrors["UnsupportedImageType"] = "Please upload an jpeg, png or jpg image...";
})(EProductsErrors = exports.EProductsErrors || (exports.EProductsErrors = {}));
var EUsersErrors;
(function (EUsersErrors) {
    EUsersErrors["RepeatedUser"] = "The username is already picked. Try with another...";
    EUsersErrors["UserNotFound"] = "User not found.";
    EUsersErrors["NoUsers"] = "There's no users registered...";
    EUsersErrors["IncorrectProperties"] = "Fields incorrect, please check them...";
    EUsersErrors["WrongCredentials"] = "Username or password not correct...";
})(EUsersErrors = exports.EUsersErrors || (exports.EUsersErrors = {}));
var ECartErrors;
(function (ECartErrors) {
    ECartErrors["EmptyCart"] = "Cart is empty.";
    ECartErrors["NoCarts"] = "There are no carts created.";
    ECartErrors["ProductNotInCart"] = "The product isn't in the cart.";
})(ECartErrors = exports.ECartErrors || (exports.ECartErrors = {}));
var EAuthErrors;
(function (EAuthErrors) {
    EAuthErrors["NotAuthorizedUser"] = "You lack of permission for performing this operation...";
    EAuthErrors["NotLoggedIn"] = "You must be logged in.";
})(EAuthErrors = exports.EAuthErrors || (exports.EAuthErrors = {}));
var EOrdersErrors;
(function (EOrdersErrors) {
    EOrdersErrors["NoOrdersCreated"] = "There are no orders created...";
    EOrdersErrors["OrderNotFound"] = "Order not found. Please try with another id...";
    EOrdersErrors["GreaterQuantity"] = "The amount of one or more products you want to confirm in your order exceed the available stock.";
    EOrdersErrors["DeletedProduct"] = "It seems that one or more of the products you want to confirm in your order have been deleted.";
})(EOrdersErrors = exports.EOrdersErrors || (exports.EOrdersErrors = {}));
