using Microsoft.EntityFrameworkCore.Migrations;

namespace Twitter.Repository.Migrations
{
    public partial class AddRetweetID : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Retweets_AspNetUsers_UserId",
                table: "Retweets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Retweets",
                table: "Retweets");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Retweets",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Retweets",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Retweets",
                table: "Retweets",
                column: "Id");

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Retweets_AspNetUsers_UserId",
                table: "Retweets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Retweets",
                table: "Retweets");

            migrationBuilder.DropIndex(
                name: "IX_Retweets_UserId",
                table: "Retweets");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Retweets");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Retweets",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Retweets",
                table: "Retweets",
                columns: new[] { "UserId", "TweetId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Retweets_AspNetUsers_UserId",
                table: "Retweets",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
