import { getSetting } from "zmp-sdk/apis";

const getSettings = async () => {
  try {
    const data = await getSetting({});
    console.log(data);
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error);
  }
};

export default getSettings;