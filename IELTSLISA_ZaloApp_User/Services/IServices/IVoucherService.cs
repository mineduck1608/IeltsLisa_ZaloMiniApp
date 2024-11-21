using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IVoucherService
    {
        public void AddVoucher(Voucher voucher);

        public void UpdateVoucher(Voucher voucher, string voucherId);

        public void DeleteVoucher(string voucherId);

        public List<Voucher> GetAllVouchers();

        public Voucher GetVoucherByid(string id);
     }
}
