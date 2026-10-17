import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(
  readFileSync(join(root, "app", "lib", "villa-sequence-config.json"), "utf8"),
);
const frameDirectories = ["frames-optimized", "frames"];
const frameDirectory = frameDirectories.find((directory) => {
  const path = join(root, "public", directory);
  return existsSync(path) && readdirSync(path).some((name) => /^frame_\d{4}\.jpg$/i.test(name));
});

if (!frameDirectory) {
  throw new Error("No frames found in public/frames-optimized or public/frames.");
}

if (!Number.isFinite(config.sourceDurationSeconds) || config.sourceDurationSeconds <= 0) {
  throw new Error("sourceDurationSeconds must be a positive number.");
}

const names = readdirSync(join(root, "public", frameDirectory), { withFileTypes: true })
  .filter((entry) => entry.isFile() && /^frame_\d{4}\.jpg$/i.test(entry.name))
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

if (!names.length) {
  throw new Error(`No frame_####.jpg files found in public/${frameDirectory}.`);
}

const frames = names.map((filename, index) => {
  const expectedFilename = `frame_${String(index + 1).padStart(4, "0")}.jpg`;
  if (filename.toLowerCase() !== expectedFilename.toLowerCase()) {
    throw new Error(
      `Frame sequence is not continuous: expected ${expectedFilename}, found ${filename}.`,
    );
  }

  return {
    index,
    frameNumber: index + 1,
    filename,
    timestampSeconds: Number(
      ((index / Math.max(1, names.length - 1)) * config.sourceDurationSeconds).toFixed(3),
    ),
  };
});

for (const [index, scene] of config.scenes.entries()) {
  if (
    !Number.isFinite(scene.startSeconds) ||
    !Number.isFinite(scene.endSeconds) ||
    scene.startSeconds < 0 ||
    scene.endSeconds <= scene.startSeconds ||
    scene.endSeconds > config.sourceDurationSeconds
  ) {
    throw new Error(`Scene ${index + 1} has invalid timestamp boundaries.`);
  }
}

if (
  config.scenes[0]?.startSeconds !== 0 ||
  config.scenes.at(-1)?.endSeconds !== config.sourceDurationSeconds ||
  config.scenes.some(
    (scene, index) => index > 0 && scene.startSeconds !== config.scenes[index - 1].endSeconds,
  )
) {
  throw new Error("Scene timestamps must be continuous and cover the full source duration.");
}

const outputPath = join(root, "app", "generated", "frame-manifest.json");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  `${JSON.stringify(
    {
      frameDirectory,
      sourceDurationSeconds: config.sourceDurationSeconds,
      frameCount: frames.length,
      frames,
    },
    null,
    2,
  )}\n`,
);

console.log(`Generated ${frames.length} frames in app/generated/frame-manifest.json.`);
