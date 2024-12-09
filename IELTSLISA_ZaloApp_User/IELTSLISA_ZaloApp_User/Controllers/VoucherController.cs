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
        public async Task<ActionResult<IEnumerable<Voucher>>> GetAllVouchers() => Ok(_service.GetAllVouchers());

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
        public async Task<IActionResult> AddNewVoucher(string voucherCode, string voucherName, string voucherDescription, DateTime startDate, DateTime endDate)
        {
            _service.AddVoucher(new Voucher
            {
                VoucherId = "VC" + (_service.GetAllVouchers().Count + 1).ToString(),
                VoucherCode = voucherCode,
                VoucherName = voucherName,
                VoucherDescription = voucherDescription,
                StartDate = startDate,
                EndDate = endDate,
                VoucherStatus = true
            });
            return Ok(new { msg = "Add new voucher success." });
        }

        [HttpPut]
        [Route("Voucher/UpdateVoucher")]
        public async Task<IActionResult> UpdateVoucher(string voucherId, string? voucherCode, string? voucherName, string? voucherDescription, DateTime startDate, DateTime endDate)
        {
            Voucher voucher = _service.GetVoucherByid(voucherId);
            if (!voucherCode.IsNullOrEmpty())
                voucher.VoucherCode = voucherCode;
            if (!voucherName.IsNullOrEmpty())
                voucher.VoucherName = voucherName;
            if (!voucherDescription.IsNullOrEmpty())
                voucher.VoucherDescription = voucherDescription;
            if (!startDate.ToString().IsNullOrEmpty())
                voucher.StartDate = startDate;
            if (!endDate.ToString().IsNullOrEmpty())
                voucher.EndDate = endDate;
            if (startDate > endDate)
                return Ok(new { msg = "Start date must be before end date." });         
            _service.UpdateVoucher(voucher, voucherId);
            return Ok(new { msg = "Add new voucher success." });
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
    }
}
