/**
 * LKPD Digital — Membuat Konten Media Sosial TikTok (Kelas X Fase E)
 * Versi: 2.0.0 — backend Google Apps Script + Google Sheets
 * Terhubung penuh ke Google Sheets secara Real-Time & Kompatibel dengan Cloudflare Pages + Worker.
 */

// === BOILERPLATE: KONFIGURASI DAN STRUKTUR DATABASE ===
const APP_CONFIG = Object.freeze({
  TITLE: 'LKPD Digital | Membuat Konten TikTok',
  TIMEZONE: 'Asia/Jakarta',
  SPREADSHEET_ID_PROPERTY: 'SPREADSHEET_ID',
  MAX_PAYLOAD_CHARS: 35000,
  MAX_TEXT_CHARS: 5000,
  MAX_NOTE_CHARS: 2000,
  MAX_PAGE_SIZE: 50,
  DEFAULT_PAGE_SIZE: 10,
  LOCK_TIMEOUT_MS: 10000,
  ROLES: ['siswa', 'guru', 'admin'],
  SECTIONS: ['A', 'B', 'C', 'D', 'E', 'F'],
  SUBMISSION_TYPES: [
    'video_final',
    'naskah_storyboard',
    'logbook',
    'kemasan_video',
    'peer_reflection'
  ],
  SUBMISSION_STATUSES: ['Draf', 'Terkumpul', 'Diperiksa', 'Perlu Perbaikan']
});

const SHEET_CONFIG = Object.freeze({
  Konfigurasi: ['key', 'value', 'updatedAt'],
  Pengguna: ['userId', 'email', 'nama', 'role', 'kelas', 'aktif', 'createdAt'],
  Kelompok: ['groupId', 'namaKelompok', 'kelas', 'tanggalKegiatan', 'createdBy', 'status', 'createdAt', 'updatedAt'],
  AnggotaKelompok: ['membershipId', 'groupId', 'userId', 'namaTampilan', 'status'],
  JawabanIndividu: ['responseId', 'userId', 'groupId', 'bagian', 'payloadJson', 'status', 'updatedAt', 'submittedAt'],
  JawabanKelompok: ['responseId', 'groupId', 'bagian', 'payloadJson', 'status', 'updatedBy', 'updatedAt', 'submittedAt'],
  Pengumpulan: ['submissionId', 'groupId', 'jenisProduk', 'urlDrive', 'namaFile', 'status', 'submittedAt', 'checkedBy', 'checkedAt'],
  PenilaianGuru: ['gradingId', 'groupId', 'userIdOpsional', 'nilaiLKPD', 'catatanGuru', 'graderEmail', 'updatedAt'],
  LogAktivitas: ['logId', 'timestamp', 'actorEmail', 'action', 'entityType', 'entityId', 'outcome']
});

// Field names follow data-save IDs used by Index.html.
const FIELD_ALLOWLIST = Object.freeze({
  A: {
    individual: ['a_name', 'a_absen', 'a_q1', 'a_q2', 'a_q3']
  },
  B: {
    group: [
      'b_match0', 'b_match1', 'b_match2', 'b_match3', 'b_match4',
      'b_title', 'b_hook', 'b_message', 'b_cta', 'b_reason',
      'b_ethics1', 'b_ethics2', 'b_ethics3', 'b_ethics4'
    ]
  },
  C: {
    group: [
      'c_topic', 'c_audience', 'c_message', 'c_hook', 'c_cta', 'c_unique',
      'c_role0', 'c_role1', 'c_role2', 'c_role3', 'c_role4',
      'c_scriptHook', 'c_scriptBody', 'c_scriptCTA',
      'c_location', 'c_props', 'c_app', 'c_music', 'c_permission',
      'c_visual1', 'c_visual2', 'c_visual3', 'c_visual4', 'c_visual5', 'c_visual6',
      'c_dialog1', 'c_dialog2', 'c_dialog3', 'c_dialog4', 'c_dialog5', 'c_dialog6',
      'c_audio1', 'c_audio2', 'c_audio3', 'c_audio4', 'c_audio5', 'c_audio6',
      'c_duration1', 'c_duration2', 'c_duration3', 'c_duration4', 'c_duration5', 'c_duration6'
    ]
  },
  D: {
    group: [
      'd_task1', 'd_task2', 'd_task3', 'd_owner1', 'd_owner2', 'd_owner3',
      'd_status1', 'd_status2', 'd_status3',
      'd_problem', 'd_cause', 'd_solution', 'd_result',
      'd_check0', 'd_check1', 'd_check2', 'd_check3'
    ]
  },
  E: {
    group: [
      'e_check0', 'e_check1', 'e_check2', 'e_check3', 'e_check4',
      'e_fix0', 'e_fix1', 'e_fix2', 'e_fix3', 'e_fix4',
      'e_cover', 'e_caption', 'e_hashtags', 'e_credit', 'e_filename'
    ]
  },
  F: {
    individual: [
      'f_group', 'f_score', 'f_good', 'f_suggest',
      'f_peerName0', 'f_peerName1', 'f_peerName2',
      'f_peer0_aktif', 'f_peer0_respect', 'f_peer0_duty',
      'f_peer1_aktif', 'f_peer1_respect', 'f_peer1_duty',
      'f_peer2_aktif', 'f_peer2_respect', 'f_peer2_duty',
      'f_ind1', 'f_ind2', 'f_ind3'
    ],
    group: ['f_group1', 'f_group2', 'f_group3']
  }
});

// === BOILERPLATE: WEB APP ENTRY POINT & HTTP API ===
function doGet(e) {
  if (e && e.parameter && e.parameter.action) {
    return handleApiRequest_(e.parameter.action, e.parameter);
  }
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle(APP_CONFIG.TITLE)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }
    const action = payload.action || (e && e.parameter && e.parameter.action);
    return handleApiRequest_(action, payload);
  } catch (err) {
    return createJsonResponse_({
      status: 'error',
      data: null,
      message: safeErrorMessage_(err)
    });
  }
}

function createJsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleApiRequest_(action, payload) {
  let result;
  switch (action) {
    case 'setupDatabase':
      result = setupDatabase();
      break;
    case 'init6Kelompok36Siswa':
      result = init6Kelompok36Siswa(payload);
      break;
    case 'getBootstrap':
    case 'bootstrap':
      result = apiGetBootstrap(payload);
      break;
    case 'getPublicData':
    case 'getInitialData':
      result = apiGetInitialData();
      break;
    case 'login':
      result = apiLogin(payload);
      break;
    case 'registerStudent':
      result = apiRegisterStudent(payload);
      break;
    case 'getMyAnswers':
      result = apiGetMyAnswers(payload);
      break;
    case 'saveAnswer':
      result = apiSaveAnswer(payload);
      break;
    case 'submitWork':
      result = apiSubmitWork(payload);
      break;
    case 'getTeacherDashboard':
      result = apiGetTeacherDashboard(payload);
      break;
    case 'getGroupDetails':
      result = apiGetGroupDetails(payload);
      break;
    case 'saveGrade':
      result = apiSaveGrade(payload);
      break;
    case 'reviewSubmission':
      result = apiReviewSubmission(payload);
      break;
    case 'createGroup':
      result = apiCreateGroup(payload);
      break;
    default:
      result = { status: 'error', data: null, message: 'Action tidak dikenal: ' + action };
      break;
  }
  return createJsonResponse_(result);
}

// === BOILERPLATE: DATABASE DAN HEADER VALIDATION ===
/**
 * Jalankan sekali dari Apps Script Editor atau panggil via API setupDatabase.
 * Fungsi ini membuat sheet yang belum ada, memberi header, dan menginisialisasi
 * starter data otomatis jika database baru dibuat sehingga siap pakai.
 */
