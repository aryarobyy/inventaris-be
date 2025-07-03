-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'super_admin') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `class_name` VARCHAR(191) NOT NULL,
    `academic_year` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NULL,
    `organization` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_student_id_key`(`student_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `brand` VARCHAR(191) NULL,
    `pair_id` INTEGER NULL,
    `category` ENUM('electronics', 'furniture', 'sports_equipment', 'laboratory_equipment', 'other') NOT NULL,
    `condition_status` ENUM('good', 'damaged', 'needs_repair', 'lost') NOT NULL,
    `availability_status` ENUM('available', 'borrowed', 'maintenance', 'retired') NOT NULL,
    `status_notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Loan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `borrower_id` INTEGER NOT NULL,
    `loan_date` DATETIME(3) NOT NULL,
    `due_date` DATETIME(3) NOT NULL,
    `return_date` DATETIME(3) NULL,
    `loan_status` ENUM('pending', 'approved', 'active', 'returned', 'overdue', 'cancelled') NOT NULL,
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `loan_id` INTEGER NOT NULL,
    `item_id` INTEGER NOT NULL,
    `borrowed_quantity` INTEGER NOT NULL DEFAULT 1,
    `borrow_condition` ENUM('good', 'damaged', 'needs_repair', 'lost') NULL,
    `return_condition` ENUM('good', 'damaged', 'needs_repair', 'lost') NULL,
    `returned_at` DATETIME(3) NULL,

    UNIQUE INDEX `LoanItem_loan_id_item_id_key`(`loan_id`, `item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `room_name` VARCHAR(191) NOT NULL,
    `pc_count` INTEGER NOT NULL DEFAULT 0,
    `description` VARCHAR(191) NULL,
    `room_status` ENUM('available', 'occupied', 'maintenance', 'out_of_service') NOT NULL,
    `capacity` INTEGER NULL,
    `location` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoomBooking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `borrower_id` INTEGER NOT NULL,
    `room_id` INTEGER NOT NULL,
    `booking_date` DATETIME(3) NOT NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `actual_return_time` DATETIME(3) NULL,
    `booking_status` ENUM('pending', 'approved', 'active', 'completed', 'cancelled') NOT NULL,
    `purpose` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_pair_id_fkey` FOREIGN KEY (`pair_id`) REFERENCES `Item`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_borrower_id_fkey` FOREIGN KEY (`borrower_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanItem` ADD CONSTRAINT `LoanItem_loan_id_fkey` FOREIGN KEY (`loan_id`) REFERENCES `Loan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanItem` ADD CONSTRAINT `LoanItem_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomBooking` ADD CONSTRAINT `RoomBooking_borrower_id_fkey` FOREIGN KEY (`borrower_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomBooking` ADD CONSTRAINT `RoomBooking_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
