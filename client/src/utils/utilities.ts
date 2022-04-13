import { UserAddresses, UserInfo } from "./interfaces";


export const cleanEmptyProperties: (user: UserInfo) => UserInfo = (user: UserInfo) => {
    if (user.avatar === '') delete user.avatar;
    if (user.addresses && user.addresses[0].street1.name !== '') delete user.addresses;
    return user;
};

export const formatAddress = (address: UserAddresses): string => {
    return `${address.street1.name} ${address.street1.number},${
        address.department && address.floor ? ` ${address.department} ${address.floor}, ` : ' '
    }${address.city} ${address.zipcode}`;
};
