/*
  Warnings:

  - You are about to drop the `return` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `return` DROP FOREIGN KEY `Return_barang_id_fkey`;

-- DropForeignKey
ALTER TABLE `return` DROP FOREIGN KEY `Return_borrow_id_fkey`;

-- DropForeignKey
ALTER TABLE `return` DROP FOREIGN KEY `Return_user_id_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- DropTable
DROP TABLE `return`;
