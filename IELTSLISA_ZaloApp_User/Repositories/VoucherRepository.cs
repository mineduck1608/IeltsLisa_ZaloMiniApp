using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class VoucherRepository
    {
        private readonly IeltsLisaContext _context = null;

        public VoucherRepository()
        {
            if (_context == null)
            {
                _context = new IeltsLisaContext();
            }
        }

        public VoucherRepository(IeltsLisaContext context)
        {
            _context = context;
        }

        public void AddVoucher(Voucher voucher)
        {
            _context.Vouchers.Add(voucher);
            _context.SaveChanges();
        }

        public void UpdateVoucher(Voucher voucher, string id)
        {
            Voucher tmp = GetVoucherById(id);
            if (tmp != null) 
            {
                tmp.VoucherCode = voucher.VoucherCode;
                tmp.VoucherName = voucher.VoucherName;
                tmp.VoucherDescription = voucher.VoucherDescription;
                tmp.StartDate = voucher.StartDate;
                tmp.EndDate = voucher.EndDate;
                tmp.VoucherStatus = voucher.VoucherStatus;
                _context.Vouchers.Update(tmp);
                _context.SaveChanges();
            }           
        }

        public void DeleteVoucher(string id) 
        {
            Voucher tmp = GetVoucherById(id);
            if (tmp != null)
            {
                tmp.IsDelete = true;
                _context.Vouchers.Update(tmp);
                _context.SaveChanges();
            }
        }

        public Voucher GetVoucherById(string id) => _context.Vouchers.FirstOrDefault(x => x.VoucherId == id);

        public List<Voucher> GetAllVouchers() => _context.Vouchers.ToList(); 
    }
}
