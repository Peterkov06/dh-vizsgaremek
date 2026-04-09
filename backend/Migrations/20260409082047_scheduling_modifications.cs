using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class scheduling_modifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_teacher_timeblocks_TeacherId",
                table: "teacher_timeblocks");

            migrationBuilder.DropIndex(
                name: "IX_events_OrganiserId",
                table: "events");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Events_SingleContext",
                table: "events");

            migrationBuilder.AlterColumn<DateTime>(
                name: "EndTime",
                table: "events",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeacherTimeblocks_TeacherId_Start_End",
                table: "teacher_timeblocks",
                columns: new[] { "TeacherId", "Start", "End" });

            migrationBuilder.CreateIndex(
                name: "IX_Events_OrganiserId_EndTime",
                table: "events",
                columns: new[] { "OrganiserId", "EndTime" });

            migrationBuilder.CreateIndex(
                name: "IX_Events_OrganiserId_StartTime",
                table: "events",
                columns: new[] { "OrganiserId", "StartTime" });

            migrationBuilder.AddCheckConstraint(
                name: "CK_Events_SingleContext",
                table: "events",
                sql: "((\"PathCourseId\" IS NOT NULL)::int + (\"TutoringWallId\" IS NOT NULL)::int) = 1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TeacherTimeblocks_TeacherId_Start_End",
                table: "teacher_timeblocks");

            migrationBuilder.DropIndex(
                name: "IX_Events_OrganiserId_EndTime",
                table: "events");

            migrationBuilder.DropIndex(
                name: "IX_Events_OrganiserId_StartTime",
                table: "events");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Events_SingleContext",
                table: "events");

            migrationBuilder.AlterColumn<DateTime>(
                name: "EndTime",
                table: "events",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.CreateIndex(
                name: "IX_teacher_timeblocks_TeacherId",
                table: "teacher_timeblocks",
                column: "TeacherId");

            migrationBuilder.CreateIndex(
                name: "IX_events_OrganiserId",
                table: "events",
                column: "OrganiserId");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Events_SingleContext",
                table: "events",
                sql: "((\"PathCourseId\" IS NOT NULL)::int + (\"TutoringWallId\" IS NOT NULL)::int + (\"PathEnrollmentId\" IS NOT NULL)::int) = 1");
        }
    }
}
