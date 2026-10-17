/**
 * Voulamandis House — guest arrival replies -> Beds24 booking notes.
 *
 * Google Apps Script for vhouse.reservations@gmail.com (script.google.com).
 * Every 10 minutes it finds new guest replies to the pre-arrival emails
 * ("Few days left..." / "Λίγες μέρες έμειναν πια...") and sends them to
 * https://chioshotel.gr/api/gmail/arrival-notes, which extracts the
 * arrival info and appends it to the booking notes in Beds24.
 *
 * Setup: see docs/gmail-arrival-notes.md
 */

var ENDPOINT = "https://chioshotel.gr/api/gmail/arrival-notes";
var OWN_ADDRESS = "vhouse.reservations@gmail.com";
var SEARCH_QUERY =
  'newer_than:3d -from:me subject:("Few days left" OR "Λίγες μέρες")';
var PROCESSED_KEEP_DAYS = 30;

function processArrivalReplies() {
  var secret = PropertiesService.getScriptProperties().getProperty("ARRIVAL_NOTES_SECRET");
  if (!secret) throw new Error("Set the ARRIVAL_NOTES_SECRET script property first.");

  var store = PropertiesService.getScriptProperties();
  var processed = JSON.parse(store.getProperty("processed") || "{}");
  var threads = GmailApp.search(SEARCH_QUERY, 0, 50);

  threads.forEach(function (thread) {
    thread.getMessages().forEach(function (message) {
      var id = message.getId();
      if (processed[id]) return;
      if (message.getFrom().toLowerCase().indexOf(OWN_ADDRESS) !== -1) return;

      // Booking ids are at the start of the subject: "✅ 87463166,87463197 - Name-..."
      var head = message.getSubject().split(" - ")[0];
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
          bookingIds: bookingIds,
          from: message.getFrom(),
          date: message.getDate().toISOString(),
          subject: message.getSubject(),
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
