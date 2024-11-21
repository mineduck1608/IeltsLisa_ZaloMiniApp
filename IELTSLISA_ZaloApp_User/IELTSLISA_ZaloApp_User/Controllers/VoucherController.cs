using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Repositories.Entities;
using Services.IServices;

namespace IELTSLISA_ZaloApp_User.Controllers
{
    public class VoucherController : Controller
    {
        private readonly IVoucherService _service;

        public VoucherController(IVoucherService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("Voucher/GetAll")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllVouchers() => Ok(_service.GetAllVouchers());

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
                VoucherStatus = true,
                IsDelete = false
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
    }
}
