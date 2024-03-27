-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Size" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "format" TEXT NOT NULL DEFAULT 'percent',
    "value" REAL NOT NULL DEFAULT 10,
    "basis" TEXT NOT NULL DEFAULT 'layer-width',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "designId" TEXT NOT NULL,
    CONSTRAINT "Size_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Size" ("basis", "createdAt", "designId", "format", "id", "updatedAt", "value") SELECT "basis", "createdAt", "designId", "format", "id", "updatedAt", "value" FROM "Size";
DROP TABLE "Size";
ALTER TABLE "new_Size" RENAME TO "Size";
CREATE UNIQUE INDEX "Size_designId_key" ON "Size"("designId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
