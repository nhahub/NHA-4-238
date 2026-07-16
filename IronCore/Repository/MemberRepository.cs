using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace IronCore.Repository
{
    public class MemberRepository : Repository<Member ,int> , IMemberRepository
    {
        public MemberRepository(AcadamyContext acadamyContext):base(acadamyContext) { }


    }

}
