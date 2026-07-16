using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IronCore.Migrations
{
    /// <inheritdoc />
    public partial class Fixcolumnname : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ImagePath",
                table: "Trainers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.RenameColumn(
    name: "YearsOfExperiance",
    table: "Trainers",
    newName: "YearsOfExperience");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ImagePath",
                table: "Trainers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.RenameColumn(
    name: "YearsOfExperience",
    table: "Trainers",
    newName: "YearsOfExperiance");
        }
    }
}
