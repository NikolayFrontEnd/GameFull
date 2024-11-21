/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "score" SERIAL NOT NULL,
ADD COLUMN     "success" SERIAL NOT NULL,
ADD COLUMN     "unsuccess" SERIAL NOT NULL;

-- DropTable
DROP TABLE "Game";
