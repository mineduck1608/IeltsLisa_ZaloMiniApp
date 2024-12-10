export interface Class {
  classId: string,
  className: string,
  classContent: string,
  classImg: string
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: Category;
  details?: Detail[];
  sizes?: Size[];
  colors?: Color[];
}

export interface Voucher {
  voucherId: string;
  voucherCode: string;
  voucherName: string;
  voucherDescription: string;
  startDate: datetime;
  endDate: datetime;
  voucherStatus: boolean;
  quantity: number;
}


export interface Information {
  infoId: string;
  infoName: string;
  infoImg: string;
  infoContent: string
}

export interface Feedback {
  fbId: string;
  fbTitle: string;
  fbContent: string;
  fbName: string;
  fbClass: string;
  fbPic: string
}


export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Detail {
  title: string;
  content: string;
}
export type Size = string;

export interface Color {
  name: string;
  hex: string;
}

export type SelectedOptions = {
  size?: Size;
  color?: Color["name"];
};

export interface CartItem {
  userId: string;
  voucherId: string;
  userVoucherStatus: boolean;
  giftId: string;
}

export type Cart = CartItem[];

export type UserInfo = {
  id: string;
  name: string;
  avatar: string;
  idByOA?: string;
  isSensitive?: boolean;
  followedOA?: boolean;
};

export type UserVoucher = {
  voucherId: string;
  giftId: string;
  voucherName: string;
  giftName: string;
  endDate: datetime
};

export type GetSetting = {
  userInfo?: boolean;
  userPhonenumber?: boolean;
}