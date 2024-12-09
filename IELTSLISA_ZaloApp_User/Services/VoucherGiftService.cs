using Repositories;
using Repositories.Entities;
using Services.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class VoucherGiftService : IVoucherGiftService
    {
        private readonly VoucherGiftRepository _repo = null;

        public VoucherGiftService()
        {
            if (_repo == null)
                _repo = new VoucherGiftRepository();
        }

        public void AddVoucherGift(VoucherGift voucher) => _repo.Add(voucher);

        public List<VoucherGift> GetAllVoucherGifts() => _repo.GetAll();

        public void UpdateVoucherGift(string voucherId, string giftId, int quantity) => _repo.Update(voucherId, giftId, quantity);

        public VoucherGift FindVoucherGift(string voucherId, string giftId) => _repo.FindVoucherGift(voucherId, giftId);

        public VoucherGift RandomVoucherGift(string voucherId)
        {
            var gifts = _repo.RandomVoucherGift(voucherId);

            if (gifts == null || !gifts.Any())
            {
                return null; // Không tìm thấy phần quà nào cho voucher này.
            }

            // Tạo một đối tượng Random để chọn ngẫu nhiên phần quà
            var random = new Random();

            // Chọn một phần quà ngẫu nhiên
            var selectedGift = gifts[random.Next(gifts.Count)];

            // Trả về phần quà ngẫu nhiên trong một danh sách
            return selectedGift;
        }

        public VoucherGift GetVoucherGift(string voucherId)
        {
            var gifts = _repo.GetVoucherGift(voucherId);

            if (gifts == null)
            {
                return null; // Không tìm thấy phần quà nào cho voucher này.
            }

            return gifts;

        }
    }
}
