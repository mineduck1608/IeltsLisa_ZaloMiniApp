using Microsoft.AspNetCore.Mvc;
using Repositories.Entities;
using Services.IServices;
using System;

namespace IELTSLISA_ZaloApp_User.Controllers
{
    public class FeedbackController : Controller
    {
        private readonly IFeedbackService _service;

        public FeedbackController(IFeedbackService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("Feedback/GetAll")]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetAllFeedbacks() => Ok(_service.GetAllFeedbacks());


        [HttpGet]
        [Route("Feedback/GetFeedbackById")]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbackById(string feedbackId)
        {
            var fb = _service.GetFeedbackById(feedbackId);

            if (fb == null)
            {
                return NotFound();  // Trả về 404 nếu không có người dùng nào
            }

            return Ok(fb);  // Trả về 200 nếu có người dùng tìm thấy
        }

        [HttpPost]
        [Route("Feedback/AddNewFeedback")]
        public async Task<IActionResult> AddNewFeedback([FromBody] dynamic request)
        {
            try
            {
                // Trích xuất các trường từ JsonElement
                var fbTitle = request.GetProperty("fbTitle")?.GetString();
                var fbContent = request.GetProperty("fbContent")?.GetString();
                var fbName = request.GetProperty("fbName")?.GetString();
                var fbClass = request.GetProperty("fbClass")?.GetString();
                var fbPic = request.GetProperty("fbPic")?.GetString();

                // Kiểm tra xem các trường có đầy đủ không
                if (string.IsNullOrEmpty(fbTitle) || string.IsNullOrEmpty(fbContent) || string.IsNullOrEmpty(fbName))
                {
                    return BadRequest(new { msg = "FbTitle, FbContent và FbName là các trường bắt buộc!" });
                }

                string randomId = Guid.NewGuid().ToString("N");
                // Thêm feedback vào cơ sở dữ liệu
                _service.AddFeedback(new Feedback
                {
                    FbId = randomId,
                    FbTitle = fbTitle,
                    FbContent = fbContent,
                    FbName = fbName,
                    FbClass = fbClass,
                    FbPic = fbPic
                });

                // Phản hồi thành công
                return Ok(new { msg = "Add new feedback success." });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpPut]
        [Route("Feedback/UpdateFeedback/{feedbackId}")]
        public async Task<IActionResult> UpdateFeedback(string feedbackId, [FromBody] dynamic request)
        {
            try
            {
                // Kiểm tra nếu ID không hợp lệ
                if (string.IsNullOrEmpty(feedbackId))
                {
                    return BadRequest(new { msg = "ID của feedback không được để trống!" });
                }

                // Lấy thông tin feedback hiện tại từ cơ sở dữ liệu
                Feedback feedback = _service.GetFeedbackById(feedbackId);

                if (feedback == null)
                {
                    return NotFound(new { msg = "Không tìm thấy feedback cần cập nhật!" });
                }

                // Trích xuất thông tin từ body (request)
                var fbTitle = request.GetProperty("fbTitle")?.GetString();
                var fbContent = request.GetProperty("fbContent")?.GetString();
                var fbName = request.GetProperty("fbName")?.GetString();
                var fbClass = request.GetProperty("fbClass")?.GetString();
                var fbPic = request.GetProperty("fbPic")?.GetString();

                // Cập nhật từng trường nếu chúng không null hoặc rỗng
                if (!string.IsNullOrEmpty(fbTitle))
                {
                    feedback.FbTitle = fbTitle;
                }
                if (!string.IsNullOrEmpty(fbContent))
                {
                    feedback.FbContent = fbContent;
                }
                if (!string.IsNullOrEmpty(fbName))
                {
                    feedback.FbName = fbName;
                }
                if (!string.IsNullOrEmpty(fbClass))
                {
                    feedback.FbClass = fbClass;
                }
                if (!string.IsNullOrEmpty(fbPic))
                {
                    feedback.FbPic = fbPic;
                }

                // Cập nhật thông tin feedback trong cơ sở dữ liệu
                _service.UpdateFeedback(feedback, feedbackId);

                // Phản hồi thành công
                return Ok(new { msg = "Cập nhật feedback thành công." });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpDelete]
        [Route("Feedback/DeleteFeedback")]
        public async Task<IActionResult> DeleteInformation(string feedbackId)
        {
            _service.DeleteFeedback(feedbackId);
            return Ok(new { msg = "Delete feedback success." });
        }


    }
}
