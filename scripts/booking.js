// === EmailJS init ===
emailjs.init("pOtYxH7L3Hx-Q1smg");

// === URL PARAM ===
const params = new URLSearchParams(window.location.search);
const promo = params.get("promo"); // relax2
const m = params.get("m");         // 60 / 90

// === PROMO MAP ===
const promoMap = {
  relax2: {
    "60": 2200,
    "90": 4200
  }
};

// === Elements ===
const sServiceList = document.getElementById("s-service-list");
const sDate = document.getElementById("s-date");
const sTime = document.getElementById("s-time");
const sName = document.getElementById("s-name");
const sPhone = document.getElementById("s-phone");
const sNote = document.getElementById("s-note");
const sTotal = document.getElementById("s-total");

const dateInput = document.getElementById("dateInput");
const timeFrom = document.getElementById("timeFrom");
const timeTo = document.getElementById("timeTo");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const noteInput = document.getElementById("note");
const guestsSelect = document.getElementById("guests");
const emailInput = document.getElementById("email");
const container = document.getElementById("serviceContainer");

const userMail = "siamspafor.booking@gmail.com";

// === Service Price Map ===
const serviceMap = {
  "Thai Head Spa": { "60 Min": 1900, "90 Min": 2900, "120 Min": 3900 },
  "Relax Head Spa": { "60 Min": 1400, "90 Min": 2500, "120 Min": 3500, "Signature 150 Min": 4500, "Premium 180 Min": 5500 },
  "Shirodhara": { "60 Min": 2200, "90 Min": 3200, "120 Min": 4200 },
  "Treatment": { "Pro Fresh 60 Min": 3000, "Pro Firm 90 Min": 3500, "Rewakening 90 Min": 3500 },
  "Waxing": {
    "Eyebrows": { Women: 300, Men: 450 },
    "Nose": { Women: 200, Men: 300 },
    "Nostrils": { Women: 200, Men: 300 },
    "OuterEars": { Women: 200, Men: 300 },
    "Cheeks": { Women: 200, Men: 300 },
    "Forehead": { Women: 350, Men: 450 },
    "Jawline": { Women: 200, Men: 300 },
    "UpperLip": { Women: 350, Men: 450 },
    "Chin": { Women: 350, Men: 450 },
    "Neck": { Women: 200, Men: 250 },
    "Nape": { Women: 300, Men: 350 },
    "Shoulders": { Women: 400, Men: 700 },
    "Underarms": { Women: 550, Men: 650 },
    "FullArms": { Women: 700, Men: 800 },
    "HalfArms": { Women: 400, Men: 500 },
    "Chest": { Women: 300, Men: 800 },
    "HandsFingers": { Women: 300, Men: 400 }
  }
};

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

for (let h = 12; h < 18; h++) {
  const opt = document.createElement("option");
  opt.value = `${h.toString().padStart(2, "0")}:00`;
  opt.textContent = format12Hour(h);
  timeFrom.appendChild(opt);
}

timeFrom.addEventListener("change", () => {
  if (!timeFrom.value) return;
  let hour = parseInt(timeFrom.value.split(":")[0]);
  hour = (hour + 2) % 24;
  timeTo.value = format12Hour(hour);
  updateSummary();
});

// === Populate Duration Options ===
function populateDurations(durSel, service, gender) {
  durSel.innerHTML = `<option value="">-- Select duration --</option>`;
  const durations = serviceMap[service];
  if (!durations) return;

  if (service === "Waxing") {
    Object.entries(durations).forEach(([name, priceObj]) => {
      const opt = document.createElement("option");
      opt.value = priceObj[gender];
      opt.textContent = `${name} — ${gender} (${priceObj[gender]} Bath)`;
      durSel.appendChild(opt);
    });
  } else {
    Object.entries(durations).forEach(([name, price]) => {
      const opt = document.createElement("option");
      opt.value = price;
      opt.textContent = `${name} — ${price} Bath`;
      durSel.appendChild(opt);
    });
  }
}

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
          <option value="Thai Head Spa">Thai Head Spa</option>
          <option value="Shirodhara">Shirodhara</option>
          <option value="Relax Head Spa">Relax Head Spa</option>
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

    const serviceSel = div.querySelector(".service-select");
    const genderSel = div.querySelector(".gender-select");
    const durSel = div.querySelector(".duration-select");

    // Service change
    serviceSel.addEventListener("change", () => {
      const service = serviceSel.value;
      durSel.disabled = true;

      if (!service) {
        durSel.innerHTML = `<option value="">-- Select duration --</option>`;
        genderSel.style.display = "none";
        updateSummary();
        return;
      }

      if (service === "Waxing") {
        genderSel.style.display = "inline-block";
        populateDurations(durSel, service, genderSel.value);
      } else {
        genderSel.style.display = "none";
        populateDurations(durSel, service, null);
      }

      durSel.disabled = false;
      updateSummary();
    });

    // Gender change (Waxing only)
    genderSel.addEventListener("change", () => {
      const service = serviceSel.value;
      if (service === "Waxing") {
        populateDurations(durSel, service, genderSel.value);
        updateSummary();
      }
    });

    // Duration change
    durSel.addEventListener("change", () => {
      durSel.classList.remove("invalid");
      updateSummary();
    });
  }
}

