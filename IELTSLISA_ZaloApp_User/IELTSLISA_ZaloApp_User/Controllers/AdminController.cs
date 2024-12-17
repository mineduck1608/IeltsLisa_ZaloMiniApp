using Services.IServices;
using Microsoft.AspNetCore.Mvc;
using Repositories.Entities;
using BadmintonCourtAPI.Utils;

namespace IELTSLISA_ZaloApp_User.Controllers
{
    public class AdminController : Controller
    {
        private readonly IAdminService _service;

        public AdminController(IAdminService service)
        {
            _service = service;
        }

        [HttpPost]
        [Route("Admin/LoginAuth")]
        public async Task<IActionResult> LoginAuth(string? username, string? password) // Thử nghiệm lại chạy thử nếu ko ổn hoặc văng lỗi thì xài lại hàm đã cmt ở trên
        {
            Admin admin = _service.GetAdminByLogin(username, password);
            if (admin != null)
            {
                return Ok(new { token = Util.GenerateToken(admin.Id, username) });
            }
            return BadRequest(new { msg = "Incorrect username or password" });
        }

        [HttpGet]
        [Route("Admin/GetAll")]
        public async Task<ActionResult<IEnumerable<Admin>>> GetAllAdmin() => Ok(_service.GetAllAdmin());
    }
}