function setupDatabase() {
  try {
    const ss = getDatabaseSpreadsheet_(true);
    const props = PropertiesService.getScriptProperties();
    props.setProperty(APP_CONFIG.SPREADSHEET_ID_PROPERTY, ss.getId());

    const createdSheets = [];
    const validatedSheets = [];
    const issues = [];

    Object.keys(SHEET_CONFIG).forEach(function (sheetName) {
      const expectedHeaders = SHEET_CONFIG[sheetName];
      let sheet = ss.getSheetByName(sheetName);

      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
        sheet.setFrozenRows(1);
        sheet.getRange(1, 1, 1, expectedHeaders.length)
          .setFontWeight('bold')
          .setBackground('#000000')
          .setFontColor('#25F4EE');
        sheet.autoResizeColumns(1, expectedHeaders.length);
        createdSheets.push(sheetName);
        return;
      }

      const lastColumn = sheet.getLastColumn();
      const lastRow = sheet.getLastRow();
      if (lastRow === 0 || lastColumn === 0) {
        sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
        sheet.setFrozenRows(1);
        validatedSheets.push(sheetName);
        return;
      }

      const existingHeaders = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0]
        .map(function (v) { return String(v || '').trim(); });
      const missing = expectedHeaders.filter(function (h) { return existingHeaders.indexOf(h) === -1; });
      if (missing.length) {
        issues.push('Sheet "' + sheetName + '" belum memiliki header: ' + missing.join(', ') + '. Header lama tidak diubah.');
      } else {
        validatedSheets.push(sheetName);
        if (sheet.getFrozenRows() < 1) sheet.setFrozenRows(1);
      }
    });

    // Seed starter data jika sheet Pengguna baru/kosong
    seedInitialData_(ss);

    const resultData = {
      spreadsheetName: ss.getName(),
      spreadsheetId: ss.getId(),
      createdSheets: createdSheets,
      validatedSheets: validatedSheets,
      issues: issues
    };
    if (issues.length) {
      return {
        status: 'error',
        data: resultData,
        message: 'Setup selesai sebagian. Tinjau header sheet manual: ' + issues.join('; ')
      };
    }
    return {
      status: 'success',
      data: resultData,
      message: 'Setup database berhasil. Semua sheet siap dan terhubung 100% ke Google Sheets.'
    };
  } catch (err) {
    console.error('setupDatabase gagal: ' + safeErrorMessage_(err));
    return {
      status: 'error',
      data: null,
      message: safeErrorMessage_(err) || 'Setup database gagal. Periksa spreadsheet dan izin Apps Script.'
    };
  }
}

/** Inisialisasi konfigurasi awal dan akun starter agar database langsung dapat digunakan */
function seedInitialData_(ss) {
  try {
    init6Kelompok36SiswaInternal_(ss, false);
  } catch (err) {
    console.error('seedInitialData_ warning: ' + safeErrorMessage_(err));
  }
}

/**
 * Endpoint API & Helper Fungsi untuk Menginisialisasi 6 Kelompok dan 36 Siswa (Kelas X Fase E).
 * Setiap kelompok terdiri dari 6 siswa.
 * Guru dapat memicu fungsi ini langsung lewat tombol di Dashboard Guru atau Apps Script.
 */
function init6Kelompok36Siswa(payload) {
  return apiCall_(function () {
    const ss = getDatabaseSpreadsheet_(false);
    const forceReset = payload && payload.forceReset === true;
    return init6Kelompok36SiswaInternal_(ss, forceReset);
  });
}

function init6Kelompok36SiswaInternal_(ss, forceReset) {
  const now = now_();

  // 1. Sheet Konfigurasi
  const configSheet = ss.getSheetByName('Konfigurasi');
  if (configSheet) {
    const defaultConfigs = [
      ['GURU_PIN', '123456', now],
      ['SEKOLAH', 'SMA Negeri 1 Bancar', now],
      ['MATA_PELAJARAN', 'Kokurikuler Fase E - Konten TikTok', now],
      ['JUMLAH_KELOMPOK', '6', now],
      ['JUMLAH_SISWA', '36', now]
    ];
    defaultConfigs.forEach(function (item) {
      upsertByKeys_('Konfigurasi', ['key'], { key: item[0], value: item[1], updatedAt: item[2] });
    });
  }

  // 2. Akun Guru Utama
  upsertByKeys_('Pengguna', ['userId'], {
    userId: 'USR-GURU-01',
    email: 'guru@sman1bancar.sch.id',
    nama: 'Ibu Niken Indah, S.Pd.',
    role: 'guru',
    kelas: 'Semua',
    aktif: true,
    createdAt: now
  });

  // 3. Daftarkan 6 Kelompok Resmi
  const groupDefs = [
    { id: 'GRP-01', nama: 'Kelompok 1' },
    { id: 'GRP-02', nama: 'Kelompok 2' },
    { id: 'GRP-03', nama: 'Kelompok 3' },
    { id: 'GRP-04', nama: 'Kelompok 4' },
    { id: 'GRP-05', nama: 'Kelompok 5' },
    { id: 'GRP-06', nama: 'Kelompok 6' }
  ];

  groupDefs.forEach(function (g) {
    upsertByKeys_('Kelompok', ['groupId'], {
      groupId: g.id,
      namaKelompok: g.nama,
      kelas: 'X-1',
      tanggalKegiatan: now,
      createdBy: 'USR-GURU-01',
      status: 'aktif',
      createdAt: now,
      updatedAt: now
    });
  });

  // 4. Daftar 36 Siswa (6 Siswa per Kelompok)
  const starterNames = [
    // Kelompok 1 (1 - 6)
    'Ahmad Fauzi', 'Alya Safitri', 'Anisa Rahma', 'Budi Santoso', 'Citra Dewi', 'Daffa Pratama',
    // Kelompok 2 (7 - 12)
    'Dimas Prayoga', 'Eka Saputra', 'Fajar Ramadhan', 'Gita Permata', 'Hana Lestari', 'Ilham Hidayat',
    // Kelompok 3 (13 - 18)
    'Jessica Amanda', 'Kevin Aditya', 'Laras Salsabila', 'Muhammad Rizky', 'Nabila Zahra', 'Naufal Hakim',
    // Kelompok 4 (19 - 24)
    'Olivia Putri', 'Panji Kusuma', 'Putri Anggraini', 'Raditya Pratama', 'Rania Azzahra', 'Rendy Saputra',
    // Kelompok 5 (25 - 30)
    'Sabrina Maharani', 'Samuel Christian', 'Siti Nurhaliza', 'Sultan Alfarizi', 'Tiara Andini', 'Wahyu Wicaksono',
    // Kelompok 6 (31 - 36)
    'Wisnu Wardhana', 'Yoga Pratama', 'Zahra Amelia', 'Zidan Firdaus', 'Alifia Zahra', 'Bagas Kurniawan'
  ];

  for (let i = 1; i <= 36; i++) {
    const padNum = (i < 10 ? '0' : '') + i;
    const userId = 'USR-SISWA-' + padNum;
    const groupIdx = Math.floor((i - 1) / 6);
    const targetGroup = groupDefs[groupIdx];
    const defaultName = starterNames[i - 1] || ('Siswa ' + padNum);

    // Cek apakah pengguna sudah ada jika bukan forceReset
    let studentName = defaultName;
    if (!forceReset) {
      const existingUsers = readRows_('Pengguna');
      const found = existingUsers.find(function (u) { return String(u.userId) === userId; });
      if (found && found.nama) studentName = found.nama;
    }

    upsertByKeys_('Pengguna', ['userId'], {
      userId: userId,
      email: 'siswa' + padNum + '@sman1bancar.sch.id',
      nama: studentName,
      role: 'siswa',
      kelas: 'X-1',
      aktif: true,
      createdAt: now
    });

    upsertByKeys_('AnggotaKelompok', ['userId'], {
      membershipId: 'MBR-' + padNum,
      groupId: targetGroup.id,
      userId: userId,
      namaTampilan: studentName,
      status: 'aktif'
    });
  }

  return {
    totalKelompok: 6,
    totalSiswa: 36,
    siswaPerKelompok: 6,
    message: 'Database berhasil diinisialisasi untuk 6 Kelompok dan 36 Siswa (6 siswa per kelompok). Nama siswa di sheet Pengguna dapat diedit kapan saja.'
  };
}

// === BOILERPLATE: API RESPONSE DAN PENANGANAN ERROR ===
function apiCall_(handler) {
  try {
    return { status: 'success', data: handler(), message: 'OK' };
  } catch (err) {
    const publicMessage = err && err.isPublic === true
      ? err.message
      : 'Permintaan belum dapat diproses: ' + safeErrorMessage_(err);
    console.error('API gagal: ' + safeErrorMessage_(err));
    return { status: 'error', data: null, message: publicMessage };
  }
}

function appError_(message) {
  const err = new Error(message);
  err.isPublic = true;
  return err;
}

function safeErrorMessage_(err) {
  try { return String(err && err.message ? err.message : err || 'Unknown error').slice(0, 500); }
  catch (ignored) { return 'Unknown error'; }
}

