-- DropIndex
DROP INDEX "public"."Creation_userId_key";

-- AlterTable
ALTER TABLE "public"."Creation" ALTER COLUMN "publish" SET DEFAULT false,
ALTER COLUMN "likedBy" SET DEFAULT ARRAY[]::TEXT[];
