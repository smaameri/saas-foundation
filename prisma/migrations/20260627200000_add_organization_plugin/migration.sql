-- DropForeignKey
ALTER TABLE "organization_membership" DROP CONSTRAINT "organization_membership_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "organization_membership" DROP CONSTRAINT "organization_membership_user_id_fkey";

-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "logo" TEXT,
ADD COLUMN     "metadata" TEXT,
ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "session" ADD COLUMN     "active_organization_id" TEXT;

-- DropTable
DROP TABLE "organization_membership";

-- CreateTable
CREATE TABLE "member" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "inviter_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "role" TEXT,
    "status" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "member_user_id_idx" ON "member"("user_id");

-- CreateIndex
CREATE INDEX "member_organization_id_idx" ON "member"("organization_id");

-- CreateIndex
CREATE INDEX "invitation_organization_id_idx" ON "invitation"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_slug_key" ON "organization"("slug");

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
