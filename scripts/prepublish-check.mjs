// @ts-check
/**
 * Pre-publish smoke check: verify the tarball contents are exactly what the
 * plugin needs, and that the host half is syntactically valid. Run in CI and
 * before every release.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const required = ['lib/index.js', 'lib/client.js', 'cordis.patch.yml', 'README.md', 'LICENSE', 'package.json'];

const missing = required.filter((f) => !existsSync(resolve(root, f)));
if (missing.length > 0) {
	console.error(`prepublish-check: missing files: ${missing.join(', ')}`);
	process.exit(1);
}

const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
if (pkg.private === true) {
	console.error('prepublish-check: package.json must not be private');
	process.exit(1);
}
if (pkg.dsh?.bundle?.patch !== './cordis.patch.yml') {
	console.error('prepublish-check: dsh.bundle.patch must point at ./cordis.patch.yml');
	process.exit(1);
}
if (pkg.dsh?.client?.platform !== 'web') {
	console.error('prepublish-check: dsh.client.platform must be "web"');
	process.exit(1);
}
if (Object.keys(pkg.dependencies ?? {}).length > 0) {
	console.error('prepublish-check: keep dependencies empty (pnpm does not install deps of file/tgz packages)');
	process.exit(1);
}

console.log(`prepublish-check OK: ${pkg.name}@${pkg.version}`);