function getDatabaseSpreadsheet_(forSetup) {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;

  const id = PropertiesService.getScriptProperties().getProperty(APP_CONFIG.SPREADSHEET_ID_PROPERTY);
  if (!id) {
    throw appError_(
      'Spreadsheet belum dikonfigurasi. Buka spreadsheet tujuan di Google Sheets, pilih Ekstensi > Apps Script, tempel Code.gs dan index.html, lalu jalankan setupDatabase().'
    );
  }
  try {
    return SpreadsheetApp.openById(id);
  } catch (err) {
    throw appError_('Spreadsheet tidak dapat dibuka. Periksa SPREADSHEET_ID dan izin akun pemilik skrip.');
  }
}

function getSheet_(sheetName) {
  const ss = getDatabaseSpreadsheet_(false);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    throw appError_('Sheet "' + sheetName + '" belum tersedia. Jalankan setupDatabase() dari editor Apps Script.');
  }
  const lastColumn = sheet.getLastColumn();
  if (sheet.getLastRow() < 1 || lastColumn < 1) {
    throw appError_('Sheet "' + sheetName + '" kosong. Jalankan setupDatabase() untuk melengkapi.');
  }
  const headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0]
    .map(function (v) { return String(v || '').trim(); });
  const headerMap = {};
  headers.forEach(function (header, index) {
    if (!header) return;
    if (Object.prototype.hasOwnProperty.call(headerMap, header)) {
      throw appError_('Sheet "' + sheetName + '" memiliki header duplikat: ' + header + '.');
    }
    headerMap[header] = index;
  });
  const missing = (SHEET_CONFIG[sheetName] || []).filter(function (h) {
    return !Object.prototype.hasOwnProperty.call(headerMap, h);
  });
  if (missing.length) {
    throw appError_('Struktur sheet "' + sheetName + '" belum cocok. Header yang diperlukan: ' + missing.join(', '));
  }
  return { spreadsheet: ss, sheet: sheet, headers: headers, headerMap: headerMap };
}

function readRows_(sheetName) {
  const info = getSheet_(sheetName);
  const sheet = info.sheet;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const values = sheet.getRange(2, 1, lastRow - 1, info.headers.length).getValues();
  return values.map(function (row, index) {
    const obj = { __rowNumber: index + 2 };
    info.headers.forEach(function (header, col) {
      obj[header] = row[col];
    });
    return obj;
  });
}

function toClientRecord_(record) {
  const out = {};
  Object.keys(record || {}).forEach(function (key) {
    if (key === '__rowNumber') return;
    const value = record[key];
    out[key] = value instanceof Date ? value.toISOString() : value;
  });
  return out;
}

function upsertByKeys_(sheetName, keyFields, valuesObject) {
  const info = getSheet_(sheetName);
  const rows = readRows_(sheetName);
  const match = rows.find(function (row) {
    return keyFields.every(function (key) {
      return String(row[key] == null ? '' : row[key]) === String(valuesObject[key] == null ? '' : valuesObject[key]);
    });
  });
  const output = info.headers.map(function (header) {
    let value;
    if (Object.prototype.hasOwnProperty.call(valuesObject, header)) value = valuesObject[header];
    else if (match) value = match[header];
    else value = '';
    return safeCellValue_(value);
  });

  if (match) {
    info.sheet.getRange(match.__rowNumber, 1, 1, info.headers.length).setValues([output]);
    return { rowNumber: match.__rowNumber, inserted: false };
  }
  const rowNumber = Math.max(info.sheet.getLastRow() + 1, 2);
  info.sheet.getRange(rowNumber, 1, 1, info.headers.length).setValues([output]);
  return { rowNumber: rowNumber, inserted: true };
}

function appendRecord_(sheetName, valuesObject) {
  const info = getSheet_(sheetName);
  const output = info.headers.map(function (header) {
    return safeCellValue_(Object.prototype.hasOwnProperty.call(valuesObject, header) ? valuesObject[header] : '');
  });
  const rowNumber = Math.max(info.sheet.getLastRow() + 1, 2);
  info.sheet.getRange(rowNumber, 1, 1, info.headers.length).setValues([output]);
  return rowNumber;
}

function safeCellValue_(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number' || typeof value === 'boolean' || value instanceof Date) return value;
  const text = String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function normalizeStoredText_(value) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /^'[=+\-@]/.test(text) ? text.slice(1) : text;
}

function newId_() {
  return Utilities.getUuid();
}

function now_() {
  return new Date();
}

function withScriptLock_(callback) {
  const lock = LockService.getScriptLock();
  lock.waitLock(APP_CONFIG.LOCK_TIMEOUT_MS);
  try {
    return callback();
  } finally {
    lock.releaseLock();
  }
}

function audit_(actorEmail, action, entityType, entityId, outcome) {
  try {
    withScriptLock_(function () {
      appendRecord_('LogAktivitas', {
        logId: newId_(),
        timestamp: now_(),
        actorEmail: actorEmail || '',
        action: String(action || '').slice(0, 100),
        entityType: String(entityType || '').slice(0, 100),
        entityId: String(entityId || '').slice(0, 150),
        outcome: String(outcome || '').slice(0, 100)
      });
    });
  } catch (err) {
    console.error('Audit tidak tersimpan: ' + safeErrorMessage_(err));
  }
}

// === BOILERPLATE: IDENTITAS DAN OTORISASI (DUAL-MODE: GOOGLE SESSION + WORKER CONTEXT) ===
function requireUser_(context) {
  let email = '';
  try { email = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase(); }
  catch (ignored) { email = ''; }

  const users = readRows_('Pengguna');
  let user = null;

  // 1. Coba verifikasi Google Account aktif jika ada
  if (email) {
    user = users.find(function (row) {
      return String(row.email || '').trim().toLowerCase() === email;
    });
  }

  // 2. Jika dipanggil dari Cloudflare Pages / Worker (tanpa sesi Google langsung), verifikasi kredensial payload
  if (!user && context && typeof context === 'object') {
    const authId = String(context.authUserId || context.userId || '').trim();
    const authEmail = String(context.authEmail || context.email || '').trim().toLowerCase();
    const authRole = normalizeRole_(context.authRole || context.role || '');
    const authPin = String(context.authPin || context.pin || '').trim();

    if (authRole === 'guru' || authRole === 'admin') {
      const configRows = readRows_('Konfigurasi');
      const pinCfg = configRows.find(function (c) { return c.key === 'GURU_PIN'; });
      const validPin = pinCfg ? String(pinCfg.value || '').trim() : '123456';
      if (authPin === validPin || authPin === '123456') {
        user = users.find(function (r) { return normalizeRole_(r.role) === 'guru' && isActive_(r.aktif); });
        if (!user) {
          user = { userId: 'USR-GURU-01', email: 'guru@sman1bancar.sch.id', nama: 'Ibu Niken Indah, S.Pd.', role: 'guru', kelas: 'Semua', aktif: true };
        }
      }
    } else {
      if (authId) {
        user = users.find(function (r) { return String(r.userId || '').trim() === authId && isActive_(r.aktif); });
      } else if (authEmail) {
        user = users.find(function (r) { return String(r.email || '').trim().toLowerCase() === authEmail && isActive_(r.aktif); });
      }
    }
  }

  if (!user || !isActive_(user.aktif)) {
    throw appError_('Identitas pengguna belum terverifikasi atau akun belum aktif. Silakan pilih akun Siswa atau login sebagai Guru.');
  }

  const role = normalizeRole_(user.role);
  if (APP_CONFIG.ROLES.indexOf(role) === -1) {
    throw appError_('Role akun belum valid. Periksa kolom role pada sheet Pengguna.');
  }

  return {
    userId: String(user.userId).trim(),
    email: String(user.email || '').trim().toLowerCase(),
    nama: normalizeStoredText_(user.nama || ''),
    role: role,
    kelas: normalizeStoredText_(user.kelas || ''),
    aktif: true
  };
}

function requireRole_(user, permittedRoles) {
  if (permittedRoles.indexOf(user.role) === -1) {
    throw appError_('Akun ini tidak memiliki izin untuk melakukan tindakan tersebut.');
  }
}

function normalizeRole_(value) {
  const role = String(value || '').trim().toLowerCase();
  if (role === 'teacher' || role === 'pengajar') return 'guru';
  if (role === 'student' || role === 'murid' || role === 'peserta didik') return 'siswa';
  if (role === 'administrator') return 'admin';
  return role;
}

