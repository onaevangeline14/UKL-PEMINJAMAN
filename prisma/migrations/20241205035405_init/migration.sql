/*
  Warnings:

  - You are about to drop the column `id_barang` on the `barang` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Barang_id_barang_key` ON `barang`;

-- AlterTable
ALTER TABLE `barang` DROP COLUMN `id_barang`;
