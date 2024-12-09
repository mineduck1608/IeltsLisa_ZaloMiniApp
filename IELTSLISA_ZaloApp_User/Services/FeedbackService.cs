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
    public class FeedbackService : IFeedbackService
    {
        private readonly FeedbackRepository _repo = null;

        public FeedbackService()
        {
            if (_repo == null)
                _repo = new FeedbackRepository();
        }

        public List<Feedback> GetAllFeedbacks() => _repo.GetAll();

        public Feedback GetFeedbackById(string fbId) => _repo.GetFeedbackById(fbId);

        public void AddFeedback(Feedback fb) => _repo.Add(fb);
    }
}
