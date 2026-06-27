-- AlterTable
ALTER TABLE "user" ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT,
ALTER COLUMN "platform_role" SET DEFAULT 'admin';
