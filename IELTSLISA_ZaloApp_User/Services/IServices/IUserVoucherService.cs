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
        public void AddUserVoucher(UserVoucher userVoucher);

        public UserVoucher GetVoucherByUserId(string userId);

        public void UpdateUserVoucherStatus(string userId, string voucherId, bool status);
    }
}
