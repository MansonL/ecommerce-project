export enum EProductsErrors {
    NoProducts = `There's no products...`,
    ProductNotFound = `The product wasn't found. Try another id...`,
    PropertiesIncorrect = `Properties are incorrect, try again...`,
    IdIncorrect = `Please, type a valid id.`,
    NoImagesUploaded = `Please, upload at least one product image...`,
    UnsupportedImageType = `Please upload an jpeg, png or jpg image...`
}

export enum EUsersErrors {
    RepeatedUser = `The username is already picked. Try with another...`,
    UserNotFound = `User not found.`,
    NoUsers = `There's no users registered...`,
    IncorrectProperties = `Fields incorrect, please check them...`,
    WrongCredentials = `Username or password not correct...`
}

export enum ECartErrors {
    EmptyCart = `Cart is empty.`,
    NoCarts = `There are no carts created.`,
    ProductNotInCart = `The product isn't in the cart.`
}

export enum EAuthErrors {
    NotAuthorizedUser = `You lack of permission for performing this operation...`,
    NotLoggedIn = `You must be logged in.`
}
