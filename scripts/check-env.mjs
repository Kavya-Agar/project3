// Verifies that a teammate's machine is ready to run the project.
// Usage: npm run check          (versions, dependencies, .env)
//        npm run check:db       (also tests the database connection)
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIN_NODE_MAJOR = 20;
const MIN_NPM_MAJOR = 10;
const REQUIRED_ENV_VARS = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const checkDatabase = process.argv.includes('--db');

const results = [];
const record = (ok, label, fix) => results.push({ ok, label, fix });
const major = (version) => Number.parseInt(version.replace(/^v/, ''), 10);
const run = (command) => {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
};

const nodeVersion = process.version;
record(major(nodeVersion) >= MIN_NODE_MAJOR, `Node ${nodeVersion} (need >= ${MIN_NODE_MAJOR})`,
  'Install Node 22 LTS (https://nodejs.org) or run `nvm install && nvm use` in the repo root.');

const npmVersion = run('npm --version');
record(npmVersion !== null && major(npmVersion) >= MIN_NPM_MAJOR, `npm ${npmVersion ?? 'not found'} (need >= ${MIN_NPM_MAJOR})`,
  'Run `npm install -g npm@latest`.');

record(run('git --version') !== null, run('git --version') ?? 'git not found', 'Install git.');

for (const dir of ['server', 'client']) {
  record(existsSync(path.join(ROOT, dir, 'package-lock.json')), `${dir}/package-lock.json is present`,
    'Pull the latest code; the lockfile should be committed.');
  record(existsSync(path.join(ROOT, dir, 'node_modules')), `${dir} dependencies installed`,
    'Run `npm run setup` from the repo root.');
}

function readEnvFile(file) {
  return Object.fromEntries(
    readFileSync(file, 'utf8')
      .split('\n')
      .filter((line) => line.includes('=') && !line.trimStart().startsWith('#'))
      .map((line) => [line.slice(0, line.indexOf('=')).trim(), line.slice(line.indexOf('=') + 1).trim()]),
  );
}

const envFile = path.join(ROOT, 'server', '.env');
if (existsSync(envFile)) {
  const env = readEnvFile(envFile);
  const missing = REQUIRED_ENV_VARS.filter((name) => !env[name] || env[name].startsWith('your_'));
  record(missing.length === 0, missing.length ? `server/.env is missing: ${missing.join(', ')}` : 'server/.env has all database settings',
    'Fill in the values in server/.env (ask the team lead for the shared DB credentials).');
} else {
  record(false, 'server/.env exists', 'Copy server/.env.example to server/.env and fill in the DB credentials.');
}

if (checkDatabase && results.every((result) => result.ok)) {
  try {
    process.chdir(path.join(ROOT, 'server'));
    const { query, pool } = await import('../server/src/db/pool.js');
    await query('SELECT 1');
    await pool.end();
    record(true, 'Database connection works');
  } catch (error) {
    record(false, `Database connection failed: ${error.message}`,
      'Check server/.env, make sure you are on the TAMU network/VPN, and see the README troubleshooting section.');
  }
}

for (const { ok, label, fix } of results) {
  console.log(`${ok ? '✅' : '❌'} ${label}`);
  if (!ok && fix) console.log(`   → ${fix}`);
}
const failed = results.filter((result) => !result.ok).length;
console.log(failed ? `\n${failed} problem(s) found.` : '\nEnvironment looks good.');
process.exitCode = failed ? 1 : 0;
