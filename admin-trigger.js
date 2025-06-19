// Admin panel trigger - ana HTML'e eklenecek

// Gizli admin butonu oluştur
function createAdminButton() {
    const adminBtn = document.createElement('button');
    adminBtn.innerHTML = '⚙️';
    adminBtn.id = 'admin-trigger';
    adminBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background: rgba(0,0,0,0.1);
        color: #333;
        font-size: 18px;
        cursor: pointer;
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    // Admin butonu için hover efekti
    adminBtn.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(254, 206, 7, 0.8)';
        this.style.transform = 'scale(1.1)';
    });
    
    adminBtn.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(0,0,0,0.1)';
        this.style.transform = 'scale(1)';
    });
    
    // Admin panelini aç
    adminBtn.addEventListener('click', function() {
        window.open('admin.html', 'adminPanel', 'width=900,height=700,scrollbars=yes,resizable=yes');
    });
    
    document.body.appendChild(adminBtn);
    return adminBtn;
}

// Gizli admin aktivasyonu - 5 kez sol üst köşeye tıklama
let clickCount = 0;
let adminBtn = null;

document.addEventListener('click', function(e) {
    // Sol üst köşe kontrolü (50x50 pixel alan)
    if (e.clientX <= 50 && e.clientY <= 50) {
        clickCount++;
        
        if (clickCount >= 5) {
            if (!adminBtn) {
                adminBtn = createAdminButton();
                setTimeout(() => {
                    adminBtn.style.opacity = '1';
                }, 100);
                console.log('Admin modu aktif!');
            }
            clickCount = 0;
        }
        
        // 3 saniye içinde 5 tıklama olmazsa sıfırla
        setTimeout(() => {
            if (clickCount > 0) {
                clickCount = 0;
            }
        }, 3000);
    }
});

// Alternatif: Klavye kısayolu ile admin paneli açma (Ctrl+Shift+A)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (!adminBtn) {
            adminBtn = createAdminButton();
            adminBtn.style.opacity = '1';
        }
        adminBtn.click(); // Admin panelini direkt aç
    }
});

// URL parametresi ile admin paneli açma (?admin=true)
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
        if (!adminBtn) {
            adminBtn = createAdminButton();
            adminBtn.style.opacity = '1';
        }
    }
});

// Console'dan admin paneli açma
window.openAdmin = function() {
    if (!adminBtn) {
        adminBtn = createAdminButton();
        adminBtn.style.opacity = '1';
    }
    adminBtn.click();
};

console.log('Admin tetikleyiciler yüklendi. Aktivasyon yöntemleri:');
console.log('1. Sol üst köşeye 5 kez tıklayın');
console.log('2. Ctrl+Shift+A tuşlarına basın');
console.log('3. URL\'ye ?admin=true ekleyin');
console.log('4. Console\'da openAdmin() yazın');