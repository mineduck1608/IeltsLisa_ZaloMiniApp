using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IVoucherGiftService
    {
        public void AddVoucherGift(VoucherGift voucher);

        public List<VoucherGift> GetAllVoucherGifts();

        public void UpdateVoucherGift(string voucherId, string giftId, int quantity);

        public VoucherGift FindVoucherGift(string voucherId, string giftId);

        public VoucherGift RandomVoucherGift(string voucherId);
    }
}
