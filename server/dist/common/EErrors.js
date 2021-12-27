"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EUsersErrors = exports.EProductsErrors = void 0;
var EProductsErrors;
(function (EProductsErrors) {
    EProductsErrors["NoProducts"] = "There's no products...";
    EProductsErrors["ProductNotFound"] = "The product wasn't found. Try another id...";
    EProductsErrors["NotAuthorizedUser"] = "User have no permissions.";
    EProductsErrors["PropertiesIncorrect"] = "Properties are incorrect, try again...";
    EProductsErrors["IdIncorrect"] = "Please, type a valid id.";
})(EProductsErrors = exports.EProductsErrors || (exports.EProductsErrors = {}));
var EUsersErrors;
(function (EUsersErrors) {
    EUsersErrors["RepeatedUser"] = "The username is already picked. Try with another...";
    EUsersErrors["UserNotFound"] = "User not found.";
    EUsersErrors["NoUsers"] = "There's no users registered...";
    EUsersErrors["IncorrectProperties"] = "Fields incorrect, please check them...";
})(EUsersErrors = exports.EUsersErrors || (exports.EUsersErrors = {}));
