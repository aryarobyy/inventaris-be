-- DropForeignKey
ALTER TABLE `item` DROP FOREIGN KEY `Item_pair_id_fkey`;

-- DropIndex
DROP INDEX `Item_pair_id_fkey` ON `item`;
