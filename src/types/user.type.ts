export interface User {
    name: string;
    password: string;
    rollNumber: {
      type:number,
      required:boolean
    };
    email:string,
    resetLink:{
      type:string,
      default:' '
    }
  }