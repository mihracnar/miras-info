// Veri objesi
const data = {
    endustri: {
        count: 7,
        texts: ["Endüstri", "Miras", "Yapısı"]
    },
    anit: {
        count: 63,
        texts: ["Anıt", "Eser"]
    },
    turbe: {
        count: 19,
        texts: ["Tarihi", "Türbe"]
    },
    muze: {
        count: 36,
        texts: ["Müze ve", "Sergi Mekanı"]
    },
    kamusal: {
        count: 40,
        texts: ["Kamusal", "Sanat Eseri"]
    },
    arkeopark: {
        count: 4,
        texts: ["Arkeopark"]
    },
    hazire: {
        count: 610,
        texts: ["Tarihi", "Hazire ve", "Mezar"]
    },
    sarnic: {
        count: 6,
        texts: ["Sarnıç ve", "Maksem"]
    },
    cesme: {
        count: 215,
        texts: ["Tarihi", "Çeşme"]
    },
    circle: {
        ilce: 28,
        rota: 42,
        nokta: 1348,
        description: "ayrı noktalarda İstanbul'un kültür varlıklarında rutin koruma çalışmaları yapıyoruz."
    }
};

// Verileri güncelleme fonksiyonu
function updateData(newData) {
    // Ana kategoriler
    Object.keys(newData).forEach(key => {
        if (key === 'circle') {
            // Dairesel veriler - tek bir metin olarak güncelle
            const descElement = document.getElementById('circle-description');
            if (descElement && newData.circle) {
                const { ilce, rota, nokta, description } = newData.circle;
                descElement.textContent = `${ilce} ilçede, ${rota} rotada ve ${nokta} ${description}`;
            }
        } else {
            // Diğer kategoriler
            const category = newData[key];
            if (category) {
                // Sayıyı güncelle
                const countElement = document.getElementById(`${key}-count`);
                if (countElement) {
                    countElement.textContent = category.count;
                }
                
                // Metinleri güncelle
                category.texts.forEach((text, index) => {
                    const textElement = document.getElementById(`${key}-text${index + 1}`);
                    if (textElement) {
                        textElement.textContent = text;
                    }
                });
            }
        }
    });
}

// Tüm verileri yeniden yükleme fonksiyonu
function reloadData() {
    updateData(data);
}

// API'den veri çekme fonksiyonu
async function fetchDataFromAPI(apiUrl = '/api/heritage-data') {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiData = await response.json();
        updateData(apiData);
        console.log('Veri başarıyla API\'den güncellendi');
        return apiData;
    } catch (error) {
        console.error('API\'den veri çekme hatası:', error);
        // Hata durumunda varsayılan verileri yükle
        reloadData();
        return null;
    }
}

// JSON dosyasından veri çekme fonksiyonu
async function loadDataFromJSON(jsonPath = 'data.json') {
    try {
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        updateData(jsonData);
        console.log('Veri başarıyla JSON dosyasından yüklendi');
        return jsonData;
    } catch (error) {
        console.error('JSON dosyasından veri yükleme hatası:', error);
        // Hata durumunda varsayılan verileri yükle
        reloadData();
        return null;
    }
}

// Manuel veri güncelleme fonksiyonu (test için)
function updateManualData() {
    const newData = {
        endustri: { count: 10, texts: ["Yeni", "Endüstri", "Miras"] },
        anit: { count: 75, texts: ["Anıt", "Yapılar"] },
        turbe: { count: 25, texts: ["Tarihi", "Türbe"] },
        muze: { count: 45, texts: ["Müze ve", "Sergi Alanı"] },
        kamusal: { count: 50, texts: ["Kamusal", "Sanat Eseri"] },
        arkeopark: { count: 8, texts: ["Arkeopark"] },
        hazire: { count: 700, texts: ["Tarihi", "Hazire ve", "Mezar"] },
        sarnic: { count: 12, texts: ["Sarnıç ve", "Maksem"] },
        cesme: { count: 250, texts: ["Tarihi", "Çeşme"] },
        circle: { 
            ilce: 35, 
            rota: 50, 
            nokta: 1500, 
            description: "ayrı noktalarda İstanbul'un kültür varlıklarında rutin koruma çalışmaları yapıyoruz." 
        }
    };
    updateData(newData);
    console.log('Test verileri yüklendi');
}

// Belirli bir kategorinin verisini güncelleme
function updateCategory(categoryName, newCategoryData) {
    const updateObject = {};
    updateObject[categoryName] = newCategoryData;
    updateData(updateObject);
    console.log(`${categoryName} kategorisi güncellendi`);
}

