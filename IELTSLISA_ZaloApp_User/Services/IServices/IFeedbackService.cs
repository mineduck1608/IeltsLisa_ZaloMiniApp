using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IFeedbackService
    {
        public List<Feedback> GetAllFeedbacks();

        public Feedback GetFeedbackById(string fbId);

        public void AddFeedback(Feedback fb);
    }
}
