// ===============================
// FEEDING TAB (Supabase Version)
// ===============================

// Assumes you already initialized Supabase like:
// const supabase = window.supabaseClient;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("add-feeding-row").addEventListener("click", addFeedingRow);
  document.getElementById("save-feeding").addEventListener("click", saveFeedingMulti);

  // Start with one row
  addFeedingRow();
});

// ===============================
// ADD ROW
// ===============================
function addFeedingRow() {
  const container = document.getElementById("feeding-rows");

  const row = document.createElement("div");
  row.className = "feeding-row";

  row.innerHTML = `
    <select name="hive_id">
      <option value="">Select Hive</option>
    </select>

    <input type="date" name="date" />

    <select name="feed_type">
      <option value="">Feed Type</option>
      <option value="syrup">Syrup</option>
      <option value="fondant">Fondant</option>
      <option value="pollen">Pollen</option>
      <option value="other">Other</option>
    </select>

    <input type="text" name="feed_other" placeholder="Other feed..." />

    <select name="supplement">
      <option value="">Supplement</option>
      <option value="none">None</option>
      <option value="probiotic">Probiotic</option>
      <option value="vitamin">Vitamin</option>
      <option value="other">Other</option>
    </select>

    <input type="text" name="supplement_other" placeholder="Other supplement..." />

    <input type="number" step="0.1" name="amount" placeholder="Amount" />
    
    <select name="unit">
      <option value="">Unit</option>
      <option value="gallon">Gallon</option>
      <option value="quart">Quart</option>
      <option value="liter">Liter</option>
      <option value="lb">Pounds</option>
    </select>

    <input type="text" name="notes" placeholder="Notes" />

    <button type="button" onclick="this.parentElement.remove()">Remove</button>
  `;

  container.appendChild(row);
}

// ===============================
// SAVE TO SUPABASE
// ===============================
async function saveFeedingMulti() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("You must be logged in.");
      return;
    }

    const rows = Array.from(document.querySelectorAll(".feeding-row"));
    const payload = [];

    for (let row of rows) {
      const hive_id = row.querySelector('[name="hive_id"]').value;
      const date = row.querySelector('[name="date"]').value;
      const feed_type = row.querySelector('[name="feed_type"]').value;
      const feed_other = row.querySelector('[name="feed_other"]').value;
      const supplement = row.querySelector('[name="supplement"]').value;
      const supplement_other = row.querySelector('[name="supplement_other"]').value;
      const amount = row.querySelector('[name="amount"]').value;
      const unit = row.querySelector('[name="unit"]').value;
      const notes = row.querySelector('[name="notes"]').value;

      // Basic validation
      if (!hive_id || !date || !feed_type) continue;

      payload.push({
        hive_id,
        date,
        feed_type,
        feed_other: feed_other || null,
        supplement: supplement || null,
        supplement_other: supplement_other || null,
        amount: amount ? Number(amount) : null,
        unit: unit || null,
        notes: notes || null,
        user_id: user.id
      });
    }

    if (!payload.length) {
      alert("No valid feeding entries.");
      return;
    }

    console.log("Submitting to Supabase:", payload);

    const { data, error } = await supabase
      .from("feedings")
      .insert(payload)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      alert("Error saving feeding: " + error.message);
      return;
    }

    console.log("Saved successfully:", data);

    alert("Feeding saved successfully!");

    // Clear UI after save
    document.getElementById("feeding-rows").innerHTML = "";
    addFeedingRow();

  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Unexpected error occurred.");
  }
}