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

        public List<UserVoucher> GetAll() => _context.UserVouchers.ToList();

        public UserVoucher AddUserVoucher(UserVoucher userVoucher)
        {
            _context.UserVouchers.Add(userVoucher);
            _context.SaveChanges();
            return userVoucher;     
        }
        public List<UserVoucher> GetVoucherByUserId(string UserId) => _context.UserVouchers.Where(x => x.UserId == UserId && x.UserVoucherStatus == true).ToList();

        public UserVoucher FindUserVoucher(string userId, string voucherId, string giftId) => _context.UserVouchers.FirstOrDefault(x => x.UserId == userId && x.VoucherId == voucherId && x.GiftId == giftId);

        public void UpdateStatus(string userId, string voucherId, string giftId, bool status)
        {
            UserVoucher tmp = FindUserVoucher(userId, voucherId, giftId);
            if(tmp != null)
            {
                tmp.UserVoucherStatus = status;
                _context.Update(tmp);
                _context.SaveChanges();
            }
        }

        public void Delete(string userId, string voucherId, string giftId)
        {

            UserVoucher tmp = FindUserVoucher(userId, voucherId, giftId);
            if (tmp != null)
            {
                _context.Remove(tmp);
                _context.SaveChanges();
            }
        }
    }
}
