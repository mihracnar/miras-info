// Admin panel trigger - ana HTML'e eklenecek
// Basitleştirilmiş versiyon - direkt panel açılır

// Gizli admin aktivasyonu - İBB Miras logosuna 5 kez tıklama
let clickCount = 0;
let clickTimeout = null;

// Sayfa yüklendikten sonra logo elementini bul ve event listener ekle
function initializeLogoClick() {
    // Farklı selector yöntemleri deneyelim
    let logo = null;
    
    // 1. href ile bul
    logo = document.querySelector('image[href*="ibb-miras-logo"]');
    if (!logo) {
        // 2. xlink:href ile bul
        logo = document.querySelector('image[xlink\\:href*="ibb-miras-logo"]');
    }
    if (!logo) {
        // 3. Tüm image elementlerini kontrol et
        const images = document.querySelectorAll('image');
        for (let img of images) {
            const href = img.getAttribute('xlink:href') || img.getAttribute('href');
            if (href && href.includes('ibb-miras-logo')) {
                logo = img;
                break;
            }
        }
    }
    
    console.log('Logo arama sonucu:', logo);
    
    if (logo) {
        console.log('✅ İBB Miras logosu bulundu, admin tetikleyici aktif');
        
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            clickCount++;
            
            console.log(`🎯 Logo tıklama: ${clickCount}/5`);
            
            // Görsel geri bildirim
            logo.style.filter = 'drop-shadow(0 0 10px #FECE07)';
            setTimeout(() => {
                logo.style.filter = '';
            }, 200);
            
            if (clickCount >= 5) {
                // Admin panelini direkt aç
                console.log('🎉 Admin paneli açılıyor...');
                window.open('admin.html', 'adminPanel', 'width=900,height=700,scrollbars=yes,resizable=yes');
                
                // Başarı efekti
                logo.style.filter = 'drop-shadow(0 0 20px #27ae60)';
                setTimeout(() => {
                    logo.style.filter = '';
                }, 1000);
                
                // Sayacı sıfırla
                clickCount = 0;
                
                if (clickTimeout) {
                    clearTimeout(clickTimeout);
                    clickTimeout = null;
                }
            } else {
                // 3 saniye timeout
                if (clickTimeout) clearTimeout(clickTimeout);
                clickTimeout = setTimeout(() => {
                    console.log('⏰ Timeout - sayaç sıfırlandı');
                    clickCount = 0;
                }, 3000);
            }
        });
        
        // Logo'ya stil ekle
        logo.style.cursor = 'pointer';
        
    } else {
        console.log('❌ İBB Miras logosu bulunamadı - tüm image elementleri:');
        const allImages = document.querySelectorAll('image');
        allImages.forEach((img, index) => {
            const href = img.getAttribute('xlink:href') || img.getAttribute('href');
            console.log(`Image ${index}:`, href);
        });
    }
}

// Klavye kısayolu ile admin paneli açma (Ctrl+Shift+A)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        window.open('admin.html', 'adminPanel', 'width=900,height=700,scrollbars=yes,resizable=yes');
        console.log('Admin paneli klavye kısayolu ile açıldı');
    }
});

// URL parametresi ile admin paneli açma (?admin=true)
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
        window.open('admin.html', 'adminPanel', 'width=900,height=700,scrollbars=yes,resizable=yes');
        console.log('Admin paneli URL parametresi ile açıldı');
    }
    
    // Logo click event'ini başlat
    setTimeout(initializeLogoClick, 100); // SVG yüklenene kadar bekle
});

// Console'dan admin paneli açma
window.openAdmin = function() {
    window.open('admin.html', 'adminPanel', 'width=900,height=700,scrollbars=yes,resizable=yes');
    console.log('Admin paneli console komutu ile açıldı');
};

// Debug: Logo elementini kontrol etme fonksiyonu
window.checkLogo = function() {
    const logo = document.querySelector('image[xlink\\:href*="ibb-miras-logo"]');
    if (logo) {
        console.log('✅ İBB Miras logosu bulundu:', logo);
        return logo;
    } else {
        console.log('❌ İBB Miras logosu bulunamadı');
        return null;
    }
};

console.log('🔐 Admin tetikleyiciler yüklendi. Aktivasyon yöntemleri:');
console.log('1. 🎯 İBB Miras logosuna 5 kez tıklayın (3 saniye içinde)');
console.log('2. ⌨️  Ctrl+Shift+A tuşlarına basın');
console.log('3. 🌐 URL\'ye ?admin=true ekleyin');
console.log('4. 🖥️  Console\'da openAdmin() yazın');
console.log('5. 🔍 checkLogo() ile logo elementini kontrol edin');