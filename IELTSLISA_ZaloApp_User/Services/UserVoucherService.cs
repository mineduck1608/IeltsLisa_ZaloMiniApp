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

        public List<UserVoucher> GetAllUserVouchers() => _repo.GetAll();

        public void AddUserVoucher(UserVoucher userVoucher) => _repo.AddUserVoucher(userVoucher);

        public List<UserVoucher> GetVoucherByUserId(string userId) => _repo.GetVoucherByUserId(userId);

        public void UpdateUserVoucherStatus(string userId, string voucherId, string giftId, bool status) => _repo.UpdateStatus(userId, voucherId, giftId, status);

        public void RemoveUserVoucher(string userId, string voucherId, string giftId) => _repo.Delete(userId, voucherId, giftId);
    }
}
