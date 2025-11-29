// Background loading
const bgImage = document.getElementById('bgImage');
const loadingOverlay = document.getElementById('loadingOverlay');

bgImage.addEventListener('load', () => {
    bgImage.classList.add('loaded');
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
    }, 300);
});

// If image is already cached
if (bgImage.complete) {
    bgImage.classList.add('loaded');
    loadingOverlay.classList.add('hidden');
}

// Form handling
const form = document.getElementById('nikForm');
const nikInput = document.getElementById('nikInput');
const parseBtn = document.getElementById('parseBtn');
const result = document.getElementById('result');
const errorMsg = document.getElementById('errorMsg');

nikInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nik = nikInput.value.trim();
    
    if (nik.length !== 16) {
        showError('NIK harus 16 digit!');
        return;
    }

    hideError();
    result.classList.remove('show');
    parseBtn.disabled = true;

    try {
        const response = await fetch(`/.netlify/functions/parse-nik?nik=${nik}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Gagal parsing NIK');
        }

        displayResult(data.result);
    } catch (error) {
        showError(error.message || 'Terjadi kesalahan saat parsing NIK');
    } finally {
        parseBtn.disabled = false;
    }
});

function displayResult(data) {
    document.getElementById('nikDisplay').textContent = data.nik;

    const personalInfo = [
        { 
            label: 'Jenis Kelamin', 
            value: data.kelamin,
            icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M20 21a8 8 0 1 0-16 0" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
        },
        { 
            label: 'Tanggal Lahir', 
            value: data.lahir_lengkap,
            icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/></svg>'
        }
    ];

    document.getElementById('personalInfo').innerHTML = personalInfo.map(item => `
        <div class="personal-item">
            ${item.icon}
            <div class="personal-label">${item.label}</div>
            <div class="personal-value">${item.value}</div>
        </div>
    `).join('');

    const locationItems = [
        { 
            label: 'Provinsi', 
            value: data.provinsi.nama,
            code: `Kode: ${data.provinsi.kode}`
        },
        { 
            label: data.kotakab.jenis, 
            value: data.kotakab.nama,
            code: `Kode: ${data.kotakab.kode}`
        },
        { 
            label: 'Kecamatan', 
            value: data.kecamatan.nama,
            code: `Kode: ${data.kecamatan.kode}`
        }
    ];

    document.getElementById('locationInfo').innerHTML = locationItems.map(item => `
        <div class="location-item">
            <div class="location-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
            </div>
            <div class="location-info">
                <div class="location-label">${item.label}</div>
                <div class="location-value">${item.value}</div>
                <div class="location-label" style="margin-top: 4px; opacity: 0.7;">${item.code}</div>
            </div>
        </div>
    `).join('');

    const additionalItems = [
        { 
            label: 'Usia', 
            value: data.tambahan.usia,
            icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
        },
        { 
            label: 'Kategori', 
            value: data.tambahan.kategori_usia,
            icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
        },
        { 
            label: 'Zodiak', 
            value: data.tambahan.zodiak,
            icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
        },
        { 
            label: 'Ulang Tahun', 
            value: data.tambahan.ultah,
            icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/></svg>'
        }
    ];

    document.getElementById('additionalInfo').innerHTML = additionalItems.map(item => `
        <div class="additional-item">
            ${item.icon}
            <div class="additional-label">${item.label}</div>
            <div class="additional-value">${item.value}</div>
        </div>
    `).join('');

    result.classList.add('show');
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
    setTimeout(() => {
        errorMsg.classList.remove('show');
    }, 5000);
}

function hideError() {
    errorMsg.classList.remove('show');
}