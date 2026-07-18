/*
  Warnings:

  - You are about to drop the column `platform_role` on the `invitation` table. All the data in the column will be lost.
  - Added the required column `portal` to the `invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invitation" DROP COLUMN "platform_role",
ADD COLUMN     "portal" TEXT NOT NULL,
ALTER COLUMN "organization_id" DROP NOT NULL;
