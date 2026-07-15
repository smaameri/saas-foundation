/*
  Warnings:

  - Made the column `role` on table `invitation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `first_name` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "invitation" ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "platform_role" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "first_name" SET NOT NULL,
ALTER COLUMN "last_name" SET NOT NULL;
