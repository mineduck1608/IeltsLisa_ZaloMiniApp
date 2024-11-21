using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IUserService
    {
        public void AddUser(User user);

        public List<User> GetAllUsers();

        public User GetUserByPhone(string phone);
    }
}