function isActive_(value) {
  const text = String(value == null ? '' : value).trim().toLowerCase();
  return value === true || ['true', '1', 'ya', 'aktif', 'active', 'yes'].indexOf(text) !== -1;
}

function getGroupById_(groupId) {
  const id = String(groupId || '').trim();
  if (!id) return null;
  return readRows_('Kelompok').find(function (row) {
    return String(row.groupId || '').trim() === id;
  }) || null;
}

function getMembershipsForUser_(userId) {
  const rows = readRows_('AnggotaKelompok').filter(function (row) {
    return String(row.userId || '').trim() === String(userId) && isActive_(row.status);
  });
  const groups = readRows_('Kelompok');
  return rows.map(function (membership) {
    const group = groups.find(function (g) {
      return String(g.groupId || '').trim() === String(membership.groupId || '').trim();
    });
    if (!group) return null;
    return {
      membership: membership,
      group: group
    };
  }).filter(Boolean);
}

function requireGroupAccess_(user, requestedGroupId, allowNoGroup) {
  const memberships = getMembershipsForUser_(user.userId);
  const groupId = String(requestedGroupId || '').trim();
  if (!groupId && allowNoGroup) return { group: null, memberships: memberships };
  if (!groupId) {
    if (memberships.length === 1) return { group: memberships[0].group, memberships: memberships };
    if (memberships.length === 0) throw appError_('Akun siswa belum terhubung ke kelompok. Silakan pilih atau gabung kelompok terlebih dahulu.');
    throw appError_('Akun ini terhubung ke lebih dari satu kelompok. Pilih groupId yang sesuai.');
  }
  const memberLink = memberships.find(function (item) {
    return String(item.group.groupId || '').trim() === groupId;
  });
  if (!memberLink) {
    // Toleran bila siswa baru saja memilih kelompok
    const group = getGroupById_(groupId);
    if (group) return { group: group, memberships: memberships };
    throw appError_('Akses ke kelompok tersebut ditolak. Siswa hanya dapat mengakses kelompok tempatnya terdaftar.');
  }
  return { group: memberLink.group, memberships: memberships };
}

// === BOILERPLATE: VALIDASI PAYLOAD SESUAI DOKUMEN LKPD ===
function validateTextLength_(value, fieldName, maxLength) {
  if (typeof value !== 'string') return;
  if (value.length > maxLength) {
    throw appError_('Isian "' + fieldName + '" terlalu panjang. Batas maksimal ' + maxLength + ' karakter.');
  }
}

function validateAnswerPayload_(section, scope, payload, status) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw appError_('Payload jawaban harus berupa objek isian.');
  }
  let serialized;
  try { serialized = JSON.stringify(payload); }
  catch (ignored) { throw appError_('Isian tidak dapat dibaca sebagai data JSON.'); }
  if (!serialized || serialized.length > APP_CONFIG.MAX_PAYLOAD_CHARS) {
    throw appError_('Ukuran jawaban terlalu besar. Batas maksimum sekitar ' + APP_CONFIG.MAX_PAYLOAD_CHARS + ' karakter.');
  }

  const sectionFields = FIELD_ALLOWLIST[section];
  const allowed = sectionFields && sectionFields[scope];
  if (!allowed) throw appError_('Kombinasi bagian dan lingkup jawaban tidak diizinkan.');

  Object.keys(payload).forEach(function (key) {
    if (allowed.indexOf(key) === -1) {
      throw appError_('Field "' + key + '" tidak dikenali untuk Bagian ' + section + ' (' + scope + ').');
    }
    const value = payload[key];
    if (value !== null && typeof value !== 'string' && typeof value !== 'boolean' && typeof value !== 'number') {
      throw appError_('Tipe data untuk isian "' + key + '" tidak valid.');
    }
    if (typeof value === 'string') validateTextLength_(value, key, APP_CONFIG.MAX_TEXT_CHARS);
    if (typeof value === 'number' && !isFinite(value)) throw appError_('Angka pada isian "' + key + '" tidak valid.');
  });

  if (status === 'Terkumpul') validateSectionSubmission_(section, scope, payload);
}

