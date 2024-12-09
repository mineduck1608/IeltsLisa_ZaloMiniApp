using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IInformationService
    {
        public List<Information> GetAllInformations();

        public Information GetInformationById(string infoId);

        public void AddInformation(Information info);
    }
}
