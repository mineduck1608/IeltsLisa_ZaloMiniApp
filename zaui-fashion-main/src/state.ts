import { atom } from "jotai";
import { atomFamily, unwrap } from "jotai/utils";
import { Cart, Category, Color, Class, UserInfo, GetSetting, Voucher, Information, Feedback } from "../src/types";
import { requestWithFallback } from "@/utils/request";
import { getUserInfo } from "zmp-sdk";

export const userState = atom(() =>
  getUserInfo({
    avatarType: "normal",
  })
);

export const bannersState = atom(() =>
  requestWithFallback<string[]>("/banners", [])
);

export const tabsState = atom(["Tất cả", "Feedback", "Ưu đãi"]);

export const selectedTabIndexState = atom(0);

export const categoriesState = atom(() =>
  requestWithFallback<Category[]>("/categories", [])
);

export const categoriesStateUpwrapped = unwrap(
  categoriesState,
  (prev) => prev ?? []
);

export const productsState = atom(async (get) => {
  const categories = await get(categoriesState);
  const products = await requestWithFallback<
    (Class & { categoryId: number })[]
  >("/products", []);
  return products.map((product) => ({
    ...product,
    category: categories.find(
      (category) => category.id === product.categoryId
    )!,
  }));
});


export const flashSaleProductsState = atom((get) => get(productsState));

export const classAtom = atom<Class[]>([]);

export const recommendedProductsState = atom((get) => get(classAtom));

export const sizesState = atom(["S", "M", "L", "XL"]);

export const selectedSizeState = atom<string | undefined>(undefined);

export const colorsState = atom<Color[]>([
  {
    name: "Đỏ",
    hex: "#FFC7C7",
  },
  {
    name: "Xanh dương",
    hex: "#DBEBFF",
  },
  {
    name: "Xanh lá",
    hex: "#D1F0DB",
  },
  {
    name: "Xám",
    hex: "#D9E2ED",
  },
]);

export const selectedColorState = atom<Color | undefined>(undefined);

export const productState = atomFamily((id: string) =>
  atom(async (get) => {
    const products = await get(productsState);
    return products.find((product) => product.classId === id);
  })
);



export const cartState = atom<Cart>([]);

export const cartTotalState = atom((get) => {
  return null;
});


export const userInfoAtom = atom<UserInfo | null>(null);

export const voucherAtom = atom<Voucher[]>([]);

export const informationAtom = atom<Information[]>([]);

export const feedbackAtom = atom<Feedback[]>([]);

export const userGetSetting = atom<GetSetting| null>(null);

export const selectedCartItemIdsState = atom<number[]>([]);

export const keywordState = atom("");

export const searchResultState = atom(async (get) => {
  const keyword = get(keywordState);
  const products = await get(classAtom);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return products.filter((product) =>
    product.className.toLowerCase().includes(keyword.toLowerCase())
  );
});
