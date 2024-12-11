using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IConcernService
    {
        public List<Concern> GetAllConcerns();

        public Concern GetConcernById(string concernId);

        public void AddConcern(Concern concern);

        public void UpdateConcernStatus(string concernId);
    }
}
