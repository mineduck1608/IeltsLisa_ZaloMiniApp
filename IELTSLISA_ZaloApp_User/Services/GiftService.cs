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
    public class GiftService : IGiftService
    {
        private readonly GiftRepository _repo = null;

        public GiftService()
        {
            if (_repo == null)
                _repo = new GiftRepository();
        }

        public List<Gift> GetAllGifts() => _repo.GetAll();

        public void AddGift(Gift gift) => _repo.Add(gift);

        public void UpdateGift(string giftId, string giftName, string? giftDescription, int? giftQuantity, bool giftStatus) => _repo.Update(giftId, giftName, giftDescription, giftQuantity, giftStatus);

        public void DeleteGift(string giftId) => _repo.Delete(giftId);

        public Gift GetGiftById(string giftId) => _repo.GetGiftById(giftId);
    }
}
