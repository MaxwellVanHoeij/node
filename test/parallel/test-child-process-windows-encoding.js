'use strict';
const common = require('../common');
const assert = require('assert');
const { spawn } = require('child_process');

if (process.platform !== 'win32') {
  common.skip('Windows-specific test');
  return;
}

// Test UTF-8 output
{
  const cmd = spawn('cmd.exe', ['/c', 'chcp 65001 >nul && echo 中文测试']);
  let output = '';
  cmd.stdout.on('data', (data) => output += data.toString());
  cmd.on('close', common.mustCall(() => {
    assert(output.includes('中文测试'), 'UTF-8 output mismatch');
  }));
}

// Test GBK fallback (if applicable to your fix)
{
  const cmd = spawn('cmd.exe', ['/c', 'echo 中文测试'], {
    env: { ...process.env, CHCP: '936' } // Force GBK
  });
  let output = '';
  cmd.stdout.setEncoding('binary');
  cmd.stdout.on('data', (data) => output += data);
  cmd.on('close', common.mustCall(() => {
    assert(output.includes('中文测试'), 'GBK output mismatch');
  }));
}
