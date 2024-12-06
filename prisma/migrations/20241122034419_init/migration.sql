/*
  Warnings:

  - You are about to drop the `menu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_list` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_idUser_fkey`;

-- DropForeignKey
ALTER TABLE `order_list` DROP FOREIGN KEY `Order_List_idMenu_fkey`;

-- DropForeignKey
ALTER TABLE `order_list` DROP FOREIGN KEY `Order_List_idOrder_fkey`;

-- DropTable
DROP TABLE `menu`;

-- DropTable
DROP TABLE `order`;

-- DropTable
DROP TABLE `order_list`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `Keuangan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('income', 'expense') NOT NULL DEFAULT 'income',
    `amount` INTEGER NOT NULL,
    `desc` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
