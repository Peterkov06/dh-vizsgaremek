using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class added_comment_on_wallpost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "wall_post_comments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SenderId = table.Column<string>(type: "character varying(450)", maxLength: 450, nullable: false),
                    WallId = table.Column<Guid>(type: "uuid", nullable: false),
                    PostId = table.Column<Guid>(type: "uuid", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_wall_post_comments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_wall_post_comments_AspNetUsers_SenderId",
                        column: x => x.SenderId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_wall_post_comments_tutoring_wall_posts_PostId",
                        column: x => x.PostId,
                        principalTable: "tutoring_wall_posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_wall_post_comments_tutoring_walls_WallId",
                        column: x => x.WallId,
                        principalTable: "tutoring_walls",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_wall_post_comments_PostId",
                table: "wall_post_comments",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_wall_post_comments_SenderId",
                table: "wall_post_comments",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_wall_post_comments_WallId",
                table: "wall_post_comments",
                column: "WallId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wall_post_comments");
        }
    }
}
