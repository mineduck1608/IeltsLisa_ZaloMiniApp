using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IClassService
    {
        public List<Class> GetAllClass();

        public Class GetClassById(string classId);

        public void AddClass(Class cl);

        public void UpdateClass(Class cl, string classId);
    }
}
