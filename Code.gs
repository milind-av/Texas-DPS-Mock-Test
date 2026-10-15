/**
 * Texas DPS Mock Test: score collector for a Google Sheet.
 *
 * Setup (once):
 *   1. In your Google Sheet: Extensions > Apps Script. Delete what's there and paste this whole file.
 *   2. Change SECRET below to a word of your own. Put the same word in SCORES_KEY in index.html.
 *   3. Click Save, pick "setup" in the function list at the top, and click Run. Allow access when asked.
 *      A "Scores" tab with column headings appears in your sheet.
 *   4. Deploy > New deployment > gear icon > Web app.
 *      Execute as: Me.  Who has access: Anyone.  Click Deploy and copy the Web app URL (it ends in /exec).
 *   5. Paste that URL into SCORES_URL in index.html.
 *
 * If you change this code later: Deploy > Manage deployments > pencil icon > Version: New version > Deploy.
 * The URL stays the same.
 */

const SECRET = 'pmv-texas-dps';     // Same word as SCORES_KEY in index.html
const SHEET_NAME = 'Scores';

const TOPICS = [
  ['sig', 'Signs'], ['row', 'Right of way'], ['spd', 'Speed'], ['prk', 'Turning & parking'],
  ['alc', 'Alcohol'], ['lic', 'Licensing'], ['shr', 'Sharing the road'], ['saf', 'Safety']
];
const HEADERS = ['Finished', 'Name', 'Mode', 'Score', 'Out of', 'Percent', 'Result', 'Minutes', 'Ran out of time']
  .concat(TOPICS.map(function (t) { return t[1]; }))
  .concat(['Received', 'Result ID', 'Device']);

/** Receives one finished test from the page and adds it as a row. */
function doPost(e) {
  var data;
  try {
    data = JSON.parse(e && e.postData && e.postData.contents);
  } catch (err) {
    return reply_({ ok: false, error: 'Not JSON' });
  }
  if (!data || typeof data !== 'object') return reply_({ ok: false, error: 'Empty' });
  if (SECRET && data.key !== SECRET) return reply_({ ok: false, error: 'Wrong key' });

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getSheet_();
    var id = text_(data.id, 40);

    // The page may resend after a dropped connection; skip results already saved.
    if (id && sheet.getLastRow() > 1) {
      var idCol = HEADERS.indexOf('Result ID') + 1;
      var found = sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1)
        .createTextFinder(id).matchEntireCell(true).findNext();
      if (found) return reply_({ ok: true, duplicate: true });
    }

    var total = int_(data.total || 30, 1, 500);
    var score = Math.min(int_(data.score, 0, 500), total);
    var topics = data.topics && typeof data.topics === 'object' ? data.topics : {};
    var finished = new Date(data.finished);
    if (isNaN(finished.getTime())) finished = new Date();

    var row = [
      finished,
      text_(data.name, 40) || 'No name',
      data.mode === 'exam' ? 'Exam' : 'Practice',
      score,
      total,
      score / total,
      score >= Math.ceil(total * 0.7) ? 'Pass' : 'Not yet',
      Math.round(int_(data.timeSec, 0, 86400) / 6) / 10,
      data.timedOut ? 'Yes' : 'No'
    ].concat(TOPICS.map(function (t) {
      var v = topics[t[0]];
      return Array.isArray(v) ? int_(v[0], 0, 100) + ' of ' + int_(v[1], 0, 100) : '';
    })).concat([new Date(), id, text_(data.device, 40)]);

    sheet.appendRow(row);
    return reply_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

/** Open the web app URL in a browser to check that it's running. */
function doGet() {
  var sheet = getSheet_();
  return reply_({ ok: true, message: 'Score collector is running', results: Math.max(0, sheet.getLastRow() - 1) });
}

/** Run once from the editor: creates the Scores tab and asks for permission. */
function setup() {
  getSheet_();
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('mmm d, yyyy h:mm am/pm');
    sheet.getRange('F:F').setNumberFormat('0%');
    sheet.getRange(1, HEADERS.indexOf('Received') + 1, sheet.getMaxRows(), 1).setNumberFormat('mmm d, yyyy h:mm am/pm');
  }
  return sheet;
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Short plain text only. A leading = + - @ would make Sheets treat it as a formula, so it gets an apostrophe.
function text_(v, max) {
  var s = String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function int_(v, min, max) {
  var n = Math.round(Number(v));
  if (!isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}
