namespace IronCore.Repository
{
    public class PackageRespository : Repository<Package , int> , IPackageRepository
    {
        public PackageRespository(AcadamyContext context):base(context)
        {
        }

}
}
