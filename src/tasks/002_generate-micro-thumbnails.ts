import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";
import type { Task } from "@/lib/tasks";

const MICRO_WIDTH = 150;
const MICRO_QUALITY = 70;

export const task: Task = {
  name: "002_generate-micro-thumbnails",
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
        if (file.includes("_thumb") || file.includes("_micro")) continue;

        const ext = extname(file);
        const name = basename(file, ext);
        const microPath = join(dirPath, `${name}_micro${ext}`);

        try {
          await stat(microPath);
          continue; // Micro thumbnail already exists
        } catch {
          // Generate it
        }

        try {
          await sharp(join(dirPath, file))
            .rotate()
            .resize({ width: MICRO_WIDTH, withoutEnlargement: true })
            .webp({ quality: MICRO_QUALITY })
            .toFile(microPath);

          created++;
        } catch (err) {
          console.error(`[tasks] Failed to generate micro thumbnail for ${dir}/${file}:`, err);
        }
      }
    }

    console.log(`[tasks] Generated ${created} micro thumbnail(s).`);
  },
};
