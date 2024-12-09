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
    public class InformationService : IInformationService
    {
        private readonly InformationRepository _repo = null;

        public InformationService()
        {
            if (_repo == null)
                _repo = new InformationRepository();
        }

        public List<Information> GetAllInformations() => _repo.GetAll();

        public Information GetInformationById(string infoId) => _repo.GetInformationById(infoId);

        public void AddInformation(Information info) => _repo.Add(info);
    }
}
