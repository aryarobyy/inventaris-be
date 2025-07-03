/*
  Warnings:

  - The values [electronics,furniture,sports_equipment,laboratory_equipment,other] on the enum `Item_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `item` MODIFY `category` ENUM('computer', 'web_cam', 'printer', 'projector', 'cable', 'mouse', 'keyboard', 'headset', 'monitor', 'laptop') NOT NULL;