// Belirli bir kategorinin sayısını güncelleme
function updateCount(categoryName, newCount) {
    const countElement = document.getElementById(`${categoryName}-count`);
    if (countElement) {
        countElement.textContent = newCount;
        console.log(`${categoryName} sayısı ${newCount} olarak güncellendi`);
    } else {
        console.error(`${categoryName} kategorisi bulunamadı`);
    }
}

// Dairesel metin animasyonunu kontrol etme
function toggleRotation() {
    const rotatingText = document.querySelector('animateTransform');
    if (rotatingText) {
        if (rotatingText.getAttribute('dur') === '0s') {
            rotatingText.setAttribute('dur', '25s');
            console.log('Dairesel metin animasyonu başlatıldı');
        } else {
            rotatingText.setAttribute('dur', '0s');
            console.log('Dairesel metin animasyonu durduruldu');
        }
    }
}

// Animasyon hızını değiştirme
function changeRotationSpeed(seconds = 25) {
    const rotatingText = document.querySelector('animateTransform');
    if (rotatingText) {
        rotatingText.setAttribute('dur', `${seconds}s`);
        console.log(`Animasyon hızı ${seconds} saniye olarak ayarlandı`);
    }
}

// Otomatik veri güncelleme (belirli aralıklarla)
function startAutoUpdate(intervalMinutes = 5) {
    const intervalMs = intervalMinutes * 60 * 1000;
    return setInterval(() => {
        console.log('Otomatik veri güncelleme başlatılıyor...');
        fetchDataFromAPI();
    }, intervalMs);
}

// Otomatik güncellemeyi durdurma
function stopAutoUpdate(intervalId) {
    if (intervalId) {
        clearInterval(intervalId);
        console.log('Otomatik güncelleme durduruldu');
    }
}

// Hover efektlerini geçici olarak devre dışı bırakma
function disableHoverEffects() {
    const style = document.createElement('style');
    style.innerHTML = `
        image:hover, text:hover, g:hover image, g:hover text {
            transform: none !important;
            filter: none !important;
            animation: none !important;
        }
    `;
    style.id = 'disable-hover';
    document.head.appendChild(style);
    console.log('Hover efektleri devre dışı bırakıldı');
}

// Hover efektlerini yeniden etkinleştirme
function enableHoverEffects() {
    const style = document.getElementById('disable-hover');
    if (style) {
        style.remove();
        console.log('Hover efektleri yeniden etkinleştirildi');
    }
}

// Tüm kategorilerin verilerini toplu güncelleme
function updateAllCategories(newCounts) {
    Object.keys(newCounts).forEach(category => {
        if (data[category]) {
            data[category].count = newCounts[category];
            updateCount(category, newCounts[category]);
        }
    });
    console.log('Tüm kategoriler güncellendi:', newCounts);
}

// Sayfa yüklendiğinde verileri güncelle
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sayfa yüklendi, veriler güncelleniyor...');
    reloadData();
    
    // Eğer data.json dosyası varsa oradan yükle
    loadDataFromJSON().catch(() => {
        console.log('data.json bulunamadı, varsayılan veriler kullanılıyor');
    });
});

// Global erişim için window objesine fonksiyonları ekle
window.updateData = updateData;
window.reloadData = reloadData;
window.fetchDataFromAPI = fetchDataFromAPI;
window.loadDataFromJSON = loadDataFromJSON;
window.updateManualData = updateManualData;
window.updateCategory = updateCategory;
window.updateCount = updateCount;
window.toggleRotation = toggleRotation;
window.changeRotationSpeed = changeRotationSpeed;
window.startAutoUpdate = startAutoUpdate;
window.stopAutoUpdate = stopAutoUpdate;
window.disableHoverEffects = disableHoverEffects;
window.enableHoverEffects = enableHoverEffects;
window.updateAllCategories = updateAllCategories;

// Veri yapısını dışa aktar
window.heritageData = data;
// Sayma animasyonu fonksiyonu
function animateNumbers() {
    // Tüm sayıları animate et
    Object.keys(data).forEach(key => {
        if (key !== 'circle' && data[key].count) {
            const element = document.getElementById(`${key}-count`);
            if (element) {
                // Başlangıçta 0 yap
                element.textContent = '0';
                // GSAP ile animate et
                gsap.to(element, {
                    textContent: data[key].count,
                    duration: 5,
                    delay: Math.random() * 0.5, // Random gecikme
                    snap: { textContent: 1 },
                    ease: "power2.out"
                });
            }
        }
    });
}

// DOMContentLoaded event listener'ını güncelle
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sayfa yüklendi, veriler güncelleniyor...');
    reloadData();
    
    // 500ms gecikme ile animasyonu başlat
    setTimeout(() => {
        animateNumbers();
    }, 1000);
    
    loadDataFromJSON().catch(() => {
        console.log('data.json bulunamadı, varsayılan veriler kullanılıyor');
    });
});