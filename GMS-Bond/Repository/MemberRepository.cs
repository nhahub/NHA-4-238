using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace GMS_Bond.Repository
{
    public class MemberRepository : Repository<Member ,int> , IMemberRepository
    {
        public MemberRepository(AcadamyContext acadamyContext):base(acadamyContext) { }


    }

}
