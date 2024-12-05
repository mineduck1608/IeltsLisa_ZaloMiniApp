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

        [HttpGet]
        [Route("UserVoucher/GetAll")]
        public async Task<ActionResult<IEnumerable<UserVoucher>>> GetAllUserVouchers() => Ok(_service.GetAllUserVouchers());


        [HttpPost]
        [Route("UserVoucher/AddUserVoucher")]
        public async Task<IActionResult> AddUserVoucher(string voucherId, string userId, string giftId)
        {

            _service.AddUserVoucher( new UserVoucher
            {
                VoucherId = voucherId,
                UserId = userId,
                GiftId = giftId,
                UserVoucherStatus = true
            });
            return Ok(new { msg = "Add new user voucher success." });
        }

        [HttpGet]
        [Route("UserVoucher/GetVoucherByUserId")]
        public async Task<ActionResult<IEnumerable<UserVoucher>>> GetVoucherByUserId(string id) 
        {
            return Ok(_service.GetVoucherByUserId(id));
        }
        

        [HttpPut]
        [Route("UserVoucher/Update")]
        public async Task<IActionResult> UpdateUserVoucherStatus(string userId, string voucherId, string giftId, bool status)
        {
            _service.UpdateUserVoucherStatus(userId, voucherId, giftId, status);
            return Ok(new { msg = "Update status success."});
        }

        [HttpDelete]
        [Route("UserVoucher/Delete")]
        public async Task<IActionResult> Delete(string userId, string voucherId, string giftId)
        {
            _service.RemoveUserVoucher(userId, voucherId, giftId);
            return Ok(new { msg = "Remove success." });
        }
    }
}
