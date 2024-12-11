using Repositories.Entities;
using Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Services.IServices;

namespace Services
{
    public class ConcernService : IConcernService
    {
        private readonly ConcernRepository _repo = null;

        public ConcernService()
        {
            if (_repo == null)
                _repo = new ConcernRepository();
        }

        public List<Concern> GetAllConcerns() => _repo.GetAll();

        public Concern GetConcernById(string concernId) => _repo.GetConcernById(concernId);

        public void AddConcern(Concern concern) => _repo.Add(concern);

        public void UpdateConcernStatus(string concernId) => _repo.UpdateStatus(concernId);
    }
}
