using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitSmallChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ConversationParticipants_AspNetUsers_SenderId",
                table: "ConversationParticipants");

            migrationBuilder.RenameColumn(
                name: "SenderId",
                table: "ConversationParticipants",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_ConversationParticipants_SenderId",
                table: "ConversationParticipants",
                newName: "IX_ConversationParticipants_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ConversationParticipants_AspNetUsers_UserId",
                table: "ConversationParticipants",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ConversationParticipants_AspNetUsers_UserId",
                table: "ConversationParticipants");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "ConversationParticipants",
                newName: "SenderId");

            migrationBuilder.RenameIndex(
                name: "IX_ConversationParticipants_UserId",
                table: "ConversationParticipants",
                newName: "IX_ConversationParticipants_SenderId");

            migrationBuilder.AddForeignKey(
                name: "FK_ConversationParticipants_AspNetUsers_SenderId",
                table: "ConversationParticipants",
                column: "SenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
