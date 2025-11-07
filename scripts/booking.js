// === Elements ===
const sServiceList = document.getElementById("s-service-list");
const sDate = document.getElementById("s-date");
const sTime = document.getElementById("s-time");
const sName = document.getElementById("s-name");
const sPhone = document.getElementById("s-phone");
const sNote = document.getElementById("s-note");
const sTotal = document.getElementById("s-total");
const sVocher = document.getElementById("s-voucher");

const dateInput = document.getElementById("dateInput");
const timeFrom = document.getElementById("timeFrom");
const timeTo = document.getElementById("timeTo");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const noteInput = document.getElementById("note");
const vocherInput = document.getElementById("voucher");
const guestsSelect = document.getElementById("guests");
const container = document.getElementById("serviceContainer");

// === Service Data ===
const serviceMap = {
  "Relaxed Head": { "30 Min": 1500, "60 Min": 2500 },
  "Shirodhara": { "30 Min": 2500, "60 Min": 4500 },
  "Thai Head Spa": { "60 Min": 2800, "120 Min": 4500 },
  "Treatment": { "60 Min": 1800, "90 Min": 3000 },
  "Waxing": { "30 Min": 1000, "60 Min": 1600 }
};

// === Helper ===
function format12Hour(hour) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display.toString().padStart(2, "0")}:00 ${suffix}`;
}

// === Generate Time Options ===
for (let h = 10; h < 20; h++) {
  const opt = document.createElement("option");
  opt.value = `${h.toString().padStart(2, "0")}:00`;
  opt.textContent = format12Hour(h);
  timeFrom.appendChild(opt);
}

// === When start time changes => auto set +2hr ===
timeFrom.addEventListener("change", () => {
  if (!timeFrom.value) return;
  let hour = parseInt(timeFrom.value.split(":")[0]);
  hour = (hour + 2) % 24;
  timeTo.value = format12Hour(hour);
  updateSummary();
});

function generateServiceFields(count) {
  container.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const div = document.createElement("div");
    div.classList.add("form-group", "service-row");

    // ✅ ใช้ backtick ครอบ HTML ทั้งบล็อก
    div.innerHTML = `
      <label class="label">Guest ${i} — Select Service</label>
      <div class="service-pair">
        <div class="select-wrapper">
          <select class="input-field service-select" required>
            <option value="">-- Choose a service --</option>
            ${Object.keys(serviceMap)
              .map(s => `<option value="${s}">${s}</option>`)
              .join("")}
          </select>
        </div>
        <div class="select-wrapper">
          <select class="input-field duration-select" disabled>
            <option value="">-- Select duration --</option>
          </select>
        </div>
      </div>
    `;
    container.appendChild(div);
  }

  // === เมื่อเลือก Service ===
  container.querySelectorAll(".service-select").forEach(sel => {
    sel.addEventListener("change", e => {
      const service = e.target.value;
      // ✅ ใช้ parentElement.closest เพื่อความแม่นยำ
      const durSel = e.target.closest(".service-row").querySelector(".duration-select");
      durSel.innerHTML = `<option value="">-- Duration --</option>`;

      if (serviceMap[service]) {
        Object.entries(serviceMap[service]).forEach(([dur, price]) => {
          const opt = document.createElement("option");
          opt.value = price;
          opt.textContent = `${dur} — ${price.toLocaleString()} Bath`;
          durSel.appendChild(opt);
        });
        durSel.disabled = false;
      } else {
        durSel.disabled = true;
      }
      updateSummary();
    });
  });

  // === เมื่อเลือก Duration ===
  container.querySelectorAll(".duration-select").forEach(sel => {
    sel.addEventListener("change", updateSummary);
  });
}

// === Update Summary ===
function updateSummary() {
  const rows = container.querySelectorAll(".service-row");
  let total = 0;
  sServiceList.innerHTML = "";

  rows.forEach(row => {
    const service = row.querySelector(".service-select").value;
    const duration = row.querySelector(".duration-select").selectedOptions[0]?.textContent || "";
    const price = parseFloat(row.querySelector(".duration-select").value) || 0;
    if (service && duration) {
      const li = document.createElement("li");
      li.textContent = `${service} (${duration})`;
      sServiceList.appendChild(li);
      total += price;
    }
  });

  if (sServiceList.children.length === 0) {
    const li = document.createElement("li");
    li.textContent = "—";
    sServiceList.appendChild(li);
  }

  sDate.textContent = dateInput.value || "—";
  sTime.textContent = timeFrom.value ? `${timeFrom.value} → ${timeTo.value}` : "—";
  sName.textContent = nameInput.value || "—";
  sPhone.textContent = phoneInput.value || "—";
  sNote.textContent = noteInput.value || "—";

  // === Voucher (5%) ===
  const v = vocherInput.value.trim();
  let discount = 0;
  if (v) {
    discount = total * 0.05;
    sVocher.textContent = "5% Discount Applied";
  } else {
    sVocher.textContent = "—";
  }

  const finalTotal = total - discount;
  sTotal.textContent = finalTotal > 0 ? `${finalTotal.toLocaleString()} Bath` : "—";
}

// === Live updates ===
[dateInput, nameInput, phoneInput, noteInput, vocherInput].forEach(el =>
  el.addEventListener("input", updateSummary)
);

guestsSelect.addEventListener("change", e => {
  generateServiceFields(parseInt(e.target.value));
  updateSummary();
});

// === Init ===
generateServiceFields(1);
