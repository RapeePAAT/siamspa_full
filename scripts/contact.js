// === EmailJS Init ===
emailjs.init("pOtYxH7L3Hx-Q1smg");

// === Elements ===
const contactForm = document.getElementById("contactForm");
const contactName = document.getElementById("name");
const contactEmail = document.getElementById("email");
const contactSubject = document.getElementById("subject");
const contactMessage = document.getElementById("message");
const  userMail = "siamspafor.booking@gmail.com" ;
// === Popup Success ===



function showSuccessPopup(msg = "Registration Successful!") {
  const popup = document.getElementById("successPopup");
  if (!popup) return;
  popup.textContent = msg;
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 3000);
}

// === Submit Form ===
contactForm.addEventListener("submit", function(e){
  e.preventDefault();

  // === Validate Required Fields ===
  const requiredFields = [
    { el: contactName, label: "Name" },
    { el: contactEmail, label: "Email" },
    { el: contactMessage, label: "Message" }
  ];

  let valid = true;
  requiredFields.forEach(f=>{
    if(!f.el.value.trim()){
      f.el.classList.add("invalid"); // highlight
      valid = false;
    } else {
      f.el.classList.remove("invalid");
    }
  });

  if(!valid){
    alert("Please fill in all required fields.");
    return;
  }

  // === Prepare Data for Owner ===
  const ownerParams = {
  toemail: userMail,  // เจ้าของเว็บ
  fromemail: contactEmail.value.trim() || "no-reply@siamspa.com",
  reply_to: contactEmail.value.trim() || "no-reply@siamspa.com",
  title: `New Contact Message from ${contactName.value.trim() || "Anonymous"}`,
  message: `
New message received from contact form:

Name: ${contactName.value.trim() || "-"}
Email: ${contactEmail.value.trim() || "-"}
Subject: ${contactSubject.value.trim() || "-"}
Message:
${contactMessage.value.trim() || "-"}

-----------------------------
Sent via Siam Spa Contact Page
  `.trim()
};

  emailjs.send('service_ek0fi1s','template_6lbhvox', ownerParams)
    .then(() => console.log(""))
    .catch(err => console.error(err));

  // === Prepare Data for Customer (if email provided) ===
  if(contactEmail.value.trim()){
    const customerParams = {
      toemail: contactEmail.value.trim(),
      fromemail: userMail,
      reply_to: userMail,
      title: "Your Contact Form Submission",
      message: `
Hi ${contactName.value.trim()},

Thank you for contacting Siam Spa Sleep & Salon.

We have received your message:
Subject: ${contactSubject.value.trim() || "-"}
Message: ${contactMessage.value.trim()}

Our team will get back to you shortly.

Best regards,
Siam Spa Team
      `.trim()
    };

    emailjs.send('service_ek0fi1s','template_6lbhvox', customerParams)
      .then(()=> showSuccessPopup("Message Sent Successfully!"))
      .catch(err=> console.error(err));
  }

  // === Reset Form ===
  contactForm.reset();
});
