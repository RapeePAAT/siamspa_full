const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const closeMenu = document.querySelector('.close-menu');
const dropdownMenus = document.querySelectorAll('.dropdown-menu');
const navbar = document.querySelector(".navbar")
// เปิด/ปิด Hamburger menu
hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  navLinks.classList.add('active');
});

// ปุ่ม X ปิดเมนู
closeMenu.addEventListener('click', () => {
  navLinks.classList.remove('active');
});

// Toggle Service dropdown
dropdownMenus.forEach(menu => {
  menu.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('active');
  });
});

// คลิกนอกปิด Hamburger และ Dropdown
document.addEventListener('click', () => {
  navLinks.classList.remove('active');
  dropdownMenus.forEach(menu => menu.classList.remove('active'));
});

// ป้องกันคลิกใน nav-links ไม่ให้ปิดเมนู
navLinks.addEventListener('click', (e) => e.stopPropagation());


