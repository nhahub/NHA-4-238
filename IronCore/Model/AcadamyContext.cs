using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace IronCore.Model
{
    public class AcadamyContext : IdentityDbContext<UserAccount ,IdentityRole<int> , int>
    {
        public DbSet<Package> Packages { get; set; }
        public DbSet<Plan> Plans { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<SessionAttendace> SessionAttendaces { get; set; }
        public DbSet<Sport> Sports { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<TrainingAppointment> TrainingAppointments { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<Trainer> Trainers { get; set; }

        public AcadamyContext(DbContextOptions<AcadamyContext> options) 
            : base(options) {}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        
        // Configure the composite primary key
            modelBuilder.Entity<SessionAttendace>()
                .HasKey(sa => new { sa.MemberId, sa.SessionId});

            modelBuilder.Entity<Subscription>().
                HasOne(s => s.Package).
                WithMany(o => o.Subscriptions).
                HasForeignKey(s => s.PackageId).
                OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Subscription>().
                HasOne(s => s.Member).
                WithMany(m => m.Subscriptions).
                HasForeignKey(s => s.MemberId).
                OnDelete(DeleteBehavior.SetNull); //keeping historic records

            modelBuilder.Entity<SessionAttendace>().
                HasOne(sa => sa.Member).
                WithMany(m => m.Attendaces).
                HasForeignKey(s => s.MemberId).
                OnDelete(DeleteBehavior.Cascade); //could set it null to keep records of count of trainees in session

            modelBuilder.Entity<SessionAttendace>().
                HasOne(sa => sa.Session).
                WithMany(s => s.Attendaces).
                HasForeignKey(s => s.SessionId).
                OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Plan>().
                HasOne(p => p.Sport).
                WithMany(s => s.Plans).
                HasForeignKey(s => s.SportId).
                OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Plan>().
                HasOne(p => p.Trainer).
                WithMany(t => t.Plans).
                HasForeignKey(s => s.TrainerId).
                OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TrainingAppointment>().
                HasOne(ta => ta.Plan).
                WithMany(p => p.TrainingAppointments).
                HasForeignKey(s => s.PlanId).
                OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Package>().
                HasOne(o => o.Plan).
                WithMany(p => p.Packages).
                HasForeignKey(o => o.PlanId).
                OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Trainer>().
                HasOne(p => p.Sport).
                WithMany(s => s.Trainers)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Session>()
                .HasIndex(s => new { s.SessionDate, s.PlanId })
                .IsUnique();

        }

    }

}
