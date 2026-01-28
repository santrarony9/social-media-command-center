-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PostStatus" ADD VALUE 'APPROVED';
ALTER TYPE "PostStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "resource" TEXT;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "approvalRequired" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "brandHashtags" TEXT[],
ADD COLUMN     "seoKeywords" TEXT[];

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "approvalLog" JSONB,
ADD COLUMN     "seoScore" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "lastLogin" TIMESTAMP(3);
