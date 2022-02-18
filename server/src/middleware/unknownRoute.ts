import { Request, Response } from "express";
const availableRoutes = `
'/products/list': show available products.
'/products/list/id': show the product you want by typing the product id.
'/products/update/id': to update a product with its corresponding id.
'/products/save': to save a product.
'/products/delete/id': to delete a product with its id.
`;

export const unknownRoute = (req: Request, res: Response) => {
  res.status(404).json({
    error: 404,
    message: `The route doesn't exist, please try the followings: ${availableRoutes} `,
  });
};
