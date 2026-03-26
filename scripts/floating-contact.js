// ============================================================
//  Floating Contact Widget – toggle on click
// ============================================================
(function () {
  const widget = document.querySelector('.float-contact');
  const toggle = document.querySelector('.float-toggle');
  if (!widget || !toggle) return;

  toggle.addEventListener('click', () => {
    widget.classList.toggle('open');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!widget.contains(e.target)) {
      widget.classList.remove('open');
    }
  });
})();
