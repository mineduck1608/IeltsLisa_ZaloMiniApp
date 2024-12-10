using Microsoft.AspNetCore.Mvc;
using Repositories.Entities;
using Services;
using Services.IServices;

namespace IELTSLISA_ZaloApp_User.Controllers
{
    public class UserVoucherController : Controller
    {
        private readonly IUserVoucherService _service;
        private readonly IVoucherService _serviceVoucher = new VoucherService();
        private readonly IGiftService _serviceGift = new GiftService();
        private readonly IVoucherGiftService _serviceVoucherGift = new VoucherGiftService();

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
            return Ok(new { msg = "Update status success."});
        }

        [HttpPut]
        [Route("UserVoucher/AdminUpdateUserVoucher")]
        public async Task<IActionResult> AdminUserVoucher(string userId, string voucherId, string giftId, string voucherCode)
        {
            var voucher = _serviceVoucher.GetVoucherByid(voucherId);
            var gift = _serviceGift.GetGiftById(giftId);
            var voucherGift = _serviceVoucherGift.FindVoucherGift(voucherId, giftId);
            if(voucher.VoucherCode.ToLower() != voucherCode.ToLower())
            {
                return BadRequest(new { msg = "Voucher code is not correct" });
            }
            if (gift.GiftQuantity < voucherGift.Quantity)
            {
                return BadRequest(new { msg = "Gift is not enough" });
            }
            _service.UpdateUserVoucherStatus(userId, voucherId, giftId, false, DateTime.Now);
            if(gift.GiftQuantity - voucherGift.Quantity == 0)
            {
                _serviceGift.UpdateGift(giftId, gift.GiftName, gift.GiftDescription, gift.GiftQuantity - voucherGift.Quantity, false);
                return Ok(new { msg = "Use voucher success" });
            }
            _serviceGift.UpdateGift(giftId, gift.GiftName, gift.GiftDescription, gift.GiftQuantity - voucherGift.Quantity, gift.GiftStatus);
            return Ok(new { msg = "Use voucher success" });
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
