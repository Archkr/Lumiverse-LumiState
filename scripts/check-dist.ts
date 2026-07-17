import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const targets = [
  { source: "src/backend.ts", output: "dist/backend.js", generatedName: "backend.js", target: "bun" },
  { source: "src/frontend.ts", output: "dist/frontend.js", generatedName: "frontend.js", target: "browser" },
] as const;

function sameBytes(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  return left.every((value, index) => value === right[index]);
}

const temporaryDirectory = await mkdtemp(join(tmpdir(), "lumi-state-dist-"));
let hasDrift = false;

try {
  for (const bundle of targets) {
    const generatedPath = join(temporaryDirectory, bundle.generatedName);
    const child = Bun.spawn(
      ["bun", "build", bundle.source, "--outfile", generatedPath, "--target", bundle.target],
      { stdout: "inherit", stderr: "inherit" },
    );
    if ((await child.exited) !== 0) throw new Error(`Bundle build failed: ${bundle.output}`);

    const [generated, committed] = await Promise.all([
      readFile(generatedPath),
      readFile(bundle.output).catch(() => null),
    ]);
    if (!committed || !sameBytes(generated, committed)) {
      console.error(`Generated bundle drift detected: ${bundle.output}`);
      hasDrift = true;
    }
  }
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}

if (hasDrift) throw new Error("Generated bundle drift detected.");
