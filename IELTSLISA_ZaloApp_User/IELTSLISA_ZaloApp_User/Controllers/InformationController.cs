using Services.IServices;
using Microsoft.AspNetCore.Mvc;
using Repositories.Entities;

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
        public async Task<IActionResult> AddNewInformation(string infoName, string infoImg, string infoContent)
        {
            _service.AddInformation(new Information
            {
                InfoId = "I" + (_service.GetAllInformations().Count + 1).ToString(),
                InfoName = infoName,
                InfoImg = infoImg,
                InfoContent = infoContent
            });
            return Ok(new { msg = "Add new information success." });
        }
    }
}
