using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class img_props_and_notification_type : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UrlPath",
                table: "notifications");

            migrationBuilder.DropColumn(
                name: "ProfilePicUrl",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<DateTime>(
                name: "ReadAt",
                table: "notifications",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CurrencyCode",
                table: "Currencies",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CurrencySymbol",
                table: "Currencies",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "BannerImageId",
                table: "courses_base",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "IconImageId",
                table: "courses_base",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ProfilePictureId",
                table: "AspNetUsers",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_courses_base_BannerImageId",
                table: "courses_base",
                column: "BannerImageId");

            migrationBuilder.CreateIndex(
                name: "IX_courses_base_IconImageId",
                table: "courses_base",
                column: "IconImageId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_ProfilePictureId",
                table: "AspNetUsers",
                column: "ProfilePictureId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_physical_files_ProfilePictureId",
                table: "AspNetUsers",
                column: "ProfilePictureId",
                principalTable: "physical_files",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_courses_base_physical_files_BannerImageId",
                table: "courses_base",
                column: "BannerImageId",
                principalTable: "physical_files",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_courses_base_physical_files_IconImageId",
                table: "courses_base",
                column: "IconImageId",
                principalTable: "physical_files",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_physical_files_ProfilePictureId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_courses_base_physical_files_BannerImageId",
                table: "courses_base");

            migrationBuilder.DropForeignKey(
                name: "FK_courses_base_physical_files_IconImageId",
                table: "courses_base");

            migrationBuilder.DropIndex(
                name: "IX_courses_base_BannerImageId",
                table: "courses_base");

            migrationBuilder.DropIndex(
                name: "IX_courses_base_IconImageId",
                table: "courses_base");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_ProfilePictureId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ReadAt",
                table: "notifications");

            migrationBuilder.DropColumn(
                name: "CurrencyCode",
                table: "Currencies");

            migrationBuilder.DropColumn(
                name: "CurrencySymbol",
                table: "Currencies");

            migrationBuilder.DropColumn(
                name: "BannerImageId",
                table: "courses_base");

            migrationBuilder.DropColumn(
                name: "IconImageId",
                table: "courses_base");

            migrationBuilder.DropColumn(
                name: "ProfilePictureId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "UrlPath",
                table: "notifications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProfilePicUrl",
                table: "AspNetUsers",
                type: "text",
                nullable: true);
        }
    }
}
