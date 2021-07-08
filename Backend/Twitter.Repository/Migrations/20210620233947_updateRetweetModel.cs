using Microsoft.EntityFrameworkCore.Migrations;

namespace Twitter.Repository.Migrations
{
    public partial class updateRetweetModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Retweets_Tweet_TweetId",
                table: "Retweets");

            migrationBuilder.DropColumn(
                name: "Qoute",
                table: "Retweets");

            migrationBuilder.RenameColumn(
                name: "TweetId",
                table: "Retweets",
                newName: "ReTweetId");

            migrationBuilder.RenameIndex(
                name: "IX_Retweets_TweetId",
                table: "Retweets",
                newName: "IX_Retweets_ReTweetId");

            migrationBuilder.AddColumn<int>(
                name: "QouteTweetId",
                table: "Retweets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Retweets_QouteTweetId",
                table: "Retweets",
                column: "QouteTweetId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Retweets_Tweet_QouteTweetId",
                table: "Retweets",
                column: "QouteTweetId",
                principalTable: "Tweet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Retweets_Tweet_ReTweetId",
                table: "Retweets",
                column: "ReTweetId",
                principalTable: "Tweet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Retweets_Tweet_QouteTweetId",
                table: "Retweets");

            migrationBuilder.DropForeignKey(
                name: "FK_Retweets_Tweet_ReTweetId",
                table: "Retweets");

            migrationBuilder.DropIndex(
                name: "IX_Retweets_QouteTweetId",
                table: "Retweets");

            migrationBuilder.DropColumn(
                name: "QouteTweetId",
                table: "Retweets");

            migrationBuilder.RenameColumn(
                name: "ReTweetId",
                table: "Retweets",
                newName: "TweetId");

            migrationBuilder.RenameIndex(
                name: "IX_Retweets_ReTweetId",
                table: "Retweets",
                newName: "IX_Retweets_TweetId");

            migrationBuilder.AddColumn<string>(
                name: "Qoute",
                table: "Retweets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Retweets_Tweet_TweetId",
                table: "Retweets",
                column: "TweetId",
                principalTable: "Tweet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