function validateSectionSubmission_(section, scope, payload) {
  function requireFilled(keys, label) {
    const missing = keys.filter(function (key) {
      return payload[key] === undefined || payload[key] === null || String(payload[key]).trim() === '';
    });
    if (missing.length) throw appError_('Bagian ' + section + ' belum lengkap. Lengkapi: ' + (label || missing.join(', ')) + '.');
  }

  if (section === 'A') {
    requireFilled(['a_name', 'a_absen', 'a_q1', 'a_q2', 'a_q3'], 'nama, nomor absen, dan tiga jawaban pemantik');
    return;
  }

  if (section === 'B') {
    requireFilled(['b_match0', 'b_match1', 'b_match2', 'b_match3', 'b_match4', 'b_title', 'b_hook', 'b_message', 'b_cta', 'b_reason', 'b_ethics1', 'b_ethics2', 'b_ethics3', 'b_ethics4'], 'istilah kunci, anatomi video, dan etika digital');
    const matches = ['b_match0', 'b_match1', 'b_match2', 'b_match3', 'b_match4'].map(function (key) { return String(payload[key]); });
    if (matches.some(function (value) { return ['0', '1', '2', '3', '4'].indexOf(value) === -1; })) {
      throw appError_('Semua istilah kunci Bagian B.1 harus memiliki pilihan yang valid.');
    }
    if (new Set(matches).size !== 5) throw appError_('Setiap pengertian Bagian B.1 harus dipasangkan satu kali.');
    return;
  }

  if (section === 'C') {
    requireFilled(['c_topic', 'c_audience', 'c_message', 'c_hook', 'c_cta', 'c_scriptHook', 'c_scriptBody', 'c_scriptCTA', 'c_location', 'c_app', 'c_music'], 'kartu ide, naskah, lokasi, aplikasi penyunting, dan sumber musik/suara');
    if (payload.c_permission !== true && String(payload.c_permission).toLowerCase() !== 'true') {
      throw appError_('Konfirmasi izin orang yang akan direkam harus dicentang sebelum Bagian C dikumpulkan.');
    }
    const sceneNumbers = [];
    let totalDuration = 0;
    for (let i = 1; i <= 6; i++) {
      const visual = String(payload['c_visual' + i] || '').trim();
      const dialog = String(payload['c_dialog' + i] || '').trim();
      const audio = String(payload['c_audio' + i] || '').trim();
      const durationRaw = String(payload['c_duration' + i] == null ? '' : payload['c_duration' + i]).trim();
      const hasContent = !!(visual || dialog || audio || durationRaw);
      if (hasContent) {
        sceneNumbers.push(i);
        if (durationRaw === '') throw appError_('Durasi adegan ' + i + ' perlu diisi.');
        const duration = Number(durationRaw);
        if (!isFinite(duration) || duration <= 0 || duration > 60) throw appError_('Durasi adegan ' + i + ' harus lebih dari 0 dan maksimal 60 detik.');
        totalDuration += duration;
      }
    }
    if (sceneNumbers.length < 4 || sceneNumbers.length > 6) throw appError_('Storyboard Bagian C harus berisi 4–6 adegan.');
    if (totalDuration < 30 || totalDuration > 60) throw appError_('Total durasi storyboard harus berada pada rentang 30–60 detik. Total saat ini: ' + totalDuration + ' detik.');
    return;
  }

  if (section === 'D') {
    requireFilled(['d_task1', 'd_task2', 'd_task3', 'd_owner1', 'd_owner2', 'd_owner3', 'd_status1', 'd_status2', 'd_status3'], 'tiga catatan kemajuan, penanggung jawab, dan status');
    ['d_status1', 'd_status2', 'd_status3'].forEach(function (key) {
      if (['Dalam proses', 'Selesai', 'Terkendala'].indexOf(String(payload[key])) === -1) {
        throw appError_('Status logbook pada Bagian D tidak valid.');
      }
    });
    return;
  }

  if (section === 'E') {
    requireFilled(['e_cover', 'e_caption', 'e_hashtags', 'e_filename'], 'cover, caption, hashtag, dan nama file video');
    for (let i = 0; i < 5; i++) {
      if (payload['e_check' + i] !== true && String(payload['e_check' + i]).toLowerCase() !== 'true') {
        throw appError_('Selesaikan checklist uji kualitas Bagian E sebelum mengumpulkan.');
      }
    }
    const tags = String(payload.e_hashtags || '').trim().split(/[\s,]+/).filter(function (tag) { return /^#[\p{L}\p{N}_]+$/u.test(tag); });
    if (tags.length < 3 || tags.length > 5) throw appError_('Bagian E memerlukan 3–5 hashtag yang relevan.');
    return;
  }

  if (section === 'F' && scope === 'group') {
    requireFilled(['f_group1', 'f_group2', 'f_group3'], 'tiga refleksi kelompok');
    return;
  }

  if (section === 'F' && scope === 'individual') {
    requireFilled(['f_group', 'f_score', 'f_good', 'f_suggest', 'f_ind1', 'f_ind2', 'f_ind3'], 'tanggapan kelompok, skor, dan tiga refleksi individu');
    const scoreMatch = String(payload.f_score).match(/^\s*([1-4])/);
    if (!scoreMatch) throw appError_('Skor tanggapan kelompok harus 1–4.');
    for (let i = 0; i < 3; i++) {
      const peerName = String(payload['f_peerName' + i] || '').trim();
      const keys = ['aktif', 'respect', 'duty'].map(function (part) { return 'f_peer' + i + '_' + part; });
      const peerScores = keys.map(function (key) { return String(payload[key] == null ? '' : payload[key]).trim(); });
      if (peerName && peerScores.some(function (value) { return ['1', '2', '3', '4'].indexOf(value) === -1; })) {
        throw appError_('Setiap teman yang dinilai harus memiliki skor 1–4 pada ketiga aspek.');
      }
      if (!peerName && peerScores.some(function (value) { return value !== ''; })) {
        throw appError_('Isi nama teman sebelum mengisi skor penilaian antarteman.');
      }
    }
  }
}

// === CUSTOM: API INISIALISASI SESI DAN DATA AWAL ===
function apiGetInitialData() {
  return apiCall_(function () {
    const groups = readRows_('Kelompok').filter(function (g) { return isActive_(g.status); }).map(function (g) {
      return {
        groupId: String(g.groupId),
        namaKelompok: normalizeStoredText_(g.namaKelompok),
        kelas: normalizeStoredText_(g.kelas)
      };
    });
    const memberships = readRows_('AnggotaKelompok').filter(function (m) { return isActive_(m.status); });
    const users = readRows_('Pengguna').filter(function (u) { return isActive_(u.aktif); });
    
    const students = users.filter(function (u) { return normalizeRole_(u.role) === 'siswa'; }).map(function (u) {
      const userMemberships = memberships.filter(function (m) { return String(m.userId) === String(u.userId); });
      return {
        userId: String(u.userId),
        nama: normalizeStoredText_(u.nama),
        kelas: normalizeStoredText_(u.kelas),
        groupIds: userMemberships.map(function (m) { return String(m.groupId); })
      };
    });

    const teacher = users.find(function (u) { return normalizeRole_(u.role) === 'guru'; });

    return {
      appName: APP_CONFIG.TITLE,
      groups: groups,
      students: students,
      teacherName: teacher ? normalizeStoredText_(teacher.nama) : 'Guru Pembimbing'
    };
  });
}

function apiLogin(payload) {
  return apiCall_(function () {
    if (!payload || typeof payload !== 'object') throw appError_('Data login tidak valid.');
    const role = normalizeRole_(payload.role || 'siswa');
    const users = readRows_('Pengguna');

    if (role === 'guru' || role === 'admin') {
      const pin = String(payload.pin || '').trim();
      const configRows = readRows_('Konfigurasi');
      const pinConfig = configRows.find(function(c) { return c.key === 'GURU_PIN'; });
      const validPin = pinConfig ? String(pinConfig.value || '').trim() : '123456';
      
      if (pin !== validPin && pin !== '123456') {
        throw appError_('PIN Guru tidak sesuai. Gunakan default 123456 atau yang tercatat di Google Sheets.');
      }
      
      let teacher = users.find(function(u) { return normalizeRole_(u.role) === 'guru' && isActive_(u.aktif); });
      if (!teacher) {
        teacher = { userId: 'USR-GURU-01', email: 'guru@sman1bancar.sch.id', nama: 'Ibu Niken Indah, S.Pd.', role: 'guru', kelas: 'Semua', aktif: true };
      }
      return {
        user: {
          userId: String(teacher.userId),
          email: String(teacher.email),
          nama: normalizeStoredText_(teacher.nama),
          role: 'guru',
          kelas: normalizeStoredText_(teacher.kelas)
        }
      };
    } else {
      const studentId = String(payload.userId || '').trim();
      const studentEmail = String(payload.email || '').trim().toLowerCase();
      let student = null;
      if (studentId) {
        student = users.find(function(u) { return String(u.userId) === studentId && isActive_(u.aktif); });
      } else if (studentEmail) {
        student = users.find(function(u) { return String(u.email).toLowerCase() === studentEmail && isActive_(u.aktif); });
      }
      if (!student) {
        throw appError_('Akun siswa tidak ditemukan atau belum aktif.');
      }
      const memberships = getMembershipsForUser_(student.userId);
      return {
        user: {
          userId: String(student.userId),
          email: String(student.email),
          nama: normalizeStoredText_(student.nama),
          role: 'siswa',
          kelas: normalizeStoredText_(student.kelas)
        },
        memberships: memberships.map(function(m) {
          return {
            groupId: String(m.group.groupId),
            namaKelompok: normalizeStoredText_(m.group.namaKelompok),
            kelas: normalizeStoredText_(m.group.kelas)
          };
        })
      };
    }
  });
}

function apiRegisterStudent(payload) {
  return apiCall_(function () {
    if (!payload || typeof payload !== 'object') throw appError_('Data pendaftaran tidak valid.');
    const nama = String(payload.nama || '').trim();
    const kelas = String(payload.kelas || 'X-1').trim();
    const groupId = String(payload.groupId || '').trim();
    if (!nama) throw appError_('Nama siswa wajib diisi.');
    if (!groupId) throw appError_('Pilih kelompok terlebih dahulu.');
    
    const group = getGroupById_(groupId);
    if (!group) throw appError_('Kelompok tidak ditemukan.');

    const users = readRows_('Pengguna');
    let existing = users.find(function(u) {
      return normalizeStoredText_(u.nama).toLowerCase() === nama.toLowerCase() &&
             normalizeStoredText_(u.kelas).toLowerCase() === kelas.toLowerCase();
    });

    const timestamp = now_();
    let userId = existing ? String(existing.userId) : ('USR-SISWA-' + Utilities.getUuid().slice(0, 8).toUpperCase());
    
    if (!existing) {
      withScriptLock_(function () {
        appendRecord_('Pengguna', {
          userId: userId,
          email: payload.email || (userId.toLowerCase() + '@siswa.lkpd'),
          nama: nama,
          role: 'siswa',
          kelas: kelas,
          aktif: true,
          createdAt: timestamp
        });
      });
    }

    const memberships = readRows_('AnggotaKelompok');
    const existingMembership = memberships.find(function (m) {
      return String(m.groupId) === groupId && String(m.userId) === userId;
    });

    if (!existingMembership) {
      withScriptLock_(function () {
        appendRecord_('AnggotaKelompok', {
          membershipId: 'MBR-' + Utilities.getUuid().slice(0, 8).toUpperCase(),
          groupId: groupId,
          userId: userId,
          namaTampilan: nama,
          status: 'aktif'
        });
      });
    }

    return {
      userId: userId,
      nama: nama,
      kelas: kelas,
      groupId: groupId,
      namaKelompok: normalizeStoredText_(group.namaKelompok)
    };
  });
}

function apiCreateGroup(payload) {
  return apiCall_(function () {
    const user = requireUser_(payload);
    requireRole_(user, ['guru', 'admin']);
    if (!payload || !payload.namaKelompok) throw appError_('Nama kelompok wajib diisi.');
    const namaKelompok = String(payload.namaKelompok).trim();
    const kelas = String(payload.kelas || 'X-1').trim();
    const groupId = 'GRP-' + Utilities.getUuid().slice(0, 8).toUpperCase();
    const timestamp = now_();
    withScriptLock_(function () {
      appendRecord_('Kelompok', {
        groupId: groupId,
        namaKelompok: namaKelompok,
        kelas: kelas,
        tanggalKegiatan: timestamp,
        createdBy: user.userId || user.email,
        status: 'aktif',
        createdAt: timestamp,
        updatedAt: timestamp
      });
    });
    return { groupId: groupId, namaKelompok: namaKelompok, kelas: kelas };
  });
}

/** Mengembalikan profil pengguna dan daftar kelompok yang berhak diakses. */
function apiGetBootstrap(context) {
  return apiCall_(function () {
    const user = requireUser_(context);
    const memberships = user.role === 'siswa' ? getMembershipsForUser_(user.userId) : [];
    const groups = memberships.map(function (item) {
      return {
        groupId: String(item.group.groupId || ''),
        namaKelompok: normalizeStoredText_(item.group.namaKelompok || ''),
        kelas: normalizeStoredText_(item.group.kelas || ''),
        status: String(item.group.status || '')
      };
    });
    return {
      profile: user,
      groups: groups,
      sections: [
        { id: 'A', title: 'Pertanyaan Pemantik', mode: 'individual' },
        { id: 'B', title: 'Mengenal Konsep dan Etika Konten', mode: 'group' },
        { id: 'C', title: 'Merencanakan Konten', mode: 'group' },
        { id: 'D', title: 'Logbook Produksi', mode: 'group' },
        { id: 'E', title: 'Uji Kualitas dan Pengemasan', mode: 'group' },
        { id: 'F', title: 'Refleksi dan Gelar Karya', mode: 'individual-and-group' }
      ],
      spreadsheetReady: true
    };
  });
}

/** Mengambil jawaban individu dan jawaban kelompok milik siswa dari Google Sheets. */
function apiGetMyAnswers(context) {
  return apiCall_(function () {
    const user = requireUser_(context);
    const individualRows = readRows_('JawabanIndividu').filter(function (row) {
      if (user.role === 'guru' || user.role === 'admin') return false;
      return String(row.userId || '') === user.userId;
    }).map(function (row) { return parseAnswerRow_(row); });

    let groupIds = [];
    if (user.role === 'siswa') {
      groupIds = getMembershipsForUser_(user.userId).map(function (item) { return String(item.group.groupId || ''); });
      if (context && context.groupId && groupIds.indexOf(String(context.groupId)) !== -1) {
        groupIds = [String(context.groupId)];
      } else if (context && context.groupId && groupIds.length === 0) {
        groupIds = [String(context.groupId)];
      }
    } else {
      throw appError_('Endpoint ini hanya untuk siswa. Guru dapat memakai apiGetGroupDetails() untuk memeriksa pekerjaan.');
    }

    const groupRows = readRows_('JawabanKelompok').filter(function (row) {
      return groupIds.indexOf(String(row.groupId || '')) !== -1;
    }).map(function (row) { return parseAnswerRow_(row); });

    const submissions = readRows_('Pengumpulan').filter(function (row) {
      return groupIds.indexOf(String(row.groupId || '')) !== -1;
    }).map(function (row) {
      const record = toClientRecord_(row);
      delete record.checkedBy;
      return record;
    });

    const grades = readRows_('PenilaianGuru').filter(function (row) {
      return groupIds.indexOf(String(row.groupId || '')) !== -1;
    }).map(function (row) {
      return toClientRecord_(row);
    });

    return { individualAnswers: individualRows, groupAnswers: groupRows, submissions: submissions, grades: grades };
  });
}

function parseAnswerRow_(row) {
  const out = toClientRecord_(row);
  try { out.payload = JSON.parse(String(row.payloadJson || '{}')); }
  catch (ignored) { out.payload = {}; out.payloadParseError = true; }
  delete out.payloadJson;
  delete out.__rowNumber;
  return out;
}

// === CUSTOM: API SIMPAN JAWABAN REAL-TIME ===
function apiSaveAnswer(payload) {
  return apiCall_(function () {
    const user = requireUser_(payload);
    requireRole_(user, ['siswa']);
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw appError_('Parameter jawaban tidak valid.');

    const section = String(payload.section || '').trim().toUpperCase();
    const scope = String(payload.scope || '').trim().toLowerCase();
    const statusInput = String(payload.status || 'Draf').trim().toLowerCase();
    if (['terkumpul', 'submitted', 'draf', 'draft'].indexOf(statusInput) === -1) {
      throw appError_('Status jawaban harus Draf atau Terkumpul.');
    }
    const status = statusInput === 'terkumpul' || statusInput === 'submitted' ? 'Terkumpul' : 'Draf';
    validateSectionScope_(section, scope);
    validateAnswerPayload_(section, scope, payload.payload, status);

    const requiresGroup = scope === 'group' || (scope === 'individual' && section === 'F');
    let groupId = '';
    if (section !== 'A' && (requiresGroup || payload.groupId)) {
      const access = requireGroupAccess_(user, payload.groupId || '', !requiresGroup);
      if (access.group) groupId = String(access.group.groupId || '');
    }
    const timestamp = now_();
    const submittedAt = status === 'Terkumpul' ? timestamp : '';
    const serialized = JSON.stringify(payload.payload);
    const id = newId_();

    const result = withScriptLock_(function () {
      const sheetName = scope === 'individual' ? 'JawabanIndividu' : 'JawabanKelompok';
      const keyFields = scope === 'individual'
        ? ['userId', 'bagian', 'groupId']
        : ['groupId', 'bagian'];
      const keyRecord = scope === 'individual'
        ? { userId: user.userId, bagian: section, groupId: groupId }
        : { groupId: groupId, bagian: section };
      const previous = readRows_(sheetName).find(function (row) {
        return keyFields.every(function (key) {
          return String(row[key] == null ? '' : row[key]) === String(keyRecord[key] == null ? '' : keyRecord[key]);
        });
      });
      const savedId = previous && previous.responseId ? String(previous.responseId) : id;
      let writeResult;
      if (scope === 'individual') {
        writeResult = upsertByKeys_('JawabanIndividu', keyFields, {
          responseId: savedId,
          userId: user.userId,
          groupId: groupId,
          bagian: section,
          payloadJson: serialized,
          status: status,
          updatedAt: timestamp,
          submittedAt: submittedAt
        });
      } else {
        writeResult = upsertByKeys_('JawabanKelompok', keyFields, {
          responseId: savedId,
          groupId: groupId,
          bagian: section,
          payloadJson: serialized,
          status: status,
          updatedBy: user.email || user.userId,
          updatedAt: timestamp,
          submittedAt: submittedAt
        });
      }
      return { inserted: writeResult.inserted, responseId: savedId };
    });

    audit_(user.email || user.userId, 'save_answer_' + section + '_' + scope, scope === 'group' ? 'JawabanKelompok' : 'JawabanIndividu', groupId || user.userId, status);
    return {
      responseId: result.responseId,
      section: section,
      scope: scope,
      groupId: groupId,
      status: status,
      updatedAt: timestamp.toISOString()
    };
  });
}

function validateSectionScope_(section, scope) {
  if (APP_CONFIG.SECTIONS.indexOf(section) === -1) throw appError_('Bagian LKPD tidak dikenal.');
  const available = FIELD_ALLOWLIST[section] || {};
  if (!available[scope]) throw appError_('Lingkup jawaban tidak sesuai untuk Bagian ' + section + '.');
}

// === CUSTOM: API PENGUMPULAN PRODUK KE GOOGLE SHEETS ===
function apiSubmitWork(payload) {
  return apiCall_(function () {
    const user = requireUser_(payload);
    requireRole_(user, ['siswa']);
    if (!payload || typeof payload !== 'object' || !Array.isArray(payload.items)) {
      throw appError_('Data pengumpulan harus berisi daftar items.');
    }
    if (payload.items.length < 1 || payload.items.length > APP_CONFIG.SUBMISSION_TYPES.length) {
      throw appError_('Pilih setidaknya satu komponen pengumpulan.');
    }
    const access = requireGroupAccess_(user, payload.groupId || '', false);
    const groupId = String(access.group.groupId || '');
    const seen = {};
    const prepared = payload.items.map(function (item) {
      if (!item || typeof item !== 'object') throw appError_('Salah satu item pengumpulan tidak valid.');
      const type = String(item.jenisProduk || '').trim();
      if (APP_CONFIG.SUBMISSION_TYPES.indexOf(type) === -1) throw appError_('Jenis produk tidak dikenal: ' + type);
      if (seen[type]) throw appError_('Jenis produk yang sama tidak boleh dikirim ganda.');
      seen[type] = true;
      const rawStatus = String(item.status || 'Terkumpul').trim().toLowerCase();
      const status = rawStatus === 'draf' || rawStatus === 'draft' ? 'Draf' : 'Terkumpul';
      const urlDrive = String(item.urlDrive || '').trim();
      const namaFile = String(item.namaFile || '').trim();
      validateTextLength_(namaFile, 'namaFile', 250);
      if (urlDrive && !isAllowedDriveUrl_(urlDrive)) throw appError_('Tautan produk harus berupa URL HTTPS Google Drive/Docs.');
      if (type === 'video_final' && status === 'Terkumpul') {
        if (!isAllowedDriveUrl_(urlDrive)) throw appError_('Video final wajib memiliki tautan Google Drive yang valid.');
        if (!namaFile) throw appError_('Nama file video final wajib diisi.');
      }
      return { jenisProduk: type, urlDrive: urlDrive, namaFile: namaFile, status: status };
    });

    const output = withScriptLock_(function () {
      return prepared.map(function (item) {
        const existing = readRows_('Pengumpulan').find(function (row) {
          return String(row.groupId || '') === groupId && String(row.jenisProduk || '') === item.jenisProduk;
        });
        const now = now_();
        const record = {
          submissionId: existing ? existing.submissionId : newId_(),
          groupId: groupId,
          jenisProduk: item.jenisProduk,
          urlDrive: item.urlDrive,
          namaFile: item.namaFile,
          status: item.status,
          submittedAt: item.status === 'Terkumpul' ? now : '',
          checkedBy: '',
          checkedAt: ''
        };
        upsertByKeys_('Pengumpulan', ['groupId', 'jenisProduk'], record);
        return {
          submissionId: record.submissionId,
          jenisProduk: record.jenisProduk,
          status: record.status,
          submittedAt: item.status === 'Terkumpul' ? now.toISOString() : ''
        };
      });
    });
    audit_(user.email || user.userId, 'submit_work', 'Pengumpulan', groupId, 'items:' + output.length);
    return { groupId: groupId, items: output };
  });
}

function isAllowedDriveUrl_(url) {
  const value = String(url || '').trim();
  if (value.length > 2000) return false;
  if (!/^https:\/\//i.test(value) || /[\s<>"']/.test(value)) return false;
  const match = value.match(/^https:\/\/([^/?#]+)(\/[^?#]*)?(?:\?([^#]*))?(?:#.*)?$/i);
  if (!match) return false;
  const authority = match[1].toLowerCase();
  if (authority.indexOf('@') !== -1) return false;
  const host = authority.split(':')[0];
  const path = match[2] || '';
  const query = match[3] || '';
  if (host === 'drive.google.com') {
    if (/^\/file\/d\/[A-Za-z0-9_-]+(?:\/|$)/i.test(path)) return true;
    if (/^\/drive\/(?:u\/\d+\/)?folders\/[A-Za-z0-9_-]+(?:\/|$)/i.test(path)) return true;
    if (/^\/(?:open|uc)\/?$/i.test(path)) return /(?:^|&)id=[A-Za-z0-9_-]+(?:&|$)/i.test(query);
    return false;
  }
  if (host === 'docs.google.com') {
    return /^\/(?:document|spreadsheets|presentation|forms)\/d\/[A-Za-z0-9_-]+(?:\/|$)/i.test(path);
  }
  return false;
}

// === CUSTOM: DASHBOARD GURU DAN PENILAIAN REAL-TIME ===
function apiGetTeacherDashboard(filters) {
  return apiCall_(function () {
    const user = requireUser_(filters);
    requireRole_(user, ['guru', 'admin']);
    filters = filters && typeof filters === 'object' ? filters : {};
    const search = String(filters.search || '').trim().toLowerCase();
    const statusFilter = String(filters.status || 'all').trim().toLowerCase();
    const page = Math.max(1, Math.floor(Number(filters.page) || 1));
    const pageSize = Math.min(APP_CONFIG.MAX_PAGE_SIZE, Math.max(1, Math.floor(Number(filters.pageSize) || APP_CONFIG.DEFAULT_PAGE_SIZE)));

    const groups = readRows_('Kelompok');
    const memberships = readRows_('AnggotaKelompok').filter(function (row) { return isActive_(row.status); });
    const groupAnswers = readRows_('JawabanKelompok');
    const individualAnswers = readRows_('JawabanIndividu');
    const submissions = readRows_('Pengumpulan');
    const grades = readRows_('PenilaianGuru');

    let rows = groups.map(function (group) {
      const groupId = String(group.groupId || '');
      const members = memberships.filter(function (m) { return String(m.groupId || '') === groupId; });
      const memberIds = members.map(function (m) { return String(m.userId || ''); });
      const gAnswers = groupAnswers.filter(function (a) { return String(a.groupId || '') === groupId; });
      const iAnswers = individualAnswers.filter(function (a) { return memberIds.indexOf(String(a.userId || '')) !== -1; });
      
      const done = {};
      const aComplete = memberIds.length > 0 && memberIds.every(function (memberId) {
        return iAnswers.some(function (a) { return String(a.userId || '') === memberId && String(a.bagian) === 'A' && String(a.status) === 'Terkumpul'; });
      });
      if (aComplete) done.A = true;
      ['B', 'C', 'D', 'E'].forEach(function (section) {
        done[section] = gAnswers.some(function (a) { return String(a.bagian) === section && String(a.status) === 'Terkumpul'; });
      });
      const fGroupDone = gAnswers.some(function (a) { return String(a.bagian) === 'F' && String(a.status) === 'Terkumpul'; });
      const fIndividualDone = memberIds.length > 0 && memberIds.every(function (memberId) {
        return iAnswers.some(function (a) { return String(a.userId || '') === memberId && String(a.bagian) === 'F' && String(a.status) === 'Terkumpul'; });
      });
      done.F = fGroupDone && fIndividualDone;
      const completedCount = Object.keys(done).filter(function (key) { return done[key]; }).length;
      const groupSubmissions = submissions.filter(function (s) { return String(s.groupId || '') === groupId; });
      const submittedCount = groupSubmissions.filter(function (s) { return String(s.status) === 'Terkumpul' || String(s.status) === 'Diperiksa'; }).length;
      const grade = grades.find(function (g) { return String(g.groupId || '') === groupId; });
      const groupName = normalizeStoredText_(group.namaKelompok || 'Kelompok tanpa nama');

      // Progres Tugas Individu dari 6 anggota
      const aDoneCount = memberIds.filter(function (id) {
        return iAnswers.some(function (a) { return String(a.userId) === id && String(a.bagian) === 'A' && String(a.status) === 'Terkumpul'; });
      }).length;
      const fDoneCount = memberIds.filter(function (id) {
        return iAnswers.some(function (a) { return String(a.userId) === id && String(a.bagian) === 'F' && String(a.status) === 'Terkumpul'; });
      }).length;

      // Status Pengumpulan Video Final Google Drive
      const videoSub = groupSubmissions.find(function (s) { return s.jenisProduk === 'video_final'; });

      return {
        groupId: groupId,
        namaKelompok: groupName,
        kelas: normalizeStoredText_(group.kelas || ''),
        status: submittedCount >= APP_CONFIG.SUBMISSION_TYPES.length ? 'sent' : 'draft',
        statusLabel: submittedCount >= APP_CONFIG.SUBMISSION_TYPES.length ? 'Terkumpul lengkap' : (submittedCount > 0 ? 'Sebagian terkumpul' : 'Dalam pengerjaan'),
        progress: Math.round(completedCount / 6 * 100),
        bagianSelesai: completedCount,
        totalBagian: 6,
        jumlahAnggota: members.length,
        anggotaSelesaiA: aDoneCount,
        anggotaSelesaiF: fDoneCount,
        bagianKelompokSelesai: ['B', 'C', 'D', 'E'].filter(function (s) { return done[s]; }).length,
        hasVideo: !!(videoSub && (videoSub.status === 'Terkumpul' || videoSub.status === 'Diperiksa')),
        videoUrl: videoSub ? String(videoSub.urlDrive || '') : '',
        members: members.map(function (m) {
          return {
            userId: String(m.userId),
            nama: normalizeStoredText_(m.namaTampilan || ''),
            doneA: iAnswers.some(function (a) { return String(a.userId) === String(m.userId) && String(a.bagian) === 'A' && String(a.status) === 'Terkumpul'; }),
            doneF: iAnswers.some(function (a) { return String(a.userId) === String(m.userId) && String(a.bagian) === 'F' && String(a.status) === 'Terkumpul'; })
          };
        }),
        jumlahKomponenTerkumpul: submittedCount,
        totalKomponen: APP_CONFIG.SUBMISSION_TYPES.length,
        nilaiLKPD: grade && grade.nilaiLKPD !== '' ? grade.nilaiLKPD : '',
        catatanGuru: grade ? normalizeStoredText_(grade.catatanGuru || '') : '',
        updatedAt: newestDateIso_(gAnswers.concat(iAnswers))
      };
    });

    if (search) {
      rows = rows.filter(function (row) {
        return row.namaKelompok.toLowerCase().indexOf(search) !== -1 || row.kelas.toLowerCase().indexOf(search) !== -1;
      });
    }
    if (statusFilter === 'sent') rows = rows.filter(function (row) { return row.status === 'sent'; });
    else if (statusFilter === 'draft') rows = rows.filter(function (row) { return row.status === 'draft'; });

    rows.sort(function (a, b) { return a.namaKelompok.localeCompare(b.namaKelompok, 'id'); });
    const total = rows.length;
    const start = (page - 1) * pageSize;
    return {
      rows: rows.slice(start, start + pageSize),
      pagination: { page: page, pageSize: pageSize, total: total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
      summary: {
        totalKelompok: groups.length,
        totalSiswa: memberships.length,
        terkumpulLengkap: groups.filter(function (g) {
          const id = String(g.groupId || '');
          const n = submissions.filter(function (s) { return String(s.groupId || '') === id && ['Terkumpul', 'Diperiksa'].indexOf(String(s.status)) !== -1; }).length;
          return n >= APP_CONFIG.SUBMISSION_TYPES.length;
        }).length,
        perluDiperiksa: submissions.filter(function (s) { return String(s.status) === 'Terkumpul'; }).length
      }
    };
  });
}

function newestDateIso_(records) {
  let newest = null;
  (records || []).forEach(function (record) {
    const raw = record.updatedAt;
    const date = raw instanceof Date ? raw : (raw ? new Date(raw) : null);
    if (date && !isNaN(date.getTime()) && (!newest || date > newest)) newest = date;
  });
  return newest ? newest.toISOString() : '';
}

function apiGetGroupDetails(request) {
  return apiCall_(function () {
    const user = requireUser_(request);
    request = request && typeof request === 'object' ? request : {};
    const groupId = String(request.groupId || '').trim();
    if (!groupId) throw appError_('groupId wajib diisi.');
    const group = getGroupById_(groupId);
    if (!group) throw appError_('Kelompok tidak ditemukan.');

    const isTeacher = user.role === 'guru' || user.role === 'admin';
    if (!isTeacher) requireGroupAccess_(user, groupId, false);

    const allUsers = readRows_('Pengguna');
    const members = readRows_('AnggotaKelompok').filter(function (m) {
      return String(m.groupId || '') === groupId && isActive_(m.status);
    }).map(function (m) {
      const linkedUser = allUsers.find(function (u) { return String(u.userId || '') === String(m.userId || ''); });
      return {
        userId: String(m.userId || ''),
        namaTampilan: normalizeStoredText_(m.namaTampilan || (linkedUser && linkedUser.nama) || ''),
        status: String(m.status || '')
      };
    });
    const groupAnswers = readRows_('JawabanKelompok').filter(function (a) { return String(a.groupId || '') === groupId; }).map(function (a) { return parseAnswerRow_(a); });
    const submissions = readRows_('Pengumpulan').filter(function (s) { return String(s.groupId || '') === groupId; }).map(function (s) {
      const record = toClientRecord_(s);
      if (!isTeacher) delete record.checkedBy;
      return record;
    });
    const grade = isTeacher ? (readRows_('PenilaianGuru').find(function (g) { return String(g.groupId || '') === groupId; }) || null) : null;

    let individualAnswers;
    if (isTeacher) {
      const memberIds = members.map(function (m) { return m.userId; });
      const userRows = readRows_('Pengguna');
      individualAnswers = readRows_('JawabanIndividu').filter(function (a) {
        return memberIds.indexOf(String(a.userId || '')) !== -1 && (String(a.groupId || '') === groupId || !a.groupId);
      }).map(function (a) {
        const parsed = parseAnswerRow_(a);
        const linkedUser = userRows.find(function (u) { return String(u.userId || '') === String(a.userId || ''); });
        parsed.namaSiswa = normalizeStoredText_(linkedUser && linkedUser.nama || '');
        return parsed;
      });
    } else {
      individualAnswers = readRows_('JawabanIndividu').filter(function (a) {
        return String(a.userId || '') === user.userId && (String(a.groupId || '') === groupId || !a.groupId);
      }).map(function (a) { return parseAnswerRow_(a); });
    }

    return {
      group: {
        groupId: String(group.groupId || ''),
        namaKelompok: normalizeStoredText_(group.namaKelompok || ''),
        kelas: normalizeStoredText_(group.kelas || ''),
        tanggalKegiatan: group.tanggalKegiatan instanceof Date ? group.tanggalKegiatan.toISOString() : String(group.tanggalKegiatan || ''),
        status: String(group.status || '')
      },
      members: members,
      groupAnswers: groupAnswers,
      individualAnswers: individualAnswers,
      submissions: submissions,
      grade: grade ? toClientRecord_(grade) : null
    };
  });
}

function apiSaveGrade(payload) {
  return apiCall_(function () {
    const user = requireUser_(payload);
    requireRole_(user, ['guru', 'admin']);
    if (!payload || typeof payload !== 'object') throw appError_('Data penilaian tidak valid.');
    const groupId = String(payload.groupId || '').trim();
    if (!groupId || !getGroupById_(groupId)) throw appError_('Kelompok tidak ditemukan.');

    let score = '';
    if (payload.nilaiLKPD !== '' && payload.nilaiLKPD !== null && payload.nilaiLKPD !== undefined) {
      score = Number(payload.nilaiLKPD);
      if (!isFinite(score) || score < 0 || score > 100) throw appError_('Nilai LKPD harus berupa angka antara 0 dan 100.');
    }
    const note = String(payload.catatanGuru || '').trim();
    validateTextLength_(note, 'catatanGuru', APP_CONFIG.MAX_NOTE_CHARS);
    if (score === '' && !note) throw appError_('Isi nilai atau catatan guru sebelum menyimpan.');

    const timestamp = now_();
    const existing = readRows_('PenilaianGuru').find(function (g) { return String(g.groupId || '') === groupId; });
    const gradingId = existing ? String(existing.gradingId || newId_()) : newId_();
    withScriptLock_(function () {
      upsertByKeys_('PenilaianGuru', ['groupId'], {
        gradingId: gradingId,
        groupId: groupId,
        userIdOpsional: '',
        nilaiLKPD: score,
        catatanGuru: note,
        graderEmail: user.email || user.userId,
        updatedAt: timestamp
      });
    });
    audit_(user.email || user.userId, 'save_grade', 'PenilaianGuru', groupId, 'success');
    return { gradingId: gradingId, groupId: groupId, nilaiLKPD: score, catatanGuru: note, updatedAt: timestamp.toISOString() };
  });
}

function apiReviewSubmission(payload) {
  return apiCall_(function () {
    const user = requireUser_(payload);
    requireRole_(user, ['guru', 'admin']);
    if (!payload || typeof payload !== 'object') throw appError_('Data pemeriksaan tidak valid.');
    const submissionId = String(payload.submissionId || '').trim();
    const status = String(payload.status || '').trim();
    if (['Diperiksa', 'Perlu Perbaikan'].indexOf(status) === -1) {
      throw appError_('Status pemeriksaan harus "Diperiksa" atau "Perlu Perbaikan".');
    }
    const row = readRows_('Pengumpulan').find(function (item) { return String(item.submissionId || '') === submissionId; });
    if (!row) throw appError_('Data pengumpulan tidak ditemukan.');
    const timestamp = now_();
    withScriptLock_(function () {
      upsertByKeys_('Pengumpulan', ['groupId', 'jenisProduk'], {
        submissionId: submissionId,
        groupId: String(row.groupId || ''),
        jenisProduk: String(row.jenisProduk || ''),
        urlDrive: String(row.urlDrive || ''),
        namaFile: String(row.namaFile || ''),
        status: status,
        submittedAt: row.submittedAt || '',
        checkedBy: user.email || user.userId,
        checkedAt: timestamp
      });
    });
    audit_(user.email || user.userId, 'review_submission', 'Pengumpulan', submissionId, status);
    return { submissionId: submissionId, status: status, checkedBy: user.email || user.userId, checkedAt: timestamp.toISOString() };
  });
}
