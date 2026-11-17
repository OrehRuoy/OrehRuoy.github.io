/* ===== Insurance list (edit this file only) =====
   Source: Lauren's Headway profile (care.headway.co/providers/lauren-albright).
   To update: change `updated`, then add/remove lines in `plans`.
   `also` = other names people might type for the same plan. */
window.BFA_INSURANCE = {
  updated: "Nov 17, 2026",
  plans: [
    { name: "Aetna", also: [] },
    { name: "Aetna Medicare Advantage", also: ["aetna medicare"] },
    { name: "Capital Blue Cross (Pennsylvania)", also: ["capital bc", "capital bcbs", "cbc", "blue cross"] },
    { name: "Carelon Behavioral Health", also: ["beacon", "beacon health options"] },
    { name: "Cigna", also: ["evernorth", "cigna evernorth"] },
    { name: "Curative", also: [] },
    { name: "Devoted Health Medicare Advantage", also: ["devoted"] },
    { name: "Geisinger", also: ["geisinger health plan", "ghp"] },
    { name: "Geisinger Medicare Advantage", also: ["geisinger gold", "geisinger medicare"] },
    { name: "Highmark Blue Cross Blue Shield (Pennsylvania)", also: ["highmark", "highmark bcbs", "bcbs", "blue cross", "blue shield"] },
    { name: "Horizon Blue Cross and Blue Shield of New Jersey", also: ["horizon", "horizon bcbs", "bcbs", "blue cross", "blue shield"] },
    { name: "Humana Medicare Advantage", also: ["humana"] },
    { name: "Independence Blue Cross (Pennsylvania) – Virtual National Network", also: ["ibx", "independence", "blue cross"] },
    { name: "Oscar", also: ["oscar health"] },
    { name: "Oxford", also: ["oxford health"] },
    { name: "Providence Health Plan", also: ["providence"] },
    { name: "The Health Plan", also: ["thp", "health plan"] },
    { name: "UnitedHealthcare", also: ["united healthcare", "united", "uhc"] },
    { name: "UnitedHealthcare Medicare Advantage", also: ["united medicare", "uhc medicare"] }
  ],
  /* Friendly notes for common searches that are NOT on the list */
  notes: [
    { match: ["medicaid", "medical assistance", "chip", "upmc for you", "pa health", "ccbh", "community care"], text: "Medicaid / Medical Assistance plans aren't on Lauren's current list." },
    { match: ["original medicare", "traditional medicare", "medicare part b"], text: "Original (traditional) Medicare isn't on the current list. Some Medicare Advantage plans are; try typing your plan's company name." },
    { match: ["tricare"], text: "TRICARE isn't on Lauren's current list." }
  ]
};
