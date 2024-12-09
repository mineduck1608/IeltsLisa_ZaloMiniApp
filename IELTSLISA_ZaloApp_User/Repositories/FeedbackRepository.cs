using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class FeedbackRepository
    {
        private readonly IeltsLisaContext _context = null;

        public FeedbackRepository()
        {
            if (_context == null)
            {
                _context = new IeltsLisaContext();
            }
        }

        public FeedbackRepository(IeltsLisaContext context)
        {
            _context = context;
        }

        public List<Feedback> GetAll() => _context.Feedbacks.ToList();

        public void Add(Feedback fb)
        {
            _context.Feedbacks.Add(fb);
            _context.SaveChanges();
        }

        public Feedback GetFeedbackById(string fbId) => _context.Feedbacks.FirstOrDefault(x => x.FbId == fbId);
    }
}
