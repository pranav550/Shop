
/* checking the system localstorage */

export class HelperCommon {
    static getUser() {
        if (localStorage.getItem('currentUser')) {
            return JSON.parse(localStorage.getItem('currentUser'));
        }
    }

}

export class HelperCommonSession {
    static getProduct() {
        if (localStorage.getItem('item')) {
            return JSON.parse(localStorage.getItem('item'));
        }
    }

}
export const EmailRegex: any = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$";
