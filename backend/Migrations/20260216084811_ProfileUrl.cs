using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class ProfileUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserPreference_AspNetUsers_UserId",
                table: "UserPreference");

            migrationBuilder.DropForeignKey(
                name: "FK_UserPreference_Preferences_PreferenceId",
                table: "UserPreference");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserPreference",
                table: "UserPreference");

            migrationBuilder.RenameTable(
                name: "UserPreference",
                newName: "UserPreferences");

            migrationBuilder.RenameIndex(
                name: "IX_UserPreference_PreferenceId",
                table: "UserPreferences",
                newName: "IX_UserPreferences_PreferenceId");

            migrationBuilder.AddColumn<string>(
                name: "ProfilePicUrl",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserPreferences",
                table: "UserPreferences",
                columns: new[] { "UserId", "PreferenceId" });

            migrationBuilder.AddForeignKey(
                name: "FK_UserPreferences_AspNetUsers_UserId",
                table: "UserPreferences",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserPreferences_Preferences_PreferenceId",
                table: "UserPreferences",
                column: "PreferenceId",
                principalTable: "Preferences",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserPreferences_AspNetUsers_UserId",
                table: "UserPreferences");

            migrationBuilder.DropForeignKey(
                name: "FK_UserPreferences_Preferences_PreferenceId",
                table: "UserPreferences");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserPreferences",
                table: "UserPreferences");

            migrationBuilder.DropColumn(
                name: "ProfilePicUrl",
                table: "AspNetUsers");

            migrationBuilder.RenameTable(
                name: "UserPreferences",
                newName: "UserPreference");

            migrationBuilder.RenameIndex(
                name: "IX_UserPreferences_PreferenceId",
                table: "UserPreference",
                newName: "IX_UserPreference_PreferenceId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserPreference",
                table: "UserPreference",
                columns: new[] { "UserId", "PreferenceId" });

            migrationBuilder.AddForeignKey(
                name: "FK_UserPreference_AspNetUsers_UserId",
                table: "UserPreference",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserPreference_Preferences_PreferenceId",
                table: "UserPreference",
                column: "PreferenceId",
                principalTable: "Preferences",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
