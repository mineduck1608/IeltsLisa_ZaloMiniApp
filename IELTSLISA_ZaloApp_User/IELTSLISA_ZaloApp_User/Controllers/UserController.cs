using Microsoft.AspNetCore.Mvc;
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
            _service.AddUser(new User
            {
                UserId = userId,
                UserName = userName,
                Phone = phone
            });
            return Ok(new { msg = "Add new user success." });
        }

        [HttpGet]
        [Route("User/GetUserByPhone")]
        public async Task<ActionResult<IEnumerable<User>>> GetUserByPhone(string phone) => Ok(_service.GetUserByPhone(phone));
    }
}
