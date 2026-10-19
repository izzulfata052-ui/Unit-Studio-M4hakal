/**
 * ============================================================================
 * UNIT STUDIO & PEMANCAR M4HAKAL — FULL-STACK BACKEND SERVER (REST API + SQLite)
 * Runtime   : Node.js v24+ (Built-in node:sqlite ACID Database + HTTP Range Streamer)
 * Database  : backend/studio_m4hakal.sqlite
 * Author    : Izzulft (024231441867 · izzulft@mail.m4hakal.ac.id)
 * ============================================================================
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const PORT = Number(process.env.PORT) || 3000;
const ROOT_DIR = __dirname;
const DB_DIR = path.join(ROOT_DIR, 'backend');
const DB_PATH = path.join(DB_DIR, 'studio_m4hakal.sqlite');
const HMAC_SECRET = process.env.M4HAKAL_HMAC_SECRET || 'M4HAKAL-STUDIO-PEMANCAR-2026-SECRET-KEY';

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize SQLite Database with WAL mode for concurrent read/write performance
const db = new DatabaseSync(DB_PATH);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    nim TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    full_title TEXT NOT NULL,
    prodi TEXT NOT NULL,
    angkatan TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS loans (
    id TEXT PRIMARY KEY,
    bon_title TEXT NOT NULL,
    room TEXT NOT NULL,
    pj TEXT NOT NULL,
    borrower TEXT NOT NULL,
    nim TEXT NOT NULL,
    email TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    purpose TEXT NOT NULL,
    items_json TEXT NOT NULL,
    status TEXT NOT NULL,
    qr_signature TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    cat TEXT NOT NULL,
    item TEXT NOT NULL,
    reason TEXT NOT NULL,
    votes INTEGER NOT NULL DEFAULT 1,
    voted INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day TEXT NOT NULL,
    mon TEXT NOT NULL,
    dow TEXT NOT NULL,
    time TEXT NOT NULL,
    color TEXT NOT NULL,
    title TEXT NOT NULL,
    room TEXT NOT NULL,
    pj TEXT NOT NULL,
    borrower TEXT NOT NULL
  );
`);

function signLoanQr(loanId, nim, startDate) {
  return crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(`${loanId}|${nim}|${startDate}`)
    .digest('hex')
    .slice(0, 16)
    .toUpperCase();
}

function seedDatabaseIfEmpty() {
  const userCount = db.prepare('SELECT COUNT(*) AS cnt FROM users').get().cnt;
  if (userCount === 0) {
    db.prepare(`
      INSERT INTO users (nim, name, full_title, prodi, angkatan, email, phone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      '024231441867',
      'Izzulft',
      'Izzulft — Mahasiswa Aktif M4HAKAL',
      'Manajemen Teknik Studio Produksi (D4)',
      '2024',
      'izzulft@mail.m4hakal.ac.id',
      '0812-3456-7890',
      'Aktif · Bebas Tanggungan Alat'
    );
  }

  const loanCount = db.prepare('SELECT COUNT(*) AS cnt FROM loans').get().cnt;
  if (loanCount === 0) {
    const insertLoan = db.prepare(`
      INSERT INTO loans (id, bon_title, room, pj, borrower, nim, email, start_date, end_date, purpose, items_json, status, qr_signature, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertLoan.run(
      'EBON-2026-0841',
      'Form Pemakaian Peralatan Workshop ENG',
      'Workshop ENG & Gudang Peralatan Produksi M4HAKAL',
      '',
      'Izzulft',
      '024231441867',
      'izzulft@mail.m4hakal.ac.id',
      '2026-10-18',
      '2026-10-20',
      'Praktikum Produksi Berita & Liputan Lapangan (ENG) — Akun Izzulft',
      JSON.stringify(['Sony PXW-Z190', 'Sennheiser MKH 416 T', 'Libec LX-7', 'Hollyland Mars 400S Pro']),
      'Disetujui · Siap Ambil',
      signLoanQr('EBON-2026-0841', '024231441867', '2026-10-18'),
      new Date().toISOString()
    );
    insertLoan.run(
      'EBON-2026-0839',
      'Form Pemakaian Ruang dan Peralatan Studio TV 1',
      'Studio Produksi TV 1 & Ruang Sub-Control 1',
      '',
      'Izzulft',
      '024231441867',
      'izzulft@mail.m4hakal.ac.id',
      '2026-10-21',
      '2026-10-21',
      'Produksi Program Talkshow Multi-Kamera Studio TV 1',
      JSON.stringify(['BMD ATEM 2M/E Production Studio 4K', 'Sennheiser EW-D ME2 Set (Q1-6)', 'Yamaha MG16XU']),
      'Terjadwal Resmi',
      signLoanQr('EBON-2026-0839', '024231441867', '2026-10-21'),
      new Date().toISOString()
    );
  }

  const suggCount = db.prepare('SELECT COUNT(*) AS cnt FROM suggestions').get().cnt;
  if (suggCount === 0) {
    const insertSugg = db.prepare(`
      INSERT INTO suggestions (author, cat, item, reason, votes, voted, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertSugg.run(
      'Izzulft (2024 · Manajemen Teknik Studio Produksi)',
      'Kamera & Lensa Sinema',
      'Sony FX6 Full-Frame Cinema Line (3 Unit)',
      'Sangat dibutuhkan untuk produksi dokumenter sinema dan tugas akhir mahasiswa M4HAKAL dengan low-light tinggi.',
      42,
      1,
      'Masuk Daftar Prioritas Pengadaan 2026',
      new Date().toISOString()
    );
    insertSugg.run(
      'Nadia Putri (2023 · Produksi Film & TV)',
      'Docking Video & OB Van',
      'Hollyland Solidcom C1 Pro 8-Slot Full-Duplex Intercom',
      'Komunikasi kru floor director dan kameramen saat praktik OB Van di lapangan.',
      31,
      0,
      'Ditinjau Koordinator Studio',
      new Date().toISOString()
    );
    insertSugg.run(
      'Rizky Pratama (2024 · Teknologi Permainan)',
      'Audio & Podcast Broadcast',
      'Rodecaster Pro II Integrated Audio Production Studio',
      'Mempercepat workflow live streaming multi-mic dan produksi drama radio modern.',
      27,
      0,
      'Disetujui Tahap Evaluasi',
      new Date().toISOString()
    );
  }
}

seedDatabaseIfEmpty();

const ARCHITECTURE_RECOMMENDATION = {
  project: 'e-Lounge Unit Studio & Pemancar M4HAKAL',
  recommendedStack: {
    frontend: {
      framework: 'Next.js 15 (React 19 + TypeScript)',
      styling: 'Tailwind CSS v4 + shadcn/ui + Framer Motion',
      stateManagement: 'TanStack Query (React Query v5) + Zustand',
      formsAndValidation: 'React Hook Form + Zod Schema Validation',
      mediaAndStreaming: 'HTML5 Byte-Range Video Player (1080p 16:9) + WebP/AVIF Katalog Optimization'
    },
    backend: {
      runtime: `Node.js ${process.version} (Active Server)`,
      framework: 'NestJS / Express TypeScript REST API',
      databasePrimary: 'PostgreSQL 16 (Production) / Built-in SQLite WAL (Active Prototype DB)',
      orm: 'Prisma ORM / Drizzle ORM (ACID Transaction Locking)',
      cachingAndRealtime: 'Redis 7 + WebSocket (Real-time Ketersediaan Alat & Antrean E-Bon)',
      securityAndAuth: 'SSO Civitas (@mail.m4hakal.ac.id) + JWT + HMAC-SHA256 Signed QR E-Bon'
    }
  }
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4'
};

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 2 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function mapLoanRow(row) {
  let items = [];
  try {
    items = JSON.parse(row.items_json || '[]');
  } catch (e) {}
  return {
    id: row.id,
    bonTitle: row.bon_title,
    room: row.room,
    pj: row.pj,
    borrower: row.borrower,
    nim: row.nim,
    email: row.email,
    startDate: row.start_date,
    endDate: row.end_date,
    purpose: row.purpose,
    items,
    status: row.status,
    qrSignature: row.qr_signature,
    createdAt: row.created_at
  };
}

function mapSuggestionRow(row) {
  return {
    id: row.id,
    author: row.author,
    cat: row.cat,
    item: row.item,
    reason: row.reason,
    votes: row.votes,
    voted: Boolean(row.voted),
    status: row.status
  };
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // ==================== REST API ENDPOINTS ====================
  try {
    if (pathname === '/api/health' && req.method === 'GET') {
      const loansCnt = db.prepare('SELECT COUNT(*) AS cnt FROM loans').get().cnt;
      const suggCnt = db.prepare('SELECT COUNT(*) AS cnt FROM suggestions').get().cnt;
      return sendJson(res, 200, {
        ok: true,
        service: 'M4HAKAL e-Lounge Studio Backend API',
        runtime: `Node.js ${process.version}`,
        database: 'SQLite 3 (WAL Mode · ACID Transactions)',
        dbFile: 'backend/studio_m4hakal.sqlite',
        stats: {
          activeLoans: loansCnt,
          suggestionsCount: suggCnt,
          catalogUnits: 98
        },
        serverTime: new Date().toISOString()
      });
    }

    if (pathname === '/api/architecture' && req.method === 'GET') {
      return sendJson(res, 200, {
        ok: true,
        ...ARCHITECTURE_RECOMMENDATION
      });
    }

    if (pathname === '/api/profile' && req.method === 'GET') {
      const u = db.prepare('SELECT * FROM users WHERE nim = ?').get('024231441867');
      return sendJson(res, 200, {
        ok: true,
        profile: {
          name: u.name,
          fullTitle: u.full_title,
          nim: u.nim,
          prodi: u.prodi,
          angkatan: u.angkatan,
          email: u.email,
          phone: u.phone,
          status: u.status
        }
      });
    }

    if (pathname === '/api/loans' && req.method === 'GET') {
      const rows = db.prepare('SELECT * FROM loans ORDER BY rowid DESC').all();
      return sendJson(res, 200, {
        ok: true,
        loans: rows.map(mapLoanRow)
      });
    }

    if (pathname === '/api/loans' && req.method === 'POST') {
      const body = await readJsonBody(req);
      const id = body.id || ('EBON-2026-' + Math.floor(1000 + Math.random() * 9000));
      const bonTitle = body.bonTitle || 'Form Pemakaian Peralatan Workshop ENG';
      const room = body.room || 'Workshop ENG & Gudang Peralatan Produksi M4HAKAL';
      const pj = body.pj || 'Haryanto & Koordinator ENG';
      const borrower = body.borrower || 'Izzulft';
      const nim = body.nim || '024231441867';
      const email = body.email || 'izzulft@mail.m4hakal.ac.id';
      const startDate = body.startDate || new Date().toISOString().slice(0, 10);
      const endDate = body.endDate || startDate;
      const purpose = body.purpose || 'Praktikum Produksi Studio M4HAKAL';
      const items = Array.isArray(body.items) ? body.items : [];
      const status = body.status || 'Menunggu Verifikasi Koordinator';
      const qrSignature = signLoanQr(id, nim, startDate);
      const createdAt = new Date().toISOString();

      db.prepare(`
        INSERT OR REPLACE INTO loans
        (id, bon_title, room, pj, borrower, nim, email, start_date, end_date, purpose, items_json, status, qr_signature, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, bonTitle, room, pj, borrower, nim, email,
        startDate, endDate, purpose, JSON.stringify(items),
        status, qrSignature, createdAt
      );

      const createdRow = db.prepare('SELECT * FROM loans WHERE id = ?').get(id);
      return sendJson(res, 201, {
        ok: true,
        message: 'E-Bon berhasil disimpan ke database SQLite M4HAKAL',
        loan: mapLoanRow(createdRow)
      });
    }

    if (pathname === '/api/suggestions' && req.method === 'GET') {
      const rows = db.prepare('SELECT * FROM suggestions ORDER BY votes DESC, id DESC').all();
      return sendJson(res, 200, {
        ok: true,
        suggestions: rows.map(mapSuggestionRow)
      });
    }

    if (pathname === '/api/suggestions' && req.method === 'POST') {
      const body = await readJsonBody(req);
      if (!body.item || !body.reason) {
        return sendJson(res, 400, { ok: false, error: 'Nama alat dan alasan wajib diisi' });
      }
      const author = body.author || 'Izzulft (2024 · Manajemen Teknik Studio Produksi)';
      const cat = body.cat || 'Workshop ENG & Audio';
      const status = 'Baru Diajukan · Menunggu Tinjauan';
      const createdAt = new Date().toISOString();

      const info = db.prepare(`
        INSERT INTO suggestions (author, cat, item, reason, votes, voted, status, created_at)
        VALUES (?, ?, ?, ?, 1, 1, ?, ?)
      `).run(author, cat, body.item, body.reason, status, createdAt);

      const newRow = db.prepare('SELECT * FROM suggestions WHERE id = ?').get(info.lastInsertRowid);
      return sendJson(res, 201, {
        ok: true,
        suggestion: mapSuggestionRow(newRow)
      });
    }

    const voteMatch = pathname.match(/^\/api\/suggestions\/(\d+)\/vote$/);
    if (voteMatch && req.method === 'POST') {
      const id = Number(voteMatch[1]);
      const row = db.prepare('SELECT * FROM suggestions WHERE id = ?').get(id);
      if (!row) {
        return sendJson(res, 404, { ok: false, error: 'Usulan tidak ditemukan' });
      }
      const nextVoted = row.voted ? 0 : 1;
      const nextVotes = row.voted ? Math.max(0, row.votes - 1) : row.votes + 1;
      db.prepare('UPDATE suggestions SET voted = ?, votes = ? WHERE id = ?').run(nextVoted, nextVotes, id);
      const updated = db.prepare('SELECT * FROM suggestions WHERE id = ?').get(id);
      return sendJson(res, 200, {
        ok: true,
        suggestion: mapSuggestionRow(updated)
      });
    }
  } catch (apiErr) {
    return sendJson(res, 500, { ok: false, error: apiErr.message });
  }

  // ==================== STATIC FILE & HTTP 206 BYTE-RANGE VIDEO SERVER ====================
  const relPath = pathname === '/' ? '/index.html' : pathname;
  const safePath = path.normalize(path.join(ROOT_DIR, relPath));
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  if (!fs.existsSync(safePath) || fs.statSync(safePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404 Not Found');
  }

  const ext = path.extname(safePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const stat = fs.statSync(safePath);

  // Support HTTP 206 Partial Content Range requests for smooth 1080p MP4 video seeking
  if (ext === '.mp4' && req.headers.range) {
    const parts = req.headers.range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    if (start >= stat.size || end >= stat.size) {
      res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` });
      return res.end();
    }
    const chunkSize = end - start + 1;
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': contentType
    });
    return fs.createReadStream(safePath, { start, end }).pipe(res);
  }

  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Accept-Ranges': 'bytes'
  });
  fs.createReadStream(safePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`======================================================================`);
  console.log(`🚀 M4HAKAL e-Lounge Studio Full-Stack Server Active!`);
  console.log(`🌐 Frontend Portal : http://localhost:${PORT}`);
  console.log(`🔌 REST API Health : http://localhost:${PORT}/api/health`);
  console.log(`🗄️  SQLite Database : ${DB_PATH}`);
  console.log(`======================================================================`);
});
