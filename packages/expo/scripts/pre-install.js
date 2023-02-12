const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

const projectRoot = cwd;
const workspaceRoot = path.resolve(cwd, '../../');

console.log('projectRoot: ', projectRoot);
console.log('workspaceRoot: ', workspaceRoot);

console.log(`run "npm i" in ${workspaceRoot}`);
spawnSync('npm i', {
  cwd: workspaceRoot,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, HUSKY: '0' },
});

const coreRoot = path.resolve(workspaceRoot, 'packages/core');
console.log(`run "npm run build" in ${coreRoot}`);
spawnSync('npm run build', {
  cwd: coreRoot,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, HUSKY: '0' },
});
