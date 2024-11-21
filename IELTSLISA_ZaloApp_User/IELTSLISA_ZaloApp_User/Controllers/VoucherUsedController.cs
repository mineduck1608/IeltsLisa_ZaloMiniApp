using Services.IServices;

namespace IELTSLISA_ZaloApp_User.Controllers
{
    public class VoucherUsedController
    {
        private readonly IVoucherUsedService _service;

        public VoucherUsedController(IVoucherUsedService service)
        {
            _service = service;
        }
    }
}
