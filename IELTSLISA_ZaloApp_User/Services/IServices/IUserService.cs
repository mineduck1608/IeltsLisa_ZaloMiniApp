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

        public void UpdateUser(User user, string userId);

        public void DeleteUser(string userId);

        public List<User> GetAllUsers();

        public User GetUserByPhone(string phone);

        public User GetUserById(string userId);
    }
}
