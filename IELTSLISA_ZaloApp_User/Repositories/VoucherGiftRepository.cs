using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class VoucherGiftRepository
    {
        private readonly IeltsLisaContext _context = null;

        public VoucherGiftRepository()
        {
            if (_context == null)
            {
                _context = new IeltsLisaContext();
            }
        }

        public VoucherGiftRepository(IeltsLisaContext context)
        {
            _context = context;
        }

        public void Add(VoucherGift voucher)
        {
            _context.VoucherGifts.Add(voucher);
            _context.SaveChanges();
        }

        public List<VoucherGift> GetAll()
        {
            return _context.VoucherGifts
                .Select(vg => new VoucherGift
                {
                    VoucherId = vg.VoucherId,
                    GiftId = vg.GiftId,
                    Quantity = vg.Quantity
                    // Không cần Load Gift và Voucher nếu không cần thiết
                })
                .ToList();
        }


        public VoucherGift FindVoucherGift(string voucherId, string giftiId) => _context.VoucherGifts.FirstOrDefault(x => x.VoucherId == voucherId && x.GiftId == giftiId);


        public void Update(string voucherId, string giftId, int quantity)
        {
            VoucherGift tmp = FindVoucherGift(voucherId, giftId);
            if (tmp != null)
            {
                tmp.VoucherId = voucherId;
                tmp.GiftId = giftId;
                tmp.Quantity = quantity;
                _context.Update(tmp);
                _context.SaveChanges();
            }
        }

        public List<VoucherGift> RandomVoucherGift(string voucherId) => _context.VoucherGifts.Where(x => x.VoucherId == voucherId).ToList();
    }
}
