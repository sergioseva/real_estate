import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";
import type { Task } from "@/lib/tasks";

const THUMB_WIDTH = 600;
const QUALITY = 80;

export const task: Task = {
  name: "001_generate-thumbnails",
  async run() {
    const uploadsDir = join(process.cwd(), "public", "uploads");

    let propertyDirs: string[];
    try {
      propertyDirs = await readdir(uploadsDir);
    } catch {
      console.log("[tasks] No uploads directory found, skipping.");
      return;
    }

    let created = 0;

    for (const dir of propertyDirs) {
      const dirPath = join(uploadsDir, dir);
      const dirStat = await stat(dirPath);
      if (!dirStat.isDirectory()) continue;

      const files = await readdir(dirPath);
      for (const file of files) {
        if (file.includes("_thumb")) continue;

        const ext = extname(file);
        const name = basename(file, ext);
        const thumbPath = join(dirPath, `${name}_thumb${ext}`);

        try {
          await stat(thumbPath);
          continue; // Thumbnail already exists
        } catch {
          // Generate it
        }

        try {
          await sharp(join(dirPath, file))
            .rotate()
            .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
            .toFile(thumbPath);

          created++;
        } catch (err) {
          console.error(`[tasks] Failed to generate thumbnail for ${dir}/${file}:`, err);
        }
      }
    }

    console.log(`[tasks] Generated ${created} thumbnail(s).`);
  },
};
