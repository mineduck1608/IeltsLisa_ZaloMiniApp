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
    public class ClassService : IClassService
    {
        private readonly ClassRepository _repo = null;

        public ClassService()
        {
            if (_repo == null)
                _repo = new ClassRepository();
        }

        public List<Class> GetAllClass() => _repo.GetAll();

        public Class GetClassById(string classId) => _repo.GetClassById(classId);

        public void AddClass(Class cl) => _repo.Add(cl);

        public void UpdateClass(Class cl, string classId) => _repo.Update(cl, classId);
    }
}
