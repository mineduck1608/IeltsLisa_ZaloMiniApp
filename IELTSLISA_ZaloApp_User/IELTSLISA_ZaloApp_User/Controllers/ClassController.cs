using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Repositories.Entities;
using Services.IServices;
using System.Numerics;
using System;

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
        public async Task<IActionResult> AddNewClass([FromBody] dynamic request)
        {
            try
            {
                // Trích xuất các trường từ JsonElement
                var className = request.GetProperty("className").GetString();
                var classContent = request.GetProperty("classContent").GetString();
                var classImg = request.GetProperty("classImg").GetString();

                // Kiểm tra xem thông tin có đầy đủ không
                if (string.IsNullOrEmpty(className) || string.IsNullOrEmpty(classContent) || string.IsNullOrEmpty(classImg))
                {
                    return BadRequest(new { msg = "Tất cả các trường đều là bắt buộc!" });
                }

                // Tạo ID mới cho lớp học
                string randomClassId = Guid.NewGuid().ToString("N");

                // Thêm lớp học vào cơ sở dữ liệu
                _service.AddClass(new Class
                {
                    ClassId = randomClassId,
                    ClassName = className,
                    ClassContent = classContent,
                    ClassImg = classImg
                });

                // Phản hồi thành công
                return Ok(new { msg = "Add new class success." });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi và trả về phản hồi thích hợp
                return StatusCode(500, new { error = "Đã xảy ra lỗi. Vui lòng thử lại!", detail = ex.Message });
            }
        }


        [HttpPut]
        [Route("Class/UpdateClass/{classId}")]
        public async Task<IActionResult> UpdateClass(string classId, [FromBody] dynamic request)
        {
            try
            {
                // Kiểm tra nếu ID không hợp lệ
                if (string.IsNullOrEmpty(classId))
                {
                    return BadRequest(new { msg = "ID của lớp không được để trống!" });
                }

                // Lấy thông tin hiện tại từ cơ sở dữ liệu
                Class cl = _service.GetClassById(classId);

                if (cl == null)
                {
                    return NotFound(new { msg = "Không tìm thấy lớp cần cập nhật!" });
                }

                // Trích xuất thông tin từ body (request)
                var className = request.GetProperty("className")?.GetString();
                var classImg = request.GetProperty("classImg")?.GetString();
                var classContent = request.GetProperty("classContent")?.GetString();

                // Cập nhật từng trường nếu chúng không null hoặc rỗng
                if (!string.IsNullOrEmpty(className))
                {
                    cl.ClassName = className;
                }
                if (!string.IsNullOrEmpty(classImg))
                {
                    cl.ClassImg = classImg;
                }
                if (!string.IsNullOrEmpty(classContent))
                {
                    cl.ClassContent = classContent;
                }

                // Cập nhật thông tin trong cơ sở dữ liệu
                _service.UpdateClass(cl, classId);

                // Phản hồi thành công
                return Ok(new { msg = "Cập nhật lớp thành công." });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpDelete]
        [Route("Class/DeleteClass")]
        public async Task<IActionResult> DeleteClass(string classId)
        {
            _service.DeleteClass(classId);
            return Ok(new { msg = "Delete class success." });
        }
    }
}
