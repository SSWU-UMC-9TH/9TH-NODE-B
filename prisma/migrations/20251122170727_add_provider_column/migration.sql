/*
  Warnings:

  - You are about to alter the column `started_at` on the `mission` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `end_at` on the `mission` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `inactive_date` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `user_mission` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `mission` MODIFY `started_at` DATETIME NULL,
    MODIFY `end_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `provider` VARCHAR(20) NOT NULL DEFAULT 'local',
    MODIFY `inactive_date` DATETIME NULL;

-- AlterTable
ALTER TABLE `user_mission` MODIFY `created_at` DATETIME NULL;
