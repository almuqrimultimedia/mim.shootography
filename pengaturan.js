// =========================================================================
// PENGATURAN APLIKASI CLIENT PORTAL
// Silakan ubah teks di dalam tanda kutip ("...") dengan data studio Anda.
// =========================================================================

const CONFIG_APP = {
    // 1. Nama Studio Foto Anda (Akan tampil di header dan portal klien)
    namaVendor: "MiM Shootography",

    // 2. Google Drive API Key (Penting agar galeri bisa memuat foto)
    googleApiKey: "AIzaSyA7pfFomlBu7CVtnYHy6cTCHsHOTEM0av8",
    
    // 3. Nomor WA Admin
    whatsappAdmin: "6285156939177", 

    // 4. PENGATURAN LOGIN ADMIN (Silakan ubah username dan password di sini)
    adminUsername: "admin",
    adminPassword: "admin123"
};

// =========================================================================
// SISTEM PROTEKSI & LOGIKA LOGIN ADMIN
// =========================================================================

// 1. Fungsi Cek Login Otomatis
// Skrip ini akan berjalan otomatis setiap file JS ini dimuat.
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    // Cek apakah URL saat ini adalah halaman login
    const isLoginPage = window.location.pathname.includes('login.html');

    // Jika belum login DAN sedang tidak berada di halaman login -> Lempar ke login
    if (isLoggedIn !== 'true' && !isLoginPage) {
        window.location.href = 'login.html';
    } 
    // Jika sudah login TAPI malah membuka halaman login -> Lempar ke index
    else if (isLoggedIn === 'true' && isLoginPage) {
        window.location.href = 'index.html';
    }
}

// Jalankan fungsi cek login saat script dimuat
checkAuth();

// 2. Fungsi Proses Login (Dipanggil dari form di login.html)
function handleLogin(event) {
    event.preventDefault(); // Mencegah halaman reload saat form disubmit

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMessage');

    if (user === CONFIG_APP.adminUsername && pass === CONFIG_APP.adminPassword) {
        // Jika benar, simpan sesi dan pindah ke halaman utama
        localStorage.setItem('isAdminLoggedIn', 'true');
        window.location.href = 'index.html';
    } else {
        // Jika salah, munculkan pesan error
        errorMsg.classList.remove('hidden');
    }
}

// 3. Fungsi Logout (Dipanggil dari tombol logout di index.html)
function handleLogout() {
    localStorage.removeItem('isAdminLoggedIn');
    window.location.href = 'login.html';
}
