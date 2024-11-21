import { authorize } from "zmp-sdk/apis";

const authorizeUser = async () => {
  try {
    const data = await authorize({
      scopes: ["scope.userLocation", "scope.userPhonenumber"],
    });
    console.log(data);
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error);
  }
};

export default authorizeUser;