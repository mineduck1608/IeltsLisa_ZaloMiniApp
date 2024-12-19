using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IGiftService
    {
        public List<Gift> GetAllGifts();

        public void AddGift(Gift gift);

        public void UsingUpdateGift(string giftId, string giftName, string? giftDescription, int gifQuantity, bool giftStatus);

        public void UpdateGift(Gift gift, string giftId);

        public void DeleteGift(string giftId);

        public Gift GetGiftById(string giftId);
    }
}
