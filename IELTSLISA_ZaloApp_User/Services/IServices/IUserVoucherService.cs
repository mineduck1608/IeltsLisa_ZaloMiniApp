using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IUserVoucherService

    {
        public List<UserVoucher> GetAllUserVouchers();

        public void AddUserVoucher(UserVoucher userVoucher);

        public List<UserVoucher> GetVoucherByUserId(string userId);

        public List<UserVoucher> GetOwnUserVoucherById(string userId);

        public void UpdateUserVoucherStatus(string userId, string voucherId, string giftId, bool status, DateTime redeemed);

        public void RemoveUserVoucher(string userId, string voucherId, string giftId);
    }
}
