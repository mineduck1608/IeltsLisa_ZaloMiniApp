using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class GiftRepository
    {
        private readonly IeltsLisaContext _context = null;

        public GiftRepository()
        {
            if (_context == null)
            {
                _context = new IeltsLisaContext();
            }
        }

        public GiftRepository(IeltsLisaContext context)
        {
            _context = context;
        }

        public List<Gift> GetAll() => _context.Gifts.ToList();

        public void Add(Gift gift)
        {
            _context.Gifts.Add(gift);
            _context.SaveChanges();
        }

        public Gift GetGiftById(string id) => _context.Gifts.FirstOrDefault(x => x.GiftId == id);

        public void Update(string id, string name, string? description, int? quantity, bool status)
        {
            Gift tmp = GetGiftById(id);
            if (tmp != null)
            {
                tmp.GiftName = name;
                tmp.GiftDescription = description;
                tmp.GiftQuantity = quantity;
                tmp.GiftStatus = status;
                _context.Gifts.Update(tmp);
                _context.SaveChanges();
            }
        }

        public void Delete(string id)
        {
            Gift tmp = GetGiftById(id);
            if (tmp != null)
            {
                tmp.IsDelete = true;
                _context.Gifts.Update(tmp);
                _context.SaveChanges();
            }
        }
    }
}
