using Services;
using Services.IServices;

namespace IELTSLISA_ZaloApp_User.Controllers
{
    public class VoucherGiftController
    {
        private readonly IVoucherGiftService _service;

        public VoucherGiftController(IVoucherGiftService service)
        {
            _service = service;
        }
    }
}
