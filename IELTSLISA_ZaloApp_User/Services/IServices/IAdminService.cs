using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IAdminService
    {
        public Admin GetAdminByLogin(string username, string password);

        public List<Admin> GetAllAdmin();
    }
}
