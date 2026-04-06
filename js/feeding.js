// ===============================
// FEEDING TAB (Supabase Version)
// ===============================

// Assumes Supabase is initialized like:
// const supabase = window.supabaseClient

// ===============================
// OPEN FEEDING MODAL
// ===============================
function openFeedingModal() {
  const modalContent = `
    <div class="modal-title">Add Feeding</div>

    <!-- Container for feeding rows -->
    <div id="feeding-rows"></div>

    <!-- Buttons -->
    <div style="margin-top:10px;">
      <button type="button" id="add-feeding-row">Add Row</button>
      <button type="button" id="save-feeding">Save Feedings</button>
    </div>
  `;

  // Show modal (replace with your modal system)
  document.getElementById("modal-content").innerHTML = modalContent;
  document.getElementById("modal").style.display = "block";

  // Attach button listeners
  document.getElementById("add-feeding-row").addEventListener("click", addFeedingRow);
  document.getElementById("save-feeding").addEventListener("click", saveFeedingMulti);

  // Start with one row
  addFeedingRow();
}

// ===============================
// ADD FEEDING ROW
// ===============================
async function addFeedingRow() {
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

    <input type="text" name="feed_other" placeholder="Other feed..." style="display:none;" />

    <select name="supplement">
      <option value="">Supplement</option>
      <option value="none">None</option>
      <option value="probiotic">Probiotic</option>
      <option value="vitamin">Vitamin</option>
      <option value="other">Other</option>
    </select>

    <input type="text" name="supplement_other" placeholder="Other supplement..." style="display:none;" />

    <input type="number" step="0.1" name="amount" placeholder="Amount" />
    
    <select name="unit">
      <option value="">Unit</option>
      <option value="gallon">Gallon</option>
      <option value="quart">Quart</option>
      <option value="liter">Liter</option>
      <option value="lb">Pounds</option>
    </select>

    <input type="text" name="notes" placeholder="Notes" />

    <button type="button" class="remove-row-btn">Remove</button>
  `;

  container.appendChild(row);

  // Populate hive dropdown dynamically
  const hiveSelect = row.querySelector('[name="hive_id"]');
  try {
    const { data: hives, error } = await supabase.from("hives").select("id, name");
    if (error) throw error;
    hives.forEach(hive => {
      const option = document.createElement("option");
      option.value = hive.id;
      option.textContent = hive.name;
      hiveSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error fetching hives:", err);
  }

  // Show/hide "Other feed"
  const feedTypeSelect = row.querySelector('[name="feed_type"]');
  const feedOtherInput = row.querySelector('[name="feed_other"]');
  feedTypeSelect.addEventListener("change", e => {
    feedOtherInput.style.display = e.target.value === "other" ? "inline-block" : "none";
  });

  // Show/hide "Other supplement"
  const supplementSelect = row.querySelector('[name="supplement"]');
  const supplementOtherInput = row.querySelector('[name="supplement_other"]');
  supplementSelect.addEventListener("change", e => {
    supplementOtherInput.style.display = e.target.value === "other" ? "inline-block" : "none";
  });

  // Remove row
  row.querySelector(".remove-row-btn").addEventListener("click", () => row.remove());
}

// ===============================
// SAVE FEEDING ENTRIES TO SUPABASE
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

      // Validation
      if (!hive_id || !date || !feed_type) continue;
      if (amount && Number(amount) <= 0) continue;

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

    const { data, error } = await supabase.from("feedings").insert(payload).select();
    if (error) {
      console.error("Supabase error:", error);
      alert("Error saving feeding: " + error.message);
      return;
    }

    alert("Feeding saved successfully!");
    console.log("Saved successfully:", data);

    // Clear rows and add fresh row
    document.getElementById("feeding-rows").innerHTML = "";
    addFeedingRow();

    // Close modal
    document.getElementById("modal").style.display = "none";

  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Unexpected error occurred.");
  }
}

// ===============================
// FEEDING MODAL CSS (Inject or add to stylesheet)
// ===============================
const feedingCSS = `
#feeding-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  margin-top: 10px;
}
.feeding-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  align-items: center;
  background-color: #fafafa;
}
.feeding-row input,
.feeding-row select {
  padding: 5px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 3px;
}
.feeding-row button.remove-row-btn {
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 3px;
  padding: 5px 10px;
  cursor: pointer;
  height: 35px;
}
.feeding-row button.remove-row-btn:hover {
  background-color: #ff7875;
}
#add-feeding-row,
#save-feeding {
  padding: 8px 15px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
#add-feeding-row {
  background-color: #1890ff;
  color: #fff;
}
#add-feeding-row:hover {
  background-color: #40a9ff;
}
#save-feeding {
  background-color: #52c41a;
  color: #fff;
}
#save-feeding:hover {
  background-color: #73d13d;
}
`;

// Inject CSS dynamically
const styleEl = document.createElement("style");
styleEl.innerHTML = feedingCSS;
document.head.appendChild(styleEl);