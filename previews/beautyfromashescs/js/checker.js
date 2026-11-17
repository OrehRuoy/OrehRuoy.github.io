(function(){
  var D = window.BFA_INSURANCE; if (!D) return;
  var input = document.getElementById("ins-q"), out = document.getElementById("ins-result"),
      list = document.getElementById("ins-matches"), upd = document.querySelectorAll("[data-ins-updated]"),
      all = document.getElementById("ins-all");
  upd.forEach(function(e){ e.textContent = D.updated; });
  if (all) all.innerHTML = D.plans.map(function(p){ return "<li>" + esc(p.name) + "</li>"; }).join("");
  if (!input) return;
  function norm(s){ return s.toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9 ]+/g," ").replace(/\s+/g," ").trim(); }
  function esc(s){ return s.replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function search(q){
    q = norm(q); if (q.length < 2) return [];
    var words = q.split(" ");
    return D.plans.filter(function(p){
      var hay = [p.name].concat(p.also).map(norm);
      return hay.some(function(h){ return h.indexOf(q) !== -1 || words.every(function(w){ return h.indexOf(w) !== -1; }); });
    });
  }
  function note(q){ q = norm(q); for (var i=0;i<D.notes.length;i++){ if (D.notes[i].match.some(function(m){ return q.indexOf(m) !== -1 || (q.length>3 && m.indexOf(q)===0); })) return D.notes[i].text; } return ""; }
  function render(){
    var q = input.value, m = search(q), n = note(q);
    list.innerHTML = ""; out.className = "ins-result";
    if (norm(q).length < 2) { out.innerHTML = ""; return; }
    if (m.length) {
      out.classList.add("yes");
      out.innerHTML = "<p class='ins-head'><span aria-hidden='true'>✓</span> " + (m.length === 1 ? "In network through Headway" : m.length + " possible matches, all in network through Headway") + "</p>" +
        "<p>Lauren accepts " + (m.length === 1 ? "<strong>" + esc(m[0].name) + "</strong>" : "the plans below") + " through Headway. Headway checks your exact plan and shows your cost before your first session.</p>" + (n ? "<p class='ins-note'>" + esc(n) + "</p>" : "");
      if (m.length > 1) list.innerHTML = m.map(function(p){ return "<li>" + esc(p.name) + "</li>"; }).join("");
    } else {
      out.classList.add("no");
      out.innerHTML = "<p class='ins-head'>Not on the current list</p>" + (n ? "<p>" + esc(n) + "</p>" : "") +
        "<p>You're still welcome here. Self-pay rates are $100 for individual sessions and $110 for couples, and a sliding scale is available. Plans change often, so feel free to call <a href='tel:+18146447898'>(814) 644-7898</a> and ask.</p>";
    }
  }
  input.addEventListener("input", render);
  document.getElementById("ins-form").addEventListener("submit", function(e){ e.preventDefault(); render(); });
})();
