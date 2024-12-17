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
    public class AdminService : IAdminService { 
        private readonly AdminRepository _repo = null;

        public AdminService()
        {
            if (_repo == null)
                _repo = new AdminRepository();
        }

        public Admin GetAdminByLogin(string username, string password) => _repo.GetAdminByLogin(username, password);

        public List<Admin> GetAllAdmin() => _repo.GetAll();

    }
}
