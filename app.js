const MIM_CONFIG = {
  ownerEmail: "almuqrimultimedia@gmail.com",
  ownerPassword: "Alanini?2504",
  studio: "MiM Shootography",
  whatsapp: "6285156939177",
  email: "almuqrimultimedia@gmail.com",
  price: 100000,
  seedAccount: null
};

function getAccounts() {
  try {
    const stored = JSON.parse(localStorage.getItem("mim_accounts") || "[]");
    if (!stored.length && MIM_CONFIG.seedAccount) return [MIM_CONFIG.seedAccount];
    return stored;
  }
  catch { return []; }
}

function saveAccounts(accounts) {
  localStorage.setItem("mim_accounts", JSON.stringify(accounts));
}

function getSession() {
  try { return JSON.parse(localStorage.getItem("mim_session") || "null"); }
  catch { return null; }
}

function setSession(session) {
  localStorage.setItem("mim_session", JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem("mim_session");
}

function formatPhone(value) {
  let number = String(value || "").replace(/\D/g, "");
  if (number.startsWith("0")) number = "62" + number.slice(1);
  return number;
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function showAlert(message, type = "error") {
  const alertBox = document.querySelector("[data-alert]");
  if (!alertBox) return;
  alertBox.textContent = message;
  alertBox.className = `alert show ${type}`;
}

function toggleMenu() {
  document.querySelector(".nav-links")?.classList.toggle("open");
}

function togglePassword(button) {
  const input = button.parentElement.querySelector("input");
  input.type = input.type === "password" ? "text" : "password";
  button.innerHTML = input.type === "password" ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>';
}

function login(event) {
  event.preventDefault();
  const email = document.querySelector("#email").value.trim().toLowerCase();
  const password = document.querySelector("#password").value;

  if (email === MIM_CONFIG.ownerEmail && password === MIM_CONFIG.ownerPassword) {
    setSession({ studio: MIM_CONFIG.studio, email, whatsapp: MIM_CONFIG.whatsapp, paid: true, role: "owner" });
    location.href = "dashboard.html";
    return;
  }

  const account = getAccounts().find(item => item.email.toLowerCase() === email && item.password === password);
  if (!account) return showAlert("Email atau password belum cocok. Periksa kembali data akunmu.");
  setSession({ ...account, role: "member" });
  location.href = "dashboard.html";
}

function registerAccount(event) {
  event.preventDefault();
  const studio = document.querySelector("#studio").value.trim();
  const email = document.querySelector("#email").value.trim().toLowerCase();
  const whatsapp = formatPhone(document.querySelector("#whatsapp").value);
  const password = document.querySelector("#password").value;
  const confirm = document.querySelector("#confirmPassword").value;
  if (!studio || !email || !whatsapp || !password) return showAlert("Semua kolom wajib diisi.");
  if (password.length < 8) return showAlert("Password minimal 8 karakter.");
  if (password !== confirm) return showAlert("Konfirmasi password belum sama.");

  const accounts = getAccounts();
  if (accounts.some(item => item.email.toLowerCase() === email)) return showAlert("Email ini sudah pernah didaftarkan.");
  const account = { studio, email, whatsapp, password, paid: false, createdAt: new Date().toISOString() };
  accounts.push(account);
  saveAccounts(accounts);
  setSession({ ...account, role: "member" });
  showAlert("Akun berhasil dibuat. Paket website sedang disiapkan…", "success");
  setTimeout(() => downloadStudioPackage(account), 350);
  setTimeout(() => { location.href = "dashboard.html"; }, 1600);
}

async function downloadStudioPackage(account) {
  if (typeof JSZip === "undefined") return;
  const zip = new JSZip();
  const files = ["index.html", "select.html", "login.html", "daftar.html", "dashboard.html", "demo.html", "sorter.html", "generator-link.html", "styles.css", "studio-theme.css", "studio-theme.js", "app.js", "pengaturan.js", "vercel.json", "README.md"];
  const assetFiles = [...Array.from({ length: 12 }, (_, index) => `assets/portfolio-${String(index + 1).padStart(2, "0")}.jpg`), "assets/logo.png", "assets/favicon.png"];
  const lockedPage = title => `<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — Menunggu Aktivasi</title><script>location.replace('dashboard.html?payment=required')<\/script></html>`;
  await Promise.all(files.map(async file => {
    try {
      let content = await fetch(file).then(response => response.text());
      if (["sorter.html", "generator-link.html"].includes(file)) {
        content = lockedPage(file === "sorter.html" ? "Auto RAW Sorter" : "Generator Link");
      } else if (file === "pengaturan.js") {
        content = content.replace('namaVendor: "MiM Shootography"', `namaVendor: ${JSON.stringify(account.studio)}`)
          .replace('whatsappAdmin: "6285156939177"', `whatsappAdmin: ${JSON.stringify(account.whatsapp)}`);
      } else if (file === "app.js") {
        content = content.replace('studio: "MiM Shootography"', `studio: ${JSON.stringify(account.studio)}`)
          .replace('whatsapp: "6285156939177"', `whatsapp: ${JSON.stringify(account.whatsapp)}`)
          .replace('email: "almuqrimultimedia@gmail.com"', `email: ${JSON.stringify(account.email)}`)
          .replace('seedAccount: null', `seedAccount: ${JSON.stringify(account)}`);
      } else {
        content = content.replaceAll("MiM Shootography", account.studio)
          .replaceAll("almuqrimultimedia@gmail.com", account.email)
          .replaceAll("6285156939177", account.whatsapp);
      }
      zip.file(file, content);
    } catch (error) { console.warn(`Tidak dapat memasukkan ${file}`, error); }
  }));
  await Promise.all(assetFiles.map(async file => {
    try { zip.file(file, await fetch(file).then(response => response.blob())); }
    catch (error) { console.warn(`Tidak dapat memasukkan ${file}`, error); }
  }));
  const blob = await zip.generateAsync({ type: "blob" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${account.studio.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-website.zip`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function initDashboard() {
  const isLocalPreview = ["localhost", "127.0.0.1"].includes(location.hostname) && new URLSearchParams(location.search).has("preview");
  const session = getSession() || (isLocalPreview ? { studio: MIM_CONFIG.studio, email: MIM_CONFIG.email, whatsapp: MIM_CONFIG.whatsapp, paid: true, role: "preview" } : null);
  if (!session) { location.replace("login.html"); return; }
  document.querySelectorAll("[data-studio]").forEach(el => el.textContent = session.studio);
  document.querySelectorAll("[data-user-email]").forEach(el => el.textContent = session.email);
  const initials = session.studio.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
  document.querySelectorAll("[data-initials]").forEach(el => el.textContent = initials);
  const badge = document.querySelector("[data-status]");
  if (badge) {
    badge.textContent = session.paid ? "Akses aktif" : "Menunggu pembayaran";
    if (session.paid) badge.classList.add("active");
  }
  document.querySelectorAll("[data-protected]").forEach(link => {
    if (!session.paid) {
      link.classList.add("locked");
      link.addEventListener("click", event => { event.preventDefault(); openPaywall(); });
    }
  });
  if (session.paid) {
    document.querySelectorAll("[data-lock-icon]").forEach(icon => {
      icon.className = "fa-solid fa-arrow-up-right-from-square muted";
    });
  }
}

function requirePaidPage() {
  const isLocalPreview = ["localhost", "127.0.0.1"].includes(location.hostname) && new URLSearchParams(location.search).has("preview");
  if (isLocalPreview) return;
  const session = getSession();
  if (!session) return location.replace("login.html");
  if (!session.paid) return location.replace("dashboard.html?payment=required");
}

function logout() {
  clearSession();
  location.href = "login.html";
}

function openPaywall() {
  document.querySelector("#paywallModal")?.classList.add("show");
}

function closePaywall() {
  document.querySelector("#paywallModal")?.classList.remove("show");
}

function paymentWhatsapp() {
  const session = getSession() || {};
  const text = `Halo MiM Shootography, saya ${session.studio || "pengguna demo"} (${session.email || "-"}) ingin mengaktifkan aplikasi Sorter & Generator Link. Saya akan mengirim bukti transfer Rp100.000.`;
  window.open(`https://wa.me/${MIM_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
}

document.addEventListener("click", event => {
  if (event.target.classList.contains("modal-backdrop")) closePaywall();
});
