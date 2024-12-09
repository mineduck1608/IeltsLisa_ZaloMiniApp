using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Repositories.Entities;
using Services.IServices;
using System.Numerics;

namespace IELTSLISA_ZaloApp_User.Controllers
{
    public class ClassController : Controller
    {
        private readonly IClassService _service;

        public ClassController(IClassService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("Class/GetAll")]
        public async Task<ActionResult<IEnumerable<Class>>> GetAllClasses() => Ok(_service.GetAllClass());

        [HttpGet]
        [Route("Class/GetClassById")]
        public async Task<ActionResult<Class>> GetClassById(string classId)
        {
            var cls = _service.GetClassById(classId);

            if (cls == null)
            {
                return NotFound(); // Trả về 404 nếu không tìm thấy lớp
            }

            return Ok(cls); // Trả về 200 nếu tìm thấy lớp
        }

        [HttpPost]
        [Route("Class/AddNewClass")]
        public async Task<IActionResult> AddNewClass(string className, string classContent, string classImg)
        {
            _service.AddClass(new Class
            {
                ClassId = "CL" + (_service.GetAllClass().Count + 1).ToString(),
                ClassName = className,
                ClassContent = classContent,
                ClassImg = classImg
            });
            return Ok(new { msg = "Add new class success." });
        }

        [HttpPut]
        [Route("Class/UpdateClass")]
        public async Task<IActionResult> UpdateClass(string classId, string className, string classContent, string classImg)
        {
            Class cl = _service.GetClassById(classId);
            if(cl == null)
            {
                return NotFound(new { msg = "Not found class" });
            }
            if (!className.IsNullOrEmpty())
                cl.ClassName = className;
            if (!classContent.IsNullOrEmpty())
                cl.ClassContent = classContent;
            if (!classImg.IsNullOrEmpty())
                cl.ClassImg = classImg;
            var updateClass = new Class
            {
                ClassName = cl.ClassName,
                ClassContent = cl.ClassContent,
                ClassImg = cl.ClassImg
            };
            _service.UpdateClass(updateClass, classId);
            return Ok(new { msg = "Update class success." });
        }

    }
}
