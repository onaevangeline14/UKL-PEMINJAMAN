/*
  Warnings:

  - A unique constraint covering the columns `[id_barang]` on the table `Barang` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_barang` to the `Barang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `barang` ADD COLUMN `id_barang` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Barang_id_barang_key` ON `Barang`(`id_barang`);
