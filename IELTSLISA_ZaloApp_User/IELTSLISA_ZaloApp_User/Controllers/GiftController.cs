using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Repositories.Entities;
using Services.IServices;
using System;

namespace IELTSLISA_ZaloApp_User.Controllers
{
    public class GiftController : Controller
    {
        private readonly IGiftService _service;

        public GiftController(IGiftService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("Gift/GetAll")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllGifts() => Ok(_service.GetAllGifts());

        [HttpPost]
        [Route("Gift/AddNewGift")]
        public async Task<IActionResult> AddNewGift([FromBody] dynamic request)
        {
            try
            {
                // Trích xuất các trường từ JsonElement
                var giftName = request.GetProperty("giftName")?.GetString();
                var giftDescription = request.GetProperty("giftDescription")?.GetString();
                var giftQuantity = request.GetProperty("giftQuantity")?.GetInt32();

                // Kiểm tra xem thông tin có đầy đủ không
                if (string.IsNullOrEmpty(giftName) || giftQuantity == null)
                {
                    return BadRequest(new { msg = "giftName và giftQuantity là các trường bắt buộc!" });
                }

                // Tạo ID ngẫu nhiên cho quà tặng
                string randomId = Guid.NewGuid().ToString("N");

                // Thêm quà tặng vào cơ sở dữ liệu
                _service.AddGift(new Gift
                {
                    GiftId = randomId,
                    GiftName = giftName,
                    GiftDescription = giftDescription,
                    GiftQuantity = giftQuantity,
                    GiftStatus = true
                });

                // Phản hồi thành công
                return Ok(new { msg = "Thêm quà tặng thành công." });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpPut]
        [Route("Gift/UpdateGift/{giftId}")]
        public async Task<IActionResult> UpdateGift(string giftId, [FromBody] dynamic request)
        {
            try
            {
                // Kiểm tra nếu ID không hợp lệ
                if (string.IsNullOrEmpty(giftId))
                {
                    return BadRequest(new { msg = "ID của quà tặng không được để trống!" });
                }

                // Lấy thông tin hiện tại từ cơ sở dữ liệu
                Gift gift = _service.GetGiftById(giftId);

                if (gift == null)
                {
                    return NotFound(new { msg = "Không tìm thấy quà tặng cần cập nhật!" });
                }

                // Trích xuất thông tin từ body (request)
                var giftName = request.GetProperty("giftName")?.GetString();
                var giftDescription = request.GetProperty("giftDescription")?.GetString();
                var giftQuantity = request.GetProperty("giftQuantity")?.GetInt32();

                // Cập nhật từng trường nếu chúng không null hoặc rỗng
                if (!string.IsNullOrEmpty(giftName))
                {
                    gift.GiftName = giftName;
                }
                if (!string.IsNullOrEmpty(giftDescription))
                {
                    gift.GiftDescription = giftDescription;
                }
                if (giftQuantity != null)
                {
                    gift.GiftQuantity = giftQuantity;
                }

                // Cập nhật thông tin trong cơ sở dữ liệu
                _service.UpdateGift(gift, giftId);

                // Phản hồi thành công
                return Ok(new { msg = "Cập nhật quà tặng thành công." });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpDelete]
        [Route("Gift/DeleteGift")]
        public async Task<IActionResult> DeleteGift(string giftId)
        {
            _service.DeleteGift(giftId);
            return Ok(new { msg = "Delete gift success." });
        }

        [HttpGet]
        [Route("Gift/GetGiftById")]
        public async Task<ActionResult<IEnumerable<Gift>>> GetGiftById(string giftId)
        {
            var gift = _service.GetGiftById(giftId);

            if (gift == null)
            {
                return NotFound();  // Trả về 404 nếu không có người dùng nào
            }

            return Ok(gift);  // Trả về 200 nếu có người dùng tìm thấy
        }
    }
}
