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

        public List<User> GetAllUsers() => _context.Users.ToList();

        public User GetUserByPhone(string phone) => _context.Users.FirstOrDefault(x => x.Phone == phone);
    }
}
