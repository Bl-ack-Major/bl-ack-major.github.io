
export enum AccountType {
  GUEST = 'guest',
  RECRUITER = 'recruiter',
  ADMINISTRATOR = 'administrator'
}

export interface Account {
  username: string;
  accountType: AccountType;
  displayName: string;
  loginTime: string;
}
