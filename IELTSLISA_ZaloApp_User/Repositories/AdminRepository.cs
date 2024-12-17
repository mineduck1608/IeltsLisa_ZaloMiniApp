using Microsoft.EntityFrameworkCore;
using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Repositories
{
   public class AdminRepository
    {

        private readonly IeltsLisaContext _dbContext = null;

        public AdminRepository()
        {
            if (_dbContext == null)
            {
                _dbContext = new IeltsLisaContext();
            }
        }

        public AdminRepository(IeltsLisaContext context)
        {
            if (_dbContext == null)
                _dbContext = context;
        }
        public Admin GetAdminByLogin(string username, string password) => _dbContext.Admins.FirstOrDefault(x => x.Username == username && x.Password == password);

        public List<Admin> GetAll() => _dbContext.Admins.ToList();
    }
}
