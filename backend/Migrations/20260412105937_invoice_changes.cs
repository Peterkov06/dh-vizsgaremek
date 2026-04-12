using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class invoice_changes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TeacherId",
                table: "invoices",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_invoices_TeacherId",
                table: "invoices",
                column: "TeacherId");

            migrationBuilder.AddForeignKey(
                name: "FK_invoices_AspNetUsers_TeacherId",
                table: "invoices",
                column: "TeacherId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_invoices_AspNetUsers_TeacherId",
                table: "invoices");

            migrationBuilder.DropIndex(
                name: "IX_invoices_TeacherId",
                table: "invoices");

            migrationBuilder.DropColumn(
                name: "TeacherId",
                table: "invoices");
        }
    }
}
