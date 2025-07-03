/*
  Warnings:

  - You are about to drop the column `full_name` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `class_name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `major_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone_number` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organization` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `User_username_key` ON `user`;

-- AlterTable
ALTER TABLE `admin` DROP COLUMN `full_name`,
    DROP COLUMN `password`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `class_name`,
    DROP COLUMN `username`,
    ADD COLUMN `major_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    MODIFY `phone_number` VARCHAR(191) NOT NULL,
    MODIFY `organization` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_name_key` ON `User`(`name`);
