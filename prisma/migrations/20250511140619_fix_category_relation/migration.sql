/*
  Warnings:

  - You are about to drop the column `category` on the `Event` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Event` DROP COLUMN `category`,
    ADD COLUMN `categoryId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Event_categoryId_fkey` ON `Event`(`categoryId`);

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
