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
    public class UserService : IUserService
    {
        private readonly UserRepository _repo = null;

        public UserService()
        {
            if(_repo == null)
                _repo = new UserRepository();
        }

        public void AddUser(User user)  => _repo.Add(user);

        public void UpdateUser(User user, string userId) => _repo.UpdateUser(user, userId);

        public List<User> GetAllUsers() => _repo.GetAllUsers();

        public User GetUserByPhone(string phone) => _repo.GetUserByPhone(phone);

        public User GetUserById(string userId) => _repo.GetUserById(userId);
    }
}
