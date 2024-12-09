using Microsoft.AspNetCore.Mvc;
using Repositories.Entities;
using Services.IServices;

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
        public async Task<IActionResult> AddNewFeedback(string feedbackTile, string feedbackContent, string feedbackName, string feedbackClass, string feedbackPic)
        {
            _service.AddFeedback(new Feedback
            {
                FbId = "FB" + (_service.GetAllFeedbacks().Count + 1).ToString(),
                FbTitle = feedbackTile,
                FbContent = feedbackContent,
                FbName = feedbackName,
                FbClass = feedbackClass,
                FbPic = feedbackPic
            });
            return Ok(new { msg = "Add new feedback success." });
        }

    }
}
