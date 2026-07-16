using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IronCore.Migrations
{
    /// <inheritdoc />
    public partial class Index_to_session_dateandplan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "PlanId",
                table: "Packages",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Sessions_SessionDate_PlanId",
                table: "Sessions",
                columns: new[] { "SessionDate", "PlanId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Sessions_SessionDate_PlanId",
                table: "Sessions");

            migrationBuilder.AlterColumn<int>(
                name: "PlanId",
                table: "Packages",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
