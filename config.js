// Single source of truth for values shared by the guide and the Wi-Fi card.
// Fill these in, then re-export the PDFs.
window.MAISON = {
  guideUrl: "https://olive714.github.io/maison-midi/",
  wifi: {
    ssid: "Livebox-22E0",
    password: "HAY6Hxodk3K7enn6Ds",
    security: "WPA" // WPA (WPA2/WPA3) or WEP; "nopass" for an open network
  }
};

// Returns the Wi-Fi QR payload, or null while the placeholders are not filled.
window.MAISON.wifiQrPayload = function () {
  var w = window.MAISON.wifi;
  if (/^\[/.test(w.ssid) || /^\[/.test(w.password)) return null;
  var esc = function (s) { return s.replace(/([\\;,:"])/g, "\\$1"); };
  return "WIFI:T:" + w.security + ";S:" + esc(w.ssid) + ";P:" + esc(w.password) + ";;";
};

// Renders a crisp SVG QR code into `el` (needs qrcode-generator loaded).
window.MAISON.renderWifiQr = function (el) {
  var payload = window.MAISON.wifiQrPayload();
  if (!payload || typeof qrcode === "undefined") { el.classList.add("qr-empty"); return; }
  var qr = qrcode(0, "M");
  qr.addData(payload);
  qr.make();
  var svg = new DOMParser()
    .parseFromString(qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true }), "image/svg+xml")
    .documentElement;
  el.classList.remove("qr-empty");
  el.replaceChildren(svg);
};

// Fills every [data-wifi="ssid|password"] element with the configured value.
window.MAISON.fillWifi = function (root) {
  var w = window.MAISON.wifi;
  (root || document).querySelectorAll("[data-wifi]").forEach(function (el) {
    var v = w[el.dataset.wifi];
    el.textContent = v;
    el.classList.toggle("todo", /^\[/.test(v));
  });
};

// Renders a QR code pointing to the online guide into `el`.
window.MAISON.renderGuideQr = function (el) {
  if (!el || typeof qrcode === "undefined") return;
  var qr = qrcode(0, "M");
  qr.addData(window.MAISON.guideUrl);
  qr.make();
  var svg = new DOMParser()
    .parseFromString(qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true }), "image/svg+xml")
    .documentElement;
  el.replaceChildren(svg);
};
