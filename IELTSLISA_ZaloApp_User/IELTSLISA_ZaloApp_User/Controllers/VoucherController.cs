using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Repositories.Entities;
using Services;
using Services.IServices;


namespace IELTSLISA_ZaloApp_User.Controllers
{
    public class VoucherController : Controller
    {
        private readonly IVoucherService _service;
        private readonly IUserVoucherService _userVoucherService = new UserVoucherService();

        public VoucherController(IVoucherService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("Voucher/GetAll")]
        public async Task<ActionResult<IEnumerable<Voucher>>> GetAllVouchers()
        {
            // Lấy danh sách vouchers từ service
            var vouchers = _service.GetAllVouchers();

            // Kiểm tra và cập nhật status nếu endDate đã qua thời gian hiện tại
            foreach (var voucher in vouchers)
            {
                if (voucher.EndDate < DateTime.Now)
                {
                    _service.UpdateVoucherStatus(voucher.VoucherId);
                }
            }

            return Ok(vouchers);
        }


        [HttpGet]
        [Route("Voucher/GetNotOwnVoucher")]
        public async Task<ActionResult<IEnumerable<Voucher>>> GetNotOwnVouchers(string userId)
        {
            // Lấy danh sách tất cả các voucher
            List<Voucher> allVouchers = _service.GetAllVouchers();

            // Lấy danh sách voucher mà user đã sở hữu
            List<UserVoucher> userOwnedVouchers = _userVoucherService.GetOwnUserVoucherById(userId);

            // Lọc ra những voucher mà user chưa sở hữu
            var notOwnedVouchers = allVouchers
                .Where(v => !userOwnedVouchers.Any(uv => uv.VoucherId == v.VoucherId))
                .ToList();

            return Ok(notOwnedVouchers);
        }


        [HttpPost]
        [Route("Voucher/AddNewVoucher")]
        public async Task<IActionResult> AddNewVoucher([FromBody] dynamic request)
        {
            try
            {
                // Trích xuất các trường từ JsonElement
                var voucherCode = request.GetProperty("voucherCode")?.GetString();
                var voucherName = request.GetProperty("voucherName")?.GetString();
                var voucherDescription = request.GetProperty("voucherDescription")?.GetString();
                var startDateString = request.GetProperty("startDate")?.GetString();
                var endDateString = request.GetProperty("endDate")?.GetString();

                // Chuyển đổi chuỗi ISO 8601 thành đối tượng DateTime
                DateTime? startDate = startDateString != null ? DateTime.Parse(startDateString) : (DateTime?)null;
                DateTime? endDate = endDateString != null ? DateTime.Parse(endDateString) : (DateTime?)null;

                // Kiểm tra xem thông tin có đầy đủ không
                if (string.IsNullOrEmpty(voucherCode) || string.IsNullOrEmpty(voucherName) || startDate == null || endDate == null)
                {
                    return BadRequest(new { msg = "voucherCode, voucherName, startDate và endDate là các trường bắt buộc!" });
                }
                if (startDate > endDate)
                {
                    return BadRequest(new { msg = "Ngày bắt đầu phải đứng trước ngày kết thúc" });
                }


                // Tạo ID ngẫu nhiên cho voucher
                string randomId = Guid.NewGuid().ToString("N");

                // Thêm voucher vào cơ sở dữ liệu
                _service.AddVoucher(new Voucher
                {
                    VoucherId = randomId,
                    VoucherCode = voucherCode,
                    VoucherName = voucherName,
                    VoucherDescription = voucherDescription,
                    StartDate = startDate.Value,
                    EndDate = endDate.Value,
                    VoucherStatus = true
                });

                // Phản hồi thành công
                return Ok(new { msg = "Thêm voucher thành công." });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpPut]
        [Route("Voucher/UpdateVoucher/{voucherId}")]
        public async Task<IActionResult> UpdateVoucher(string voucherId, [FromBody] dynamic request)
        {
            try
            {
                // Kiểm tra nếu ID không hợp lệ
                if (string.IsNullOrEmpty(voucherId))
                {
                    return BadRequest(new { msg = "ID của voucher không được để trống!" });
                }

                // Lấy thông tin hiện tại từ cơ sở dữ liệu
                Voucher voucher = _service.GetVoucherByid(voucherId);

                if (voucher == null)
                {
                    return NotFound(new { msg = "Không tìm thấy voucher cần cập nhật!" });
                }

                // Trích xuất thông tin từ body (request)
                var voucherCode = request.GetProperty("voucherCode")?.GetString();
                var voucherName = request.GetProperty("voucherName")?.GetString();
                var voucherDescription = request.GetProperty("voucherDescription")?.GetString();
                var startDateString = request.GetProperty("startDate")?.GetString();
                var endDateString = request.GetProperty("endDate")?.GetString();

                // Chuyển đổi chuỗi ISO 8601 thành đối tượng DateTime
                DateTime? startDate = startDateString != null ? DateTime.Parse(startDateString) : (DateTime?)null;
                DateTime? endDate = endDateString != null ? DateTime.Parse(endDateString) : (DateTime?)null;

                // Cập nhật từng trường nếu chúng không null hoặc rỗng
                if (!string.IsNullOrEmpty(voucherCode))
                {
                    voucher.VoucherCode = voucherCode;
                }
                if (!string.IsNullOrEmpty(voucherName))
                {
                    voucher.VoucherName = voucherName;
                }
                if (!string.IsNullOrEmpty(voucherDescription))
                {
                    voucher.VoucherDescription = voucherDescription;
                }
                if (startDate.HasValue)
                {
                    voucher.StartDate = startDate.Value;
                }
                if (endDate.HasValue)
                {
                    voucher.EndDate = endDate.Value;
                    if(endDate > DateTime.Now)
                    {
                        voucher.VoucherStatus = true;
                    }
                }

                if (startDate > endDate)
                {
                    return BadRequest(new { msg = "Ngày bắt đầu phải đứng trước ngày kết thúc" });
                }
                

                // Cập nhật thông tin trong cơ sở dữ liệu
                _service.UpdateVoucher(voucher, voucherId);

                // Phản hồi thành công
                return Ok(new { msg = "Cập nhật voucher thành công." });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi
                return StatusCode(500, new { error = ex.Message });
            }
        }


        [HttpGet]
        [Route("Voucher/GetVoucherById")]
        public async Task<ActionResult<IEnumerable<Voucher>>> GetVoucherById(string voucherId)
        {
            var voucher = _service.GetVoucherByid(voucherId);

            if (voucher == null)
            {
                return NotFound();  // Trả về 404 nếu không có người dùng nào
            }

            return Ok(voucher);  // Trả về 200 nếu có người dùng tìm thấy
        }

        [HttpDelete]
        [Route("Voucher/DeleteVoucher")]
        public async Task<IActionResult> DeleteVoucher(string voucherId)
        {
            _service.DeleteVoucher(voucherId);
            return Ok(new { msg = "Delete voucher success." });
        }
    }
}
