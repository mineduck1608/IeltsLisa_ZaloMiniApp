using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class ConcernRepository
    {
        private readonly IeltsLisaContext _context = null;

        public ConcernRepository()
        {
            if (_context == null)
            {
                _context = new IeltsLisaContext();
            }
        }

        public ConcernRepository(IeltsLisaContext context)
        {
            _context = context;
        }

        public List<Concern> GetAll() => _context.Concerns.ToList();

        public void Add(Concern concern)
        {
            _context.Concerns.Add(concern);
            _context.SaveChanges();
        }

        public Concern GetConcernById(string concernId) => _context.Concerns.FirstOrDefault(x => x.ConcernId == concernId);

        public void UpdateStatus(string id)
        {
            Concern tmp = GetConcernById(id);
            if (tmp != null)
            {
                tmp.ConcernStatus = true;
                _context.Concerns.Update(tmp);
                _context.SaveChanges();
            }
        }
    }
}
