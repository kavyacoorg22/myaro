export interface ICustomerViewProfileOutput {
  fullName: string;
  userName: string;
  profileImg?:string
}

export interface ICustomerEditProfileInput{
  fullName?:string,
  userName?:string
}