export interface User {
    name: string;
    password: string;
    email: string;
    address:string;
    contact:{
        phoneNumber:string,
        isverified:Boolean,

    }
    isAdmin:Boolean

}
export interface userDetails {
    name: string;
    email: string;
    rollNumber: string;
}
