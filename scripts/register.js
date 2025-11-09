// === EmailJS init ===
emailjs.init("pOtYxH7L3Hx-Q1smg");

// === ฟังก์ชัน Popup ===
function showSuccessPopup(msg = "Registration Successful!") {
  const popup = document.getElementById("successPopup");
  if (!popup) return;
  popup.textContent = msg;
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 3000);
}

// === ฟังก์ชันส่งอีเมล ===
function sendRegisterEmail(formData) {
  const ownerParams = {
    toemail: "rapeepattiamklee@gmail.com",
    fromemail: formData.email,
    reply_to: formData.email,
    title: `New Registration: ${formData.firstname} ${formData.lastname}`,
    message: `
New registration received:

First name: ${formData.firstname}
Last name: ${formData.lastname}
Gender: ${formData.gender}
Nationality: ${formData.nationality}
Birthdate: ${formData.birthdate}
Age: ${formData.age}
Email: ${formData.email}
Line: ${formData.line || "-"}
    `.trim()
  };

  emailjs.send('service_ek0fi1s', 'template_6lbhvox', ownerParams)
    .then(() => console.log("Owner email sent"))
    .catch(err => console.error(err));

  const customerParams = {
    toemail: formData.email,
    fromemail: "rapeepattiamklee@gmail.com",
    reply_to: "rapeepattiamklee@gmail.com",
    title: "Your Registration Confirmation",
    message: `
Hi ${formData.firstname},

Thank you for registering with Siam Spa Sleep & Salon.

We have received your information successfully.
Your Voucher will be sent to you shortly.

Best regards,
Siam Spa Team
    `.trim()
  };

  emailjs.send('service_ek0fi1s', 'template_6lbhvox', customerParams)
    .then(() => showSuccessPopup("Registration Successful!"))
    .catch(err => console.error(err));
}

// === ฟังก์ชัน submit form พร้อม Validate Required ===
document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const requiredFields = Array.from(this.querySelectorAll("[required]"));
  let valid = true;

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.classList.add("invalid"); // ใส่ class highlight ถ้าอยากมี CSS
      valid = false;
    } else {
      field.classList.remove("invalid");
    }
  });

  if (!valid) {
    alert("Please fill in all required fields.");
    return;
  }

  const formData = {
    firstname: this.firstname.value.trim(),
    lastname: this.lastname.value.trim(),
    gender: this.gender.value,
    nationality: this.nationality.value,
    birthdate: this.birthdate.value,
    age: this.age.value,
    email: this.email.value.trim(),
    line: this.line.value.trim()
  };

  sendRegisterEmail(formData);

  // รีเซ็ตฟอร์ม
  this.reset();
});
