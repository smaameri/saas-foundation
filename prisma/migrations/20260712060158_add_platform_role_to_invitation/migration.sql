-- AlterTable
ALTER TABLE "invitation" ADD COLUMN     "platform_role" TEXT NOT NULL DEFAULT 'user';

-- AddForeignKey
ALTER TABLE "apikey" ADD CONSTRAINT "apikey_reference_id_fkey" FOREIGN KEY ("reference_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
