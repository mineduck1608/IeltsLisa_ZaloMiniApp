using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Repositories.Entities;
using Services.IServices;

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
        public async Task<IActionResult> AddNewUser(string giftName, string? giftDescription, int? giftQuanity)
        {
            _service.AddGift(new Gift
            {
                GiftId = "G" + (_service.GetAllGifts().Count + 1).ToString(),
                GiftName = giftName,
                GiftDescription = giftDescription,
                GiftQuantity = giftQuanity,
                GiftStatus = true,
                IsDelete = false
            });
            return Ok(new { msg = "Add new user success." });
        }

        [HttpPut]
        [Route("Gift/UpdateGift")]
        public async Task<IActionResult> UpdateGift(string giftId, string giftName, string? giftDescription, int? giftQuantity)
        {
            bool giftStatus = true;
            Gift gift = _service.GetGiftById(giftId);
            if (!giftName.IsNullOrEmpty())
                gift.GiftName = giftName;
            if (!giftDescription.IsNullOrEmpty())
                gift.GiftDescription = giftDescription;
            if (!giftQuantity.ToString().IsNullOrEmpty())
                gift.GiftQuantity = giftQuantity;
            if (giftQuantity == 0)
                giftStatus = false;
            _service.UpdateGift(giftId, giftName, giftDescription, giftQuantity, giftStatus);
            return Ok(new { msg = "Update gift success." });
        }

        [HttpDelete]
        [Route("Gift/DeleteGift")]
        public async Task<IActionResult> DeleteGift(string giftId)
        {
            _service.DeleteGift(giftId);
            return Ok(new { msg = "Delete gift success." });
        }
    }
}
