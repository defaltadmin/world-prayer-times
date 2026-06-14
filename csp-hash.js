#!/usr/bin/env node
// csp-hash.js — compute CSP hashes for inline <script> and <style> blocks
// Run: node csp-hash.js
// Then replace 'unsafe-inline' in _headers with the printed hash values.
const crypto = require('crypto');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const hash = content => `'sha256-${crypto.createHash('sha256').update(content).digest('base64')}'`;

const scripts = [], styles = [];
let m;

const scriptRe = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi;
while ((m = scriptRe.exec(html)) !== null) {
    const c = m[1]; if (c.trim()) scripts.push(hash(c));
}

const styleRe = /<style[^>]*>([\s\S]*?)<\/style>/gi;
while ((m = styleRe.exec(html)) !== null) {
    const c = m[1]; if (c.trim()) styles.push(hash(c));
}

console.log('\nscript-src hashes:');
console.log(scripts.join(' ') || '(none)');
console.log('\nstyle-src hashes:');
console.log(styles.join(' ') || '(none)');
console.log('\nReplace \'unsafe-inline\' in _headers with these values.\n');
