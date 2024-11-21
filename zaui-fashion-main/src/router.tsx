import Layout from "@/components/layout";
import CartPage from "@/pages/cart";
import ProductListPage from "@/pages/catalog/product-list";
import CategoryListPage from "@/pages/catalog/category-list";
import ProductDetailPage from "@/pages/catalog/product-detail";
import HomePage from "@/pages/home";
import ProfilePage from "@/pages/profile";
import SearchPage from "@/pages/search";
import { createBrowserRouter } from "react-router-dom";
import { getBasePath } from "@/utils/zma";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
          handle: {
            logo: true,
          },
        },
        {
          path: "/categories",
          element: <CategoryListPage />,
          handle: {
            title: "Danh mục ưu đãi",
            back: false,
          },
        },
        {
          path: "/cart",
          element: <CartPage />,
          handle: {
            title: "Kho voucher",
          },
        },
        {
          path: "/profile",
          element: <ProfilePage />,
          handle: {
            logo: true,
          },
        },
        {
          path: "/flash-sales",
          element: <ProductListPage />,
          handle: {
            title: "Flash Sales",
          },
        },
        {
          path: "/category/:id",
          element: <ProductListPage />,
          handle: {
            title: ({ categories, params }) =>
              categories.find((c) => c.id === Number(params.id))?.name,
          },
        },
        {
          path: "/product/:id",
          element: <ProductDetailPage />,
          handle: {
            scrollRestoration: 0, // when user selects another product in related products, scroll to the top of the page
          },
        },
        {
          path: "/search",
          element: <SearchPage />,
          handle: {
            title: "Tìm kiếm",
          },
        },
      ],
    },
  ],
  { basename: getBasePath() }
);

export default router;
