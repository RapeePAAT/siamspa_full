// === EmailJS init ===
emailjs.init("pOtYxH7L3Hx-Q1smg");

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
const emailInput = document.getElementById("email");

const container = document.getElementById("serviceContainer");

// === Popup functions ===
function showSuccessPopup(msg = "Booking Successful!") {
  const popup = document.getElementById("successPopup");
  if (!popup) return;
  popup.textContent = msg;
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 3000);
}

function showFailPopup(msg = "Please fill required fields!") {
  const popup = document.getElementById("failPopup");
  if (!popup) return;
  popup.textContent = msg;
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 3000);
}

// === Generate Time Options ===
function format12Hour(hour) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display.toString().padStart(2, "0")}:00 ${suffix}`;
}

for (let h = 10; h < 20; h++) {
  const opt = document.createElement("option");
  opt.value = `${h.toString().padStart(2, "0")}:00`;
  opt.textContent = format12Hour(h);
  timeFrom.appendChild(opt);
}

// === Auto fill end time +2hr ===
timeFrom.addEventListener("change", () => {
  if (!timeFrom.value) return;
  let hour = parseInt(timeFrom.value.split(":")[0]);
  hour = (hour + 2) % 24;
  timeTo.value = format12Hour(hour);
  updateSummary();
});

// === Generate Service Fields ===
function generateServiceFields(count) {
  container.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const div = document.createElement("div");
    div.classList.add("form-group", "service-row");

    div.innerHTML = `
      <label class="label">Guest ${i} — Select Service</label>
      <div class="service-pair">
        <select class="input-field service-select" required>
          <option value="">-- Choose a service --</option>
          <option value="Head Spa">Head Spa</option>
          <option value="Shirodhara">Shirodhara</option>
          <option value="Relax">Relax</option>
          <option value="Treatment">Treatment</option>
          <option value="Waxing">Waxing</option>
        </select>
        <select class="input-field gender-select" style="display:none;">
          <option value="Women">Women</option>
          <option value="Men">Men</option>
        </select>
        <select class="input-field duration-select" disabled required>
          <option value="">-- Select duration --</option>
        </select>
      </div>
    `;
    container.appendChild(div);
  }

  container.querySelectorAll(".service-select").forEach(sel => {
    sel.addEventListener("change", e => {
      const service = e.target.value;
      const row = e.target.closest(".service-row");
      const durSel = row.querySelector(".duration-select");
      const genderSel = row.querySelector(".gender-select");

      durSel.innerHTML = `<option value="">-- Select duration --</option>`;

      if (!service) {
        durSel.disabled = true;
        genderSel.style.display = "none";
        updateSummary();
        return;
      }

      // === Waxing require gender ===
      if (service === "Waxing") {
        genderSel.style.display = "inline-block";
      } else {
        genderSel.style.display = "none";
      }

      // === Dummy durations (replace with serviceMap) ===
      const durations = service === "Head Spa" ? { "60 Min": 1900, "90 Min": 2900 } :
                        service === "Relax" ? { "60 Min": 1400, "90 Min": 2200 } :
                        service === "Treatment" ? { "PRO FRESH 60 Min": 3000 } :
                        service === "Waxing" ? { "Eyebrows": { "Women": 300, "Men": 450 } } : {};

      if (service === "Waxing") {
        const gender = genderSel.value;
        Object.entries(durations).forEach(([name, priceObj]) => {
          const opt = document.createElement("option");
          opt.value = priceObj[gender];
          opt.textContent = `${name} — ${gender} (${priceObj[gender]} Bath)`;
          durSel.appendChild(opt);
        });

        genderSel.addEventListener("change", () => {
          durSel.innerHTML = `<option value="">-- Select duration --</option>`;
          const gender = genderSel.value;
          Object.entries(durations).forEach(([name, priceObj]) => {
            const opt = document.createElement("option");
            opt.value = priceObj[gender];
            opt.textContent = `${name} — ${gender} (${priceObj[gender]} Bath)`;
            durSel.appendChild(opt);
          });
          updateSummary();
        });
      } else {
        Object.entries(durations).forEach(([name, price]) => {
          const opt = document.createElement("option");
          opt.value = price;
          opt.textContent = `${name} — ${price} Bath`;
          durSel.appendChild(opt);
        });
      }

      durSel.disabled = false;
      updateSummary();
    });
  });

  container.querySelectorAll(".duration-select").forEach(sel => {
    sel.addEventListener("change", () => {
      sel.classList.remove("invalid");
      updateSummary();
    });
  });
}

// === Update Summary ===
function updateSummary() {
  const rows = container.querySelectorAll(".service-row");
  let total = 0;
  sServiceList.innerHTML = "";

  rows.forEach(row => {
    const service = row.querySelector(".service-select").value;
    const durSel = row.querySelector(".duration-select");
    const selectedOption = durSel.selectedOptions[0];
    let durationText = selectedOption?.textContent || "";
    let price = parseFloat(durSel.value) || 0;

    if (service && durationText) {
      const li = document.createElement("li");
      li.textContent = `${service} (${durationText})`;
      sServiceList.appendChild(li);
      total += price;
    }
  });

  if (sServiceList.children.length === 0) sServiceList.innerHTML = "<li>—</li>";

  sDate.textContent = dateInput.value || "—";
  sTime.textContent = timeFrom.value ? `${timeFrom.value} → ${timeTo.value}` : "—";
  sName.textContent = nameInput.value || "—";
  sPhone.textContent = phoneInput.value || "—";
  sNote.textContent = noteInput.value || "—";
    emailInput.textContent = emailInput.value || "—";


  const discount = vocherInput.value.trim() ? total * 0.05 : 0;
  sVocher.textContent = vocherInput.value.trim() ? "5% Discount Applied" : "—";

  sTotal.textContent = total - discount > 0 ? `${(total - discount).toLocaleString()} Bath` : "—";
}

// === Submit Booking ===
function submitBooking() {
  const requiredFields = [
    { el: nameInput, label: "Name" },
    { el: phoneInput, label: "Phone" },
    { el: dateInput, label: "Date" },
        { el: emailInput, label: "Email" },
    { el: timeFrom, label: "Time" },
  ];

  // Check Service / Duration per guest
  container.querySelectorAll(".service-row").forEach((row, idx) => {
    const serviceSel = row.querySelector(".service-select");
    const durSel = row.querySelector(".duration-select");
    if (!serviceSel.value) requiredFields.push({ el: serviceSel, label: `Service Guest ${idx + 1}` });
    if (!durSel.value) requiredFields.push({ el: durSel, label: `Duration Guest ${idx + 1}` });
  });

  // Highlight missing fields
  const missingFields = [];
  requiredFields.forEach(f => {
    if (!f.el.value.trim()) {
      f.el.classList.add("invalid"); // Add red border / background
      missingFields.push(f.label);
    } else {
      f.el.classList.remove("invalid");
    }
  });

  if (missingFields.length > 0) {
    showFailPopup("ระบุ: " + missingFields.join(", "));
    return;
  }

  // Prepare Data
  const rows = container.querySelectorAll(".service-row");
  const services = Array.from(rows).map(row => {
    const s = row.querySelector(".service-select").value;
    const d = row.querySelector(".duration-select").selectedOptions[0]?.textContent || "";
    return `${s} (${d})`;
  });

  const totalPrice = parseFloat(sTotal.textContent.replace(/[^0-9]/g, "")) || 0;

  const formData = {
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: document.getElementById("email").value.trim(),
    date: dateInput.value,
    time: `${timeFrom.value} → ${timeTo.value}`,
    services,
    voucher: vocherInput.value.trim(),
    note: noteInput.value.trim(),
    total: totalPrice
  };

  // === EmailJS Owner ===
  const ownerParams = {
    toemail: "rapeepattiamklee@gmail.com",
    fromemail: formData.email || "no-reply@siamspa.com",
    reply_to: formData.email || "no-reply@siamspa.com",
    title: `New SPA Booking: ${formData.name}`,
    message: `
