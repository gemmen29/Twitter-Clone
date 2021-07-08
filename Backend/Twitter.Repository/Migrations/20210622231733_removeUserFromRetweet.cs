using Microsoft.EntityFrameworkCore.Migrations;

namespace Twitter.Repository.Migrations
{
    public partial class removeUserFromRetweet : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Retweets_AspNetUsers_UserId",
                table: "Retweets");

            migrationBuilder.DropIndex(
                name: "IX_Retweets_UserId",
                table: "Retweets");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Retweets");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Retweets",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Retweets_UserId",
                table: "Retweets",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Retweets_AspNetUsers_UserId",
                table: "Retweets",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
