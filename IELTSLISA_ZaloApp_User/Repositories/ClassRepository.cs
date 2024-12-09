using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class ClassRepository
    {
        private readonly IeltsLisaContext _context = null;

        public ClassRepository()
        {
            if (_context == null)
            {
                _context = new IeltsLisaContext();
            }
        }

        public ClassRepository(IeltsLisaContext context)
        {
            _context = context;
        }

        public List<Class> GetAll() => _context.Classes.ToList();

        public void Add(Class cl)
        {
            _context.Classes.Add(cl);
            _context.SaveChanges();
        }

        public Class GetClassById(string clId) => _context.Classes.FirstOrDefault(x => x.ClassId == clId);

        public void Update(Class cl, string id)
        {
            Class tmp = GetClassById(id);
            if (tmp != null)
            {
                tmp.ClassName = cl.ClassName;
                tmp.ClassContent = cl.ClassContent;
                tmp.ClassImg = cl.ClassImg;
                _context.Classes.Update(tmp);
                _context.SaveChanges();
            }
        }
    }
}
