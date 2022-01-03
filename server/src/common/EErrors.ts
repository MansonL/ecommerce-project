export enum EProductsErrors {
    NoProducts = `There's no products...`,
    ProductNotFound = `The product wasn't found. Try another id...`,
    NotAuthorizedUser = `User have no permissions.`,
    PropertiesIncorrect = `Properties are incorrect, try again...`,
    IdIncorrect = `Please, type a valid id.`,
}

export enum EUsersErrors {
    RepeatedUser = `The username is already picked. Try with another...`,
    UserNotFound = `User not found.`,
    NoUsers = `There's no users registered...`,
    IncorrectProperties = `Fields incorrect, please check them...`,
}

export enum ECartErrors {
    EmptyCart = `Cart is empty.`,
    NoCarts = `There are no carts created.`,
    ProductNotInCart = `The product isn't in the cart.`
}
