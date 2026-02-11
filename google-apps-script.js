// ============================================
// GOOGLE APPS SCRIPT — Absence Tracker Backup
// ============================================
// SETUP INSTRUCTIONS:
// 1. Go to https://sheets.google.com and create a new blank spreadsheet
// 2. Name it "Absence Tracker Backup" (or anything you like)
// 3. Go to Extensions > Apps Script
// 4. Delete any code in the editor and paste this entire file
// 5. Click "Deploy" > "New deployment"
// 6. Click the gear icon next to "Select type" > choose "Web app"
// 7. Set "Execute as" = "Me"
// 8. Set "Who has access" = "Anyone"
// 9. Click "Deploy" and authorize when prompted
// 10. Copy the Web App URL
// 11. Paste it in the Absence Tracker app Settings > "Backup URL"
// ============================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // ── Sheet 1: Human-readable absence list ──
    let sheet = ss.getSheetByName('Absences');
    if (!sheet) {
      sheet = ss.insertSheet('Absences');
    }
    sheet.clear();

    // Header row
    sheet.appendRow(['Person', 'Role', 'Date', 'Day', 'Month']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');

    const people = data.people || [];
    const absences = data.absences || {};

    // Write each absence as a row
    const rows = [];
    Object.keys(absences).sort().forEach(key => {
      const parts = key.split('_');
      const personId = parts[0];
      const month = parts.slice(1).join('_');
      const person = people.find(p => p.id === personId);
      if (!person) return;

      (absences[key] || []).forEach(dateStr => {
        const d = new Date(dateStr + 'T00:00:00');
        const dayName = d.toLocaleDateString('en-IN', { weekday: 'long' });
        rows.push([person.name, person.role, dateStr, dayName, month]);
      });
    });

    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, 5).setValues(rows);
    }

    // ── Sheet 2: Raw JSON for app restore ──
    let rawSheet = ss.getSheetByName('AppData');
    if (!rawSheet) {
      rawSheet = ss.insertSheet('AppData');
    }
    rawSheet.clear();
    rawSheet.appendRow(['json_data', 'last_updated']);
    rawSheet.getRange(1, 1, 1, 2).setFontWeight('bold');
    rawSheet.appendRow([
      JSON.stringify({ people: data.people, absences: data.absences }),
      new Date().toISOString()
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, rows: rows.length }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const rawSheet = ss.getSheetByName('AppData');

    if (!rawSheet || rawSheet.getLastRow() < 2) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, message: 'No backup data found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const jsonData = rawSheet.getRange(2, 1).getValue();
    const lastUpdated = rawSheet.getRange(2, 2).getValue();

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        data: JSON.parse(jsonData),
        lastUpdated: lastUpdated
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