// === Update Summary ===
function updateSummary() {
  const rows = container.querySelectorAll(".service-row");
  let total = 0;
  let originalTotal = 0;
  sServiceList.innerHTML = "";

  // สำหรับดักจับโปร
  let relaxCount = 0;
  let relaxDurations = [];

  rows.forEach(row => {
    const service = row.querySelector(".service-select").value;
    const durSel = row.querySelector(".duration-select");
    const selectedOption = durSel.selectedOptions[0];
    const durationText = selectedOption?.textContent || "";
    const price = parseFloat(durSel.value) || 0;

    if (service && durationText && price > 0) {
      const li = document.createElement("li");
      li.textContent = `${service} (${durationText.split(" — ")[0]})`; // Clean up text for UI
      sServiceList.appendChild(li);
      total += price;
      originalTotal += price; // เก็บราคาตั้งต้นก่อน

      if (service === "Relax Head Spa") {
        relaxCount++;
        if (durationText.includes("60 Min")) relaxDurations.push("60");
        if (durationText.includes("90 Min")) relaxDurations.push("90");
      }
    }
  });

  if (sServiceList.children.length === 0) sServiceList.innerHTML = "<li>—</li>";

  // เช็คเงื่อนไขโปร: 2 คน, Relax Head Spa และเวลาเดียวกันทั้งคู่
  const promoBadge = document.getElementById("promo-badge");
  const sDiscount = document.getElementById("s-discount");
  let isPromoApplied = false;

  if (relaxCount === 2 && guestsSelect.value === "2") {
    if (relaxDurations.length === 2 && relaxDurations[0] === relaxDurations[1]) {
      const dur = relaxDurations[0];
      if (promoMap.relax2[dur]) {
        // ดึงราคาโปรโมชั่น
        total = promoMap.relax2[dur]; 
        isPromoApplied = true;
      }
    }
  }

  // Update DOM Promo
  if (promoBadge && sDiscount) {
    if (isPromoApplied) {
      promoBadge.style.display = "inline-block";
      sDiscount.style.display = "block";
      sDiscount.textContent = `${originalTotal.toLocaleString()} Bath`;
    } else {
      promoBadge.style.display = "none";
      sDiscount.style.display = "none";
    }
  }

  const fromHour = timeFrom.value
    ? format12Hour(parseInt(timeFrom.value.split(":")[0]))
    : "—";

  sDate.textContent = dateInput.value || "—";
  sTime.textContent = timeFrom.value ? `${fromHour} → ${timeTo.value}` : "—";
  sName.textContent = nameInput.value || "—";
  sPhone.textContent = phoneInput.value || "—";
  sNote.textContent = noteInput.value || "—";
  sTotal.textContent = total > 0 ? `${total.toLocaleString()} Bath` : "—";
  
  // แนบค่า total ที่แท้จริงไปยัง DOM เพื่อให้ submitBooking โกยไปใช้
  sTotal.dataset.actualTotal = total;
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

  container.querySelectorAll(".service-row").forEach((row, idx) => {
    const serviceSel = row.querySelector(".service-select");
    const durSel = row.querySelector(".duration-select");
    if (!serviceSel.value) requiredFields.push({ el: serviceSel, label: `Service Guest ${idx + 1}` });
    if (!durSel.value) requiredFields.push({ el: durSel, label: `Duration Guest ${idx + 1}` });
  });

  const missingFields = [];
  requiredFields.forEach(f => {
    if (!f.el.value.trim()) {
      f.el.classList.add("invalid");
      missingFields.push(f.label);
    } else {
      f.el.classList.remove("invalid");
    }
  });

  if (missingFields.length > 0) {
    showFailPopup("ระบุ: " + missingFields.join(", "));
    return;
  }

  const rows = container.querySelectorAll(".service-row");
  const services = Array.from(rows).map(row => {
    const s = row.querySelector(".service-select").value;
    const d = row.querySelector(".duration-select").selectedOptions[0]?.textContent || "";
    return `${s} (${d})`;
  });

  const totalPrice = parseFloat(sTotal.dataset.actualTotal) || 0;

  const formData = {
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
    date: dateInput.value,
    time: `${timeFrom.value} → ${timeTo.value}`,
    services,
    note: noteInput.value.trim(),
    total: totalPrice
  };

  // EmailJS — Owner
  const ownerParams = {
    toemail: userMail,
    fromemail: formData.email || "no-reply@siamspa.com",
    reply_to: formData.email || "no-reply@siamspa.com",
    title: `New SPA Booking: ${formData.name}`,
    message: `
New booking received:

Name:     ${formData.name}
Phone:    ${formData.phone}
Email:    ${formData.email || "-"}
Date:     ${formData.date}
Time:     ${formData.time}
Services: ${formData.services.join(", ")}
Notes:    ${formData.note || "-"}
Total:    ${formData.total.toLocaleString()} Bath
    `.trim()
  };

  emailjs.send("service_ek0fi1s", "template_6lbhvox", ownerParams)
    .then(() => console.log("Owner email sent"))
    .catch(err => console.error("Owner email error:", err));

  // EmailJS — Customer
  if (formData.email) {
    const customerParams = {
      toemail: formData.email,
      fromemail: userMail,
      reply_to: userMail,
      title: "Your SPA Booking Confirmation",
      message: `
Hi ${formData.name},

Thank you for booking with Siam Spa Sleep & Salon.

Your booking details:
Date:     ${formData.date}
Time:     ${formData.time}
Services: ${formData.services.join(", ")}
Total:    ${formData.total.toLocaleString()} Bath

Best regards,
Siam Spa Team
      `.trim()
    };

    emailjs.send("service_ek0fi1s", "template_6lbhvox", customerParams)
      .then(() => showSuccessPopup("Booking Successful!"))
      .catch(err => console.error("Customer email error:", err));
  }

  // Reset
  document.getElementById("bookingForm").reset();
  generateServiceFields(1);
  updateSummary();
}