New booking received:

Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email || "-"}
Date: ${formData.date}
Time: ${formData.time}
Services: ${formData.services.join(", ")}
Voucher: ${formData.voucher || "-"}
Notes: ${formData.note || "-"}
Total: ${formData.total.toLocaleString()} Bath
    `.trim()
  };

  emailjs.send('service_ek0fi1s', 'template_6lbhvox', ownerParams)
    .then(() => console.log("Owner email sent"))
    .catch(err => console.error(err));

  // === EmailJS Customer ===
  if (formData.email) {
    const customerParams = {
      toemail: formData.email,
      fromemail: "rapeepattiamklee@gmail.com",
      reply_to: "rapeepattiamklee@gmail.com",
      title: "Your SPA Booking Confirmation",
      message: `
Hi ${formData.name},

Thank you for booking with Siam Spa Sleep & Salon.

Your booking details:
Date: ${formData.date}
Time: ${formData.time}
Services: ${formData.services.join(", ")}

${formData.voucher ? "Your voucher code: " + formData.voucher : "Your voucher will be sent shortly."}

Total: ${formData.total.toLocaleString()} Bath

Best regards,
Siam Spa Team
      `.trim()
    };

    emailjs.send('service_ek0fi1s', 'template_6lbhvox', customerParams)
      .then(() => showSuccessPopup("Booking Successful!"))
      .catch(err => console.error(err));
  }

  // Reset Form
  document.getElementById("bookingForm").reset();
  generateServiceFields(1);
  updateSummary();
}

// === Event Listener ===
document.querySelector(".btn-confirm").addEventListener("click", e => {
  e.preventDefault();
  submitBooking();
});

// === Live Updates ===
[dateInput, nameInput, phoneInput, noteInput, vocherInput].forEach(el => el.addEventListener("input", updateSummary));
guestsSelect.addEventListener("change", e => { generateServiceFields(parseInt(e.target.value)); updateSummary(); });

// === Init ===
generateServiceFields(1);
updateSummary();
