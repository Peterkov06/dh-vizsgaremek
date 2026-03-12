using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class db_context_name_change : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_CourseReviews_SingleContext",
                table: "course_feedbacks");

            migrationBuilder.AddCheckConstraint(
                name: "CK_CourseReviews_SingleContext",
                table: "course_feedbacks",
                sql: "((\"WallId\" IS NOT NULL)::int + (\"EnrollmentId\" IS NOT NULL)::int) = 1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_CourseReviews_SingleContext",
                table: "course_feedbacks");

            migrationBuilder.AddCheckConstraint(
                name: "CK_CourseReviews_SingleContext",
                table: "course_feedbacks",
                sql: "(\"WallId\" IS NOT NULL)::int + (\"EnrollmentId\" IS NOT NULL)::int) = 1");
        }
    }
}
