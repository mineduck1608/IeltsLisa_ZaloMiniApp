import React, { FC } from "react";
import { Divider } from "components/divider";
import { Header, Page } from "zmp-ui";
import { CartItems } from "./cart-items";
import { CartPreview } from "./preview";
import { TermsAndPolicies } from "./term-and-policies";
import { Delivery } from "./delivery";
import { useVirtualKeyboardVisible } from "hooks";
import { Welcome } from "pages/index/welcome";
import { MenuOutline, SearchIcon } from "icon";
import { Sizebar } from "components/sizebar";

const CartPage: FC = () => {
  const keyboardVisible = useVirtualKeyboardVisible();

  return (
    <Page className="flex flex-col">
      <div className="flex">
        <Welcome title={"IELTS LISA - Quản trị"} />
      </div>
      <Sizebar />
      <div className="topbar">
        <div className="toggle">
          <MenuOutline />
        </div>
        <div className="search">
          <label>
            <SearchIcon className="search-icon" />
            <input type="text" placeholder="Search here" />
          </label>
        </div>
      </div>
      {/* <Divider size={12} /> */}
      {/* {!keyboardVisible && <CartPreview />} */}
    </Page>
  );
};

export default CartPage;
