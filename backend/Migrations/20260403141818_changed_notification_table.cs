using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class changed_notification_table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_chat_rooms_path_enrollments_EnrollmentId",
                table: "chat_rooms");

            migrationBuilder.DropForeignKey(
                name: "FK_chat_rooms_tutoring_walls_WallId",
                table: "chat_rooms");

            migrationBuilder.DropForeignKey(
                name: "FK_submissions_students_SubmitterId",
                table: "submissions");

            migrationBuilder.DropIndex(
                name: "IX_chat_rooms_EnrollmentId",
                table: "chat_rooms");

            migrationBuilder.DropIndex(
                name: "IX_chat_rooms_WallId",
                table: "chat_rooms");

            migrationBuilder.DropCheckConstraint(
                name: "CK_ChatRoom_SingleContext",
                table: "chat_rooms");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "notifications");

            migrationBuilder.DropColumn(
                name: "EnrollmentId",
                table: "chat_rooms");

            migrationBuilder.DropColumn(
                name: "WallId",
                table: "chat_rooms");

            migrationBuilder.AddColumn<string>(
                name: "TeacherId",
                table: "submissions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SenderId",
                table: "notifications",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "hand_ins",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "WallId",
                table: "hand_ins",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "StudentId",
                table: "chat_rooms",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TeacherId",
                table: "chat_rooms",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_submissions_TeacherId",
                table: "submissions",
                column: "TeacherId");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_SenderId",
                table: "notifications",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_hand_ins_WallId",
                table: "hand_ins",
                column: "WallId");

            migrationBuilder.CreateIndex(
                name: "IX_chat_rooms_StudentId",
                table: "chat_rooms",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_chat_rooms_TeacherId",
                table: "chat_rooms",
                column: "TeacherId");

            migrationBuilder.AddForeignKey(
                name: "FK_chat_rooms_students_StudentId",
                table: "chat_rooms",
                column: "StudentId",
                principalTable: "students",
                principalColumn: "UserId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_chat_rooms_teachers_TeacherId",
                table: "chat_rooms",
                column: "TeacherId",
                principalTable: "teachers",
                principalColumn: "TeacherId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_hand_ins_tutoring_walls_WallId",
                table: "hand_ins",
                column: "WallId",
                principalTable: "tutoring_walls",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_notifications_AspNetUsers_SenderId",
                table: "notifications",
                column: "SenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_submissions_students_SubmitterId",
                table: "submissions",
                column: "SubmitterId",
                principalTable: "students",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_submissions_teachers_TeacherId",
                table: "submissions",
                column: "TeacherId",
                principalTable: "teachers",
                principalColumn: "TeacherId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_chat_rooms_students_StudentId",
                table: "chat_rooms");

            migrationBuilder.DropForeignKey(
                name: "FK_chat_rooms_teachers_TeacherId",
                table: "chat_rooms");

            migrationBuilder.DropForeignKey(
                name: "FK_hand_ins_tutoring_walls_WallId",
                table: "hand_ins");

            migrationBuilder.DropForeignKey(
                name: "FK_notifications_AspNetUsers_SenderId",
                table: "notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_submissions_students_SubmitterId",
                table: "submissions");

            migrationBuilder.DropForeignKey(
                name: "FK_submissions_teachers_TeacherId",
                table: "submissions");

            migrationBuilder.DropIndex(
                name: "IX_submissions_TeacherId",
                table: "submissions");

            migrationBuilder.DropIndex(
                name: "IX_notifications_SenderId",
                table: "notifications");

            migrationBuilder.DropIndex(
                name: "IX_hand_ins_WallId",
                table: "hand_ins");

            migrationBuilder.DropIndex(
                name: "IX_chat_rooms_StudentId",
                table: "chat_rooms");

            migrationBuilder.DropIndex(
                name: "IX_chat_rooms_TeacherId",
                table: "chat_rooms");

            migrationBuilder.DropColumn(
                name: "TeacherId",
                table: "submissions");

            migrationBuilder.DropColumn(
                name: "SenderId",
                table: "notifications");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "hand_ins");

            migrationBuilder.DropColumn(
                name: "WallId",
                table: "hand_ins");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "chat_rooms");

            migrationBuilder.DropColumn(
                name: "TeacherId",
                table: "chat_rooms");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "notifications",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "EnrollmentId",
                table: "chat_rooms",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "WallId",
                table: "chat_rooms",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_chat_rooms_EnrollmentId",
                table: "chat_rooms",
                column: "EnrollmentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_chat_rooms_WallId",
                table: "chat_rooms",
                column: "WallId",
                unique: true);

            migrationBuilder.AddCheckConstraint(
                name: "CK_ChatRoom_SingleContext",
                table: "chat_rooms",
                sql: "((\"WallId\" IS NOT NULL)::int + (\"EnrollmentId\" IS NOT NULL)::int) = 1");

            migrationBuilder.AddForeignKey(
                name: "FK_chat_rooms_path_enrollments_EnrollmentId",
                table: "chat_rooms",
                column: "EnrollmentId",
                principalTable: "path_enrollments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_chat_rooms_tutoring_walls_WallId",
                table: "chat_rooms",
                column: "WallId",
                principalTable: "tutoring_walls",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_submissions_students_SubmitterId",
                table: "submissions",
                column: "SubmitterId",
                principalTable: "students",
                principalColumn: "UserId",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
