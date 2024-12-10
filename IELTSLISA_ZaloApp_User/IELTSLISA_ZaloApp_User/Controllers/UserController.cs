using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Repositories.Entities;
using Services.IServices;


namespace IELTSLISA_ZaloApp_User.Controllers

{
    public class UserController : Controller
    {
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("User/GetAll")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers() => Ok(_service.GetAllUsers());

        [HttpPost]
        [Route("User/AddNewUser")]
        public async Task<IActionResult> AddNewUser(string userId, string userName, string phone)
        {
            // Kiểm tra xem người dùng có tồn tại với số điện thoại đã cho không
            User user = _service.GetUserById(userId);
            if (user != null)
            {
                if (!userId.IsNullOrEmpty())
                    user.UserId = userId;
                if (!userName.IsNullOrEmpty())
                    user.UserName = userName;
                if (!phone.IsNullOrEmpty())
                    user.Phone = phone;
                _service.UpdateUser(user, userId);
                return Ok(new { msg = "Update new user info success" });
            }

            // Thêm người dùng mới
            var newUser = new User
            {
                UserId = userId,
                UserName = userName,
                Phone = phone
            };

            // Gọi phương thức AddUser bất đồng bộ để thêm người dùng mới vào cơ sở dữ liệu
            _service.AddUser(newUser);

            // Trả về Ok nếu thêm thành công
            return Ok(new { msg = "Add new user success" });
        }


        [HttpGet]
        [Route("User/GetUserByPhone")]
        public async Task<ActionResult<IEnumerable<User>>> GetUserByPhone(string phone)
        {
            var users = _service.GetUserByPhone(phone);

            if (users == null)
            {
                return NotFound();  // Trả về 404 nếu không có người dùng nào
            }

            return Ok(users);  // Trả về 200 nếu có người dùng tìm thấy
        }

        [HttpDelete]
        [Route("User/DeleteUser")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            _service.DeleteUser(userId);
            return Ok(new { msg = "Delete user success." });
        }
    }
}
