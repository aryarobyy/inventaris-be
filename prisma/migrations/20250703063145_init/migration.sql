/*
  Warnings:

  - Added the required column `password` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `role` ENUM('pending', 'admin', 'super_admin') NOT NULL DEFAULT 'pending';
