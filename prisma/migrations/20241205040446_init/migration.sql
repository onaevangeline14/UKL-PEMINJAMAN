/*
  Warnings:

  - You are about to drop the `borrow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `borrow` DROP FOREIGN KEY `Borrow_barang_id_fkey`;

-- DropForeignKey
ALTER TABLE `borrow` DROP FOREIGN KEY `Borrow_user_id_fkey`;

-- DropTable
DROP TABLE `borrow`;

-- CreateTable
CREATE TABLE `peminjaman` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `barang_id` INTEGER NOT NULL,
    `borrow_date` DATE NOT NULL,
    `return_date` DATE NULL,
    `status` ENUM('kembali', 'dipinjam') NOT NULL DEFAULT 'dipinjam',
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `peminjaman` ADD CONSTRAINT `peminjaman_barang_id_fkey` FOREIGN KEY (`barang_id`) REFERENCES `Barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `peminjaman` ADD CONSTRAINT `peminjaman_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
