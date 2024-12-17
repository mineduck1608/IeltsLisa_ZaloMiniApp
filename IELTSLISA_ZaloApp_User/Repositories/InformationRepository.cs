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

        public Information GetInformationById(string infoId) => _context.Information.FirstOrDefault(x => x.InfoId == infoId);

        public void DeleteInformation(string id)
        {
            Information tmp = GetInformationById(id);
            if (tmp != null)
            {
                _context.Information.Remove(tmp);
                _context.SaveChanges();
            }
        }

        public void UpdateInformation(Information info, string id)
        {
            Information tmp = GetInformationById(id);
            if (tmp != null)
            {
                tmp.InfoName = info.InfoName;
                tmp.InfoImg = info.InfoImg;
                tmp.InfoContent = info.InfoContent;
                _context.Information.Update(tmp);
                _context.SaveChanges();
            }
        }
    }
}
