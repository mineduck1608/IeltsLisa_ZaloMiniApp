using Services.IServices;
using Microsoft.AspNetCore.Mvc;
using Repositories.Entities;
using Microsoft.IdentityModel.Tokens;
using System;

namespace IELTSLISA_ZaloApp_User.Controllers
{
    public class InformationController : Controller
    {
        private readonly IInformationService _service;

        public InformationController(IInformationService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("Information/GetAll")]
        public async Task<ActionResult<IEnumerable<Information>>> GetAllInformations() => Ok(_service.GetAllInformations());


        [HttpGet]
        [Route("Information/GetInformationById")]
        public async Task<ActionResult<IEnumerable<Information>>> GetInformationById(string infoId)
        {
            var info = _service.GetInformationById(infoId);

            if (info == null)
            {
                return NotFound();  // Trả về 404 nếu không có người dùng nào
            }

            return Ok(info);  // Trả về 200 nếu có người dùng tìm thấy
        }

        [HttpPost]
        [Route("Information/AddNewInformation")]
        public async Task<IActionResult> AddNewInformation([FromBody] dynamic request)
        {
            try
            {
                // Trích xuất các trường từ JsonElement
                var infoName = request.GetProperty("infoName").GetString();
                var infoImg = request.GetProperty("infoImg").GetString();
                var infoContent = request.GetProperty("infoContent").GetString();

                // Kiểm tra xem thông tin có đầy đủ không
                if (string.IsNullOrEmpty(infoName) || string.IsNullOrEmpty(infoImg) || string.IsNullOrEmpty(infoContent))
                {
                    return BadRequest(new { msg = "Tất cả các trường đều là bắt buộc!" });
                }

                string randomId = Guid.NewGuid().ToString("N");
                // Thêm thông tin vào cơ sở dữ liệu
                _service.AddInformation(new Information
                {
                    InfoId = randomId,
                    InfoName = infoName,
                    InfoImg = infoImg,
                    InfoContent = infoContent
                });

                // Phản hồi thành công
                return Ok(new { msg = "Add new information success." });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpDelete]
        [Route("Information/DeleteInformation")]
        public async Task<IActionResult> DeleteInformation(string informationId)
        {
            _service.DeleteInformation(informationId);
            return Ok(new { msg = "Delete information success." });
        }


        [HttpPut]
        [Route("Information/UpdateInformation/{infoId}")]
        public async Task<IActionResult> UpdateInformation(string infoId, [FromBody] dynamic request)
        {
            try
            {
                // Kiểm tra nếu ID không hợp lệ
                if (string.IsNullOrEmpty(infoId))
                {
                    return BadRequest(new { msg = "ID của thông tin không được để trống!" });
                }

                // Lấy thông tin hiện tại từ cơ sở dữ liệu
                Information info = _service.GetInformationById(infoId);

                if (info == null)
                {
                    return NotFound(new { msg = "Không tìm thấy thông tin cần cập nhật!" });
                }

                // Trích xuất thông tin từ body (request)
                var infoName = request.GetProperty("infoName")?.GetString();
                var infoImg = request.GetProperty("infoImg")?.GetString();
                var infoContent = request.GetProperty("infoContent")?.GetString();

                // Cập nhật từng trường nếu chúng không null hoặc rỗng
                if (!string.IsNullOrEmpty(infoName))
                {
                    info.InfoName = infoName;
                }
                if (!string.IsNullOrEmpty(infoImg))
                {
                    info.InfoImg = infoImg;
                }
                if (!string.IsNullOrEmpty(infoContent))
                {
                    info.InfoContent = infoContent;
                }

                // Cập nhật thông tin trong cơ sở dữ liệu
                _service.UpdateInformation(info, infoId);

                // Phản hồi thành công
                return Ok(new { msg = "Cập nhật thông tin thành công." });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi
                return StatusCode(500, new { error = ex.Message });
            }
        }

    }
}
