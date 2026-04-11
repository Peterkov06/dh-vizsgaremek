using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class chat_modifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ReadAt",
                table: "chat_messages",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_chat_messages_SenderId",
                table: "chat_messages",
                column: "SenderId");

            migrationBuilder.AddForeignKey(
                name: "FK_chat_messages_AspNetUsers_SenderId",
                table: "chat_messages",
                column: "SenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_chat_messages_AspNetUsers_SenderId",
                table: "chat_messages");

            migrationBuilder.DropIndex(
                name: "IX_chat_messages_SenderId",
                table: "chat_messages");

            migrationBuilder.DropColumn(
                name: "ReadAt",
                table: "chat_messages");
        }
    }
}
