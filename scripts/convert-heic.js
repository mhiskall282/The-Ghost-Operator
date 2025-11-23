#!/usr/bin/env node
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const imagesDir = path.resolve('frontend', 'public', 'images');
const outputDir = path.join(imagesDir, 'converted');

async function ensureDir(p) {
  try { await stat(p); } catch { await mkdir(p, { recursive: true }); }
}

function targetName(name) {
  // Replace spaces/parentheses with hyphens, lowercase
  const base = name
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .toLowerCase()
    .replace(/\.heic$/i, '');
  return base + '.webp';
}

async function convert() {
  await ensureDir(outputDir);
  const files = await readdir(imagesDir);
  const heicFiles = files.filter(f => /\.heic$/i.test(f));
  if (!heicFiles.length) {
    console.log('No HEIC files found.');
    return;
  }
  for (const file of heicFiles) {
    const src = path.join(imagesDir, file);
    const dest = path.join(outputDir, targetName(file));
    try {
      await sharp(src)
        .rotate() // auto rotate based on EXIF
        .webp({ quality: 85 })
        .toFile(dest);
      console.log(`Converted: ${file} -> ${path.basename(dest)}`);
    } catch (err) {
      console.error(`Failed to convert ${file}:`, err.message);
    }
  }
  console.log('Conversion complete. Converted files are in images/converted/.');
}

convert();
