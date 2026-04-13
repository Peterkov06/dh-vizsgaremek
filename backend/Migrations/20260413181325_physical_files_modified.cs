using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class physical_files_modified : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "physical_files",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_physical_files_OwnerId",
                table: "physical_files",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_physical_files_AspNetUsers_OwnerId",
                table: "physical_files",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_physical_files_AspNetUsers_OwnerId",
                table: "physical_files");

            migrationBuilder.DropIndex(
                name: "IX_physical_files_OwnerId",
                table: "physical_files");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "physical_files");
        }
    }
}
