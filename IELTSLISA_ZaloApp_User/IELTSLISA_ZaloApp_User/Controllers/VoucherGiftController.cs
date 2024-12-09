using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Repositories.Entities;
using Services;
using Services.IServices;

namespace IELTSLISA_ZaloApp_User.Controllers
{
    public class VoucherGiftController : Controller
    {
        private readonly IVoucherGiftService _service;
        private readonly IVoucherService _voucherService = new VoucherService();
        private readonly IGiftService _giftService = new GiftService();

        public VoucherGiftController(IVoucherGiftService service)
        {
            _service = service;
        }


        [HttpGet]
        [Route("VoucherGift/GetAll")]
        public IActionResult GetAllVoucherGifts()
        {
            // Giả sử _service.GetAllVoucherGifts() trả về một Func<List<VoucherGift>>
            var voucherGiftsFunc = _service.GetAllVoucherGifts();  // Đây là một Func<List<VoucherGift>>

            // Lấy kết quả thực tế từ Func (danh sách thực tế)
            var voucherGifts = voucherGiftsFunc; // Lấy List<VoucherGift>

            // Trả về danh sách mà không cần tuần tự hóa JSON
            return new JsonResult(voucherGifts); // Dùng JsonResult nếu bạn muốn trả về kết quả mà không cần tuần tự hóa tự động
        }


        [HttpPost]
        [Route("VoucherGift/AddVoucherGift")]
        public async Task<IActionResult> AddNewVoucherGift(string voucherId, string giftId, int quantity)
        {
            var getVoucher = _voucherService.GetVoucherByid(voucherId);
            var getGift = _giftService.GetGiftById(giftId);
            var voucherGift = _service.FindVoucherGift(voucherId, giftId);
            if(voucherGift != null)
            {
                return BadRequest(new { msg = "Voucher gift is exist" });
            }
            if (getVoucher == null)
            {
                return BadRequest(new { msg = "Voucher is not exist" });
            }
            
            if(getGift == null)
            {
                return BadRequest(new { msg = "Gift is not exist" });
            }

            if(quantity > getGift.GiftQuantity)
            {
                return BadRequest(new { msg = "Quantity of gift is not enough" });
            }

            var newVoucherGift = new VoucherGift
            {
                VoucherId = voucherId,
                GiftId = giftId,
                Quantity = quantity
            };

            _service.AddVoucherGift(newVoucherGift);

            // Trả về Ok nếu thêm thành công
            return Ok(new { msg = "Add new voucher gift success." });
        }

        [HttpPut]
        [Route("VoucherGift/UpdateVoucherGift")]
        public async Task<IActionResult> UpdateVoucherGift(string voucherId, string giftId, int quantity)
        {
            VoucherGift voucherGift = _service.FindVoucherGift(voucherId, giftId);
            var getGift = _giftService.GetGiftById(giftId);
            if (quantity > getGift.GiftQuantity)
            {
                return BadRequest(new { msg = "Quantity of gift is not enough" });
            }
            if (!voucherId.IsNullOrEmpty())
                voucherGift.VoucherId = voucherId;
            if (!giftId.IsNullOrEmpty())
                voucherGift.GiftId = giftId;
            if (!quantity.ToString().IsNullOrEmpty())
                voucherGift.Quantity = quantity;
            _service.UpdateVoucherGift(voucherGift.VoucherId, voucherGift.GiftId = giftId,  voucherGift.Quantity = quantity);
            return Ok(new { msg = "Update voucher gift success." });
        }

        [HttpGet]
        [Route("VoucherGift/GetRandomGift")]
        public async Task<IActionResult> RandomVoucherGift(string voucherId)
        {
            var voucherGift = _service.RandomVoucherGift(voucherId);
            if(voucherGift == null)
            {
                return NotFound("Voucher is not exist");
            }
            var gift = _giftService.GetGiftById(voucherGift.GiftId);
            if (gift == null)
            {
                return NotFound("Can not found gift");
            }
            if(gift.GiftQuantity == 0)
            {
                return BadRequest(new { msg = "Out of gifts" });
            }

            return Ok(gift);
        }

        [HttpGet]
        [Route("VoucherGift/GetVoucherGift")]
        public async Task<IActionResult> GetVoucherGift(string voucherId)
        {
            var voucherGift = _service.GetVoucherGift(voucherId);
            if (voucherGift == null)
            {
                return NotFound("Voucher is not exist");
            }
            var gift = _giftService.GetGiftById(voucherGift.GiftId);
            if (gift == null)
            {
                return NotFound("Can not found gift");
            }
            if (gift.GiftQuantity == 0)
            {
                return BadRequest(new { msg = "Out of gifts" });
            }

            return Ok(gift);
        }
    }
}
