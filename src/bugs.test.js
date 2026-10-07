// preventive regression tests for the two reported bugs.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const pinPath = path.join(rootDir, 'functions/api/owner-pin.js');
const gatePath = path.join(rootDir, 'src/components/owner/OwnerGatekeeper.jsx');
const roomPath = path.join(rootDir, 'src/pages/OwnerPrivateRoom.jsx');

const pinSrc = readFileSync(pinPath, 'utf8');
const gateSrc = readFileSync(gatePath, 'utf8');
const roomSrc = readFileSync(roomPath, 'utf8');

describe('PIN error handling', () => {
  it('uses safe pbkdf2 iterations below the browser limit', () => {
    const m = pinSrc.match(/const ITERATIONS\s*=\s*(\d+)\s*;/);
    expect(m).toBeTruthy();
    const n = Number(m[1]);
    expect(n).toBeLessThanOrEqual(100000);
    expect(n).toBeGreaterThanOrEqual(10000);
  });

  it('does not leak raw error text', () => {
    expect(pinSrc.indexOf('error?.message')).toBe(-1);
    expect(pinSrc.indexOf('error.message')).toBe(-1);
  });

  it('has friendly Arabic fallbacks', () => {
    const retryMsg = '\u0623\u0639\u062f \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629';
    const connMsg = '\u062a\u0639\u0630\u0631 \u0627\u0644\u0627\u062a\u0635\u0627\u0644 \u0628\u062d\u0627\u0631\u0633 \u0627\u0644\u0623\u0645\u0627\u0646';
    expect(gateSrc.includes(retryMsg)).toBe(true);
    expect(gateSrc.includes(connMsg)).toBe(true);
  });

  it('retries cold-start API status before giving up', () => {
    const body = gateSrc.slice(gateSrc.indexOf('useEffect'), gateSrc.indexOf('}, [])'));
    expect(body.includes('attempt')).toBe(true);
    expect(body.includes('setTimeout')).toBe(true);
    expect(body.match(/callPinApi/g).length).toBeGreaterThanOrEqual(1);
  });

  it('normalizes Arabic-Indic zeros to ASCII digits on server', () => {
    expect(pinSrc.includes('normalizePinInput')).toBe(true);
    expect(pinSrc.includes('\\u0660')).toBe(true);
  });
});

describe('private-room sidebar blocks clicks', () => {
  it('starts closed on mobile via matchMedia', () => {
    const body = roomSrc.slice(roomSrc.indexOf('const [sidebarOpen'));
    expect(body.includes('window.matchMedia')).toBe(true);
    expect(body.includes('min-width: 1024px')).toBe(true);
    expect(body.includes('useState(true)')).toBe(false);
  });

  it('closes notifications dropdown on backdrop click and on item select', () => {
    const dropdown = roomSrc.slice(roomSrc.indexOf('{/* Notifications Dropdown'));
    expect(dropdown.includes('onClick={() => setShowNotifications(false)}')).toBe(true);
    expect(dropdown.includes('className="fixed inset-0 z-40"')).toBe(true);
    expect(dropdown.includes('className="w-full text-right p-4 hover:bg-slate-700/50"')).toBe(true);
    expect(dropdown.includes('aria-hidden="true"')).toBe(true);
  });

  it('closes notifications dropdown on Escape key', () => {
    const escBlock = roomSrc.slice(roomSrc.indexOf("e.key === 'Escape'"));
    expect(escBlock.includes("setShowNotifications(false)")).toBe(true);
  });
});