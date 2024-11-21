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
    public class UserVoucherService : IUserVoucherService
    {
        private readonly UserVoucherRepository _repo = null;

        public UserVoucherService()
        {
            if (_repo == null)
                _repo = new UserVoucherRepository();
        }

        public void AddUserVoucher(UserVoucher userVoucher) => _repo.AddUserVoucher(userVoucher);

        public UserVoucher GetVoucherByUserId(string userId) => _repo.GetVoucherByUserId(userId);

        public void UpdateUserVoucherStatus(string userId, string voucherId, bool status) => _repo.UpdateStatus(userId, voucherId, status);
    }
}
