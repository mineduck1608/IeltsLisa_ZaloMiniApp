using Microsoft.Identity.Client;
using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class UserRepository
    {
        private readonly IeltsLisaContext _context = null;

        public UserRepository()
        {
            if(_context == null)
            {
                _context = new IeltsLisaContext();
            }
        }

        public UserRepository(IeltsLisaContext context)
        {
                _context = context;
        }

        public void Add(User user) 
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }


        public void UpdateUser(User user, string id)
        {
            User tmp = GetUserById(id);
            if (tmp != null)
            {
                tmp.UserId = user.UserId;
                tmp.UserName = user.UserName;
                tmp.Phone = user.Phone;
                _context.Users.Update(tmp);
                _context.SaveChanges();
            }
        }

        public List<User> GetAllUsers() => _context.Users.ToList();

        public User GetUserByPhone(string phone) => _context.Users.FirstOrDefault(x => x.Phone == phone);

        public User GetUserById(string userId) => _context.Users.FirstOrDefault(x => x.UserId == userId);
    }
}
