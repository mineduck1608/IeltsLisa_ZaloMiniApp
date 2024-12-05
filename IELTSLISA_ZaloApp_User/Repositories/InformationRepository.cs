using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class InformationRepository
    {
        private readonly IeltsLisaContext _context = null;

        public InformationRepository()
        {
            if (_context == null)
            {
                _context = new IeltsLisaContext();
            }
        }

        public InformationRepository(IeltsLisaContext context)
        {
            _context = context;
        }

        public List<Information> GetAll() => _context.Information.ToList();

        public void Add(Information information) 
        {
            _context.Information.Add(information);
            _context.SaveChanges();
        }
    }
}
