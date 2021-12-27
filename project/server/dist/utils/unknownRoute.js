"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownRoute = void 0;
const availableRoutes = `
'/products/list': show available products.
'/products/list/id': show the product you want by typing the product id.
'/products/update/id': to update a product with its corresponding id.
'/products/save': to save a product.
'/products/delete/id': to delete a product with its id.
`;
const unknownRoute = (req, res) => {
    res.status(404).json({
        message: `The route doesn't exist, please try the followings: ${availableRoutes} `,
    });
};
exports.unknownRoute = unknownRoute;
