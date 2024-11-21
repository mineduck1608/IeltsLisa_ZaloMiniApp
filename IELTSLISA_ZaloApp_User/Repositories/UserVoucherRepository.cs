using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class UserVoucherRepository
    {
        private readonly IeltsLisaContext _context = null;

        public UserVoucherRepository()
        {
            if (_context == null)
            {
                _context = new IeltsLisaContext();
            }
        }

        public UserVoucherRepository(IeltsLisaContext context)
        {
            _context = context;
        }

        public UserVoucher AddUserVoucher(UserVoucher userVoucher)
        {
            _context.UserVouchers.Add(userVoucher);
            _context.SaveChanges();
            return userVoucher;     
        }
        public UserVoucher GetVoucherByUserId(string UserId) => _context.UserVouchers.FirstOrDefault(x => x.UserId == UserId && x.UserVoucherStatus == true);

        public UserVoucher FindUserVoucher(string userId, string voucherId) => _context.UserVouchers.FirstOrDefault(x => x.UserId == userId && x.VoucherId == voucherId);

        public void UpdateStatus(string userId, string voucherId, bool status)
        {
            UserVoucher tmp = FindUserVoucher(userId, voucherId);
            if(tmp != null)
            {
                tmp.UserVoucherStatus = status;
                _context.Update(tmp);
                _context.SaveChanges();
            }
        }
    }
}