// === Event Listeners ===
document.querySelector(".btn-confirm").addEventListener("click", e => {
  e.preventDefault();
  submitBooking();
});

[dateInput, nameInput, phoneInput, noteInput, emailInput].forEach(el =>
  el.addEventListener("input", updateSummary)
);

guestsSelect.addEventListener("change", e => {
  generateServiceFields(parseInt(e.target.value));
  updateSummary();
});

// === INIT ===
generateServiceFields(1);
updateSummary();

// === APPLY PROMO ===
if (promo === "relax2" && m) {
  guestsSelect.value = "2";
  generateServiceFields(2);

  setTimeout(() => {
    const rows = container.querySelectorAll(".service-row");

    rows.forEach(row => {
      const serviceSel = row.querySelector(".service-select");
      const durSel = row.querySelector(".duration-select");

      serviceSel.value = "Relax Head Spa";
      serviceSel.dispatchEvent(new Event("change"));

      setTimeout(() => {
        // หา option ที่ตรงกับ duration จาก URL param
        const match = Array.from(durSel.options).find(opt =>
          opt.textContent.startsWith(`${m} Min`)
        );
        if (match) durSel.value = match.value;

        // Override ด้วยราคาโปร
        const promoPrice = promoMap[promo]?.[m];
        if (promoPrice !== undefined) {
          // เพิ่ม hidden option ถ้าราคาโปรไม่มีใน list
          if (!Array.from(durSel.options).some(o => parseFloat(o.value) === promoPrice)) {
            const promoOpt = document.createElement("option");
            promoOpt.value = promoPrice;
            promoOpt.textContent = `${m} Min — ${promoPrice} Bath (Promo)`;
            durSel.appendChild(promoOpt);
          }
          durSel.value = promoPrice;
        }

        durSel.dispatchEvent(new Event("change"));
      }, 150);
    });

    updateSummary();
  }, 250);
}