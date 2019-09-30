export namespace CommonConstants {
    export const email = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    export const APIUrl: string = 'http://206.189.140.51/eshop/public/api/';
    export const ADMINAPIUrl: string = 'http://206.189.140.51/eshop-admin/public/';

    export const regexMobileNumber = "^[0-9]{10,12}$";
    export const stripeCardNmuber: any = "([0-9]{16})";
    export const cvcPattern = "([0-9]{3})";
    export const expiryMonthPattern = "(0[1-9]|1[0-2])";
    export const epiryYearPattern = "([0-9]{2})";
    export const pinCodeRegex = "^[0-9]{5,8}$";
}