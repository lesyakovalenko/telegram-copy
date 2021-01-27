export interface ILogin {
    email: string;
    password: string;
}

export interface IRegister {
    nickName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface IFormStatus {
    message: string
    type: string
}

export interface IFormStatusProps {
    [key: string]: IFormStatus
}

