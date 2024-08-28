export type QueryObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type Tlogin = {
  loginWithGoogle:boolean;
  email: string;
  password: string;
};
export type TchangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
export type TresetPassword = {
  newPassword: string;
  confirmPassword: string;
};

export interface ISignInWithGoogle {
  email: string;
  name: string;
  role?: string;
  registerWith:string;
};