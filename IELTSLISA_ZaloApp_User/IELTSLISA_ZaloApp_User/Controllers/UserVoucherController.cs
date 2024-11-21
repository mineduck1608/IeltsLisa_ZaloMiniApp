using Microsoft.AspNetCore.Mvc;
using Repositories.Entities;
using Services.IServices;

namespace IELTSLISA_ZaloApp_User.Controllers
{
    public class UserVoucherController : Controller
    {
        private readonly IUserVoucherService _service;

        public UserVoucherController(IUserVoucherService service)
        {
            _service = service;
        }

        [HttpPost]
        [Route("UserVoucher/AddUserVoucher")]
        public async Task<IActionResult> AddUserVoucher(string voucherId, string userId, DateTime expireDate)
        {

            _service.AddUserVoucher( new UserVoucher
            {
                VoucherId = voucherId,
                UserId = userId,
                ExpireDate = expireDate,
                UserVoucherStatus = true
            });
            return Ok(new { msg = "Add new user voucher success." });
        }

        [HttpGet]
        [Route("UserVoucher/GetVoucherByUserId")]
        public async Task<ActionResult<IEnumerable<UserVoucher>>> GetVoucherByUserId(string id) => Ok(_service.GetVoucherByUserId(id));

        [HttpPut]
        [Route("UserVoucher/Update")]
        public async Task<IActionResult> UpdateUserVoucherStatus(string userId, string voucherId, bool status)
        {
            _service.UpdateUserVoucherStatus(userId, voucherId, status);
            return Ok(new { msg = "Update status success."});
        }
    }
}
