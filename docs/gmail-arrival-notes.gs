/**
 * Voulamandis House — booking emails -> Beds24 notes and the staff CRM.
 *
 * Google Apps Script for vhouse.reservations@gmail.com (script.google.com).
 * Every 10 minutes it finds new messages in threads whose subject carries a
 * booking number ("✅ 92640049 - Name") and sends them to
 * https://chioshotel.gr/api/gmail/arrival-notes. Guest messages reach the
 * Beds24 notes and the CRM. Our own replies reach only the CRM.
 *
 * Setup: see docs/gmail-arrival-notes.md
 */

var ENDPOINT = "https://chioshotel.gr/api/gmail/arrival-notes";
var OWN_ADDRESS = "vhouse.reservations@gmail.com";
// Gmail search cannot match the emoji reliably, so the subject is checked below.
var SEARCH_QUERY = "newer_than:3d -in:spam -in:trash";
var BOOKING_SUBJECT = /✅\s*\d{6,10}/;
var REPLY_SUBJECT = /^\s*(re|fw|fwd|απ|aw|sv|ynt)\s*:/i;
var MAX_THREADS = 200;
var PROCESSED_KEEP_DAYS = 14;

function processArrivalReplies() {
  var secret = PropertiesService.getScriptProperties().getProperty("ARRIVAL_NOTES_SECRET");
  if (!secret) throw new Error("Set the ARRIVAL_NOTES_SECRET script property first.");

  var store = PropertiesService.getScriptProperties();
  var processed = JSON.parse(store.getProperty("processed") || "{}");
  var threads = GmailApp.search(SEARCH_QUERY, 0, MAX_THREADS);

  threads.forEach(function (thread) {
    thread.getMessages().forEach(function (message) {
      var id = message.getId();
      if (processed[id]) return;
      var subject = message.getSubject();
      if (!BOOKING_SUBJECT.test(subject)) return;

      // Our own first message is the automated email itself: only replies count.
      var fromUs = message.getFrom().toLowerCase().indexOf(OWN_ADDRESS) !== -1;
      if (fromUs && !REPLY_SUBJECT.test(subject)) {
        processed[id] = Date.now();
        return;
      }

      // Booking ids are at the start of the subject: "✅ 87463166,87463197 - Name"
      var head = subject.split(" - ")[0];
      var bookingIds = head.match(/\d{6,10}/g) || [];
      if (!bookingIds.length) {
        processed[id] = Date.now();
        return;
      }

      var response = UrlFetchApp.fetch(ENDPOINT, {
        method: "post",
        contentType: "application/json",
        headers: { Authorization: "Bearer " + secret },
        payload: JSON.stringify({
          messageId: id,
          direction: fromUs ? "staff" : "guest",
          bookingIds: bookingIds,
          from: message.getFrom(),
          date: message.getDate().toISOString(),
          subject: subject,
          body: message.getPlainBody(),
        }),
        muteHttpExceptions: true,
      });

      var status = response.getResponseCode();
      if (status >= 200 && status < 300) {
        processed[id] = Date.now();
      } else {
        // Left unprocessed so the next run retries it.
        console.error("arrival-notes " + status + " for " + id + ": " + response.getContentText());
      }
    });
  });

  var cutoff = Date.now() - PROCESSED_KEEP_DAYS * 24 * 60 * 60 * 1000;
  Object.keys(processed).forEach(function (key) {
    if (processed[key] < cutoff) delete processed[key];
  });
  store.setProperty("processed", JSON.stringify(processed));
}

/** Run once to create the 10-minute trigger. */
function installTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === "processArrivalReplies") ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger("processArrivalReplies").timeBased().everyMinutes(10).create();
}
