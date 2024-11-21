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
    public class VoucherService :  IVoucherService
    {
        private readonly VoucherRepository _repo = null;

        public VoucherService()
        {
            if (_repo == null)
                _repo = new VoucherRepository();
        }   

        public void AddVoucher(Voucher voucher) => _repo.AddVoucher(voucher);

        public void UpdateVoucher(Voucher voucher, string voucherId) => _repo.UpdateVoucher(voucher, voucherId);

        public void DeleteVoucher(string voucherId) => _repo.DeleteVoucher(voucherId);

        public List<Voucher> GetAllVouchers() => _repo.GetAllVouchers();

        public Voucher GetVoucherByid(string id) => _repo.GetVoucherById(id);

    }
}
