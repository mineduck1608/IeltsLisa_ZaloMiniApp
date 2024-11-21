import { followOA } from "zmp-sdk/apis";
import { interactOA } from "zmp-sdk/apis";

interactOA({
  oaId: "434239304720556841",
  success: () => {
  },
  fail: (err) => {
    console.log(err)
  },
});

const follow = async () => {
  try {
    interactOA
    await followOA({
      id: "4342393047205568841",
    });
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error);
  }
};

export default follow