using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Repositories.Entities;
using Services.IServices;
using System.Numerics;

namespace IELTSLISA_ZaloApp_User.Controllers
{
    public class ConcernController : Controller
    {
        private readonly IConcernService _service;

        public ConcernController(IConcernService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("Concern/GetAll")]
        public async Task<ActionResult<IEnumerable<Concern>>> GetAllConcerns() => Ok(_service.GetAllConcerns());

        [HttpGet]
        [Route("Concern/GetConcernById")]
        public async Task<ActionResult<Concern>> GetConcernById(string concernId)
        {
            var concern = _service.GetConcernById(concernId);

            if (concern == null)
            {
                return NotFound(); // Trả về 404 nếu không tìm thấy concern
            }

            return Ok(concern); // Trả về 200 nếu tìm thấy concern
        }

        [HttpPost]
        [Route("Concern/AddNewConcern")]
        public async Task<IActionResult> AddNewConcern(string userId, string classId)
        {
            _service.AddConcern(new Concern
            {
                ConcernId = "CC" + (_service.GetAllConcerns().Count + 1).ToString(),
                UserId = userId,
                ClassId = classId,
                ConcernStatus = false
            });
            return Ok(new { msg = "Add new concern success." });
        }

        [HttpPut]
        [Route("Concern/UpdateConcernStatus")]
        public async Task<IActionResult> UpdateConcernStatus(string concernId) 
        { 
            Concern concern = _service.GetConcernById(concernId);
            if (concern == null)
            {
                return NotFound(new { msg = "Not found concern" });
            }

            _service.UpdateConcernStatus(concernId);
            return Ok(new { msg = "Update concern success." });
        }
    }
}
