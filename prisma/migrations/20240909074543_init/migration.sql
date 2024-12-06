-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `password` VARCHAR(191) NOT NULL DEFAULT '',
    `profile_picture` VARCHAR(191) NOT NULL DEFAULT '',
    `role` ENUM('Manager', 'Cashier') NOT NULL DEFAULT 'Cashier',
    `createdAT` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_uuid_key`(`uuid`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `price` INTEGER NOT NULL DEFAULT 0,
    `category` ENUM('Food', 'Drink', 'Snack') NOT NULL DEFAULT 'Food',
    `picture` VARCHAR(191) NOT NULL DEFAULT '',
    `description` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `customer` VARCHAR(191) NOT NULL DEFAULT '',
    `table_number` VARCHAR(191) NOT NULL DEFAULT '',
    `total_price` INTEGER NOT NULL DEFAULT 0,
    `payment_method` ENUM('Cash', 'Qris') NOT NULL DEFAULT 'Cash',
    `idUser` INTEGER NOT NULL,
    `status` ENUM('New', 'Paid', 'Done') NOT NULL DEFAULT 'New',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order_List` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `idOrder` INTEGER NOT NULL,
    `idMenu` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `note` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order_List` ADD CONSTRAINT `Order_List_idOrder_fkey` FOREIGN KEY (`idOrder`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order_List` ADD CONSTRAINT `Order_List_idMenu_fkey` FOREIGN KEY (`idMenu`) REFERENCES `Menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
