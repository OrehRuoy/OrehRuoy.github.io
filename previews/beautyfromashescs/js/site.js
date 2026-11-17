(function(){
  // Booking links: one setting in config.js
  var url = (window.BFA_BOOKING_URL || "").trim();
  document.querySelectorAll("[data-book]").forEach(function(a){
    if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
  });
  document.querySelectorAll("[data-book-pending]").forEach(function(el){ el.hidden = !!url; });
  document.querySelectorAll("[data-book-live]").forEach(function(el){ el.hidden = !url; });
  // Mobile menu
  var btn = document.querySelector(".menu-toggle"), nav = document.getElementById("site-nav");
  if (btn && nav) btn.addEventListener("click", function(){
    var open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open)); nav.classList.toggle("open", !open);
  });
  var y = document.getElementById("yr"); if (y) y.textContent = new Date().getFullYear();
})();
