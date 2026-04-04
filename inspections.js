// ═══════════════════════════════════════════════════════
// INSPECTIONS
// Reminder logic lives in reminders.js — use named entry points
// ═══════════════════════════════════════════════════════

function deleteInsp(id) {
  confirmDelete('Delete this inspection report?', async function() {
    await dbDelete('inspections', id);
    DATA.inspections = DATA.inspections.filter(function(i) { return i.id !== id; });
    renderAll();
  });
}
