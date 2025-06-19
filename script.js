// Supabase Configuration
const SUPABASE_URL = 'https://nitcvhzbnpvgbzaiesqx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdGN2aHpibnB2Z2J6YWllc3F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjg3NzIsImV4cCI6MjA2NTkwNDc3Mn0.3W2DWBuIxHWno1MSsJEwEpK8uAnbKuHIdIJv-K7n-qg';

// Global veri objesi - SADECE Supabase'den gelecek
let data = null;

// Animasyon durumu takibi
let isAnimating = false;
let animationInterval = null;
let realtimeInterval = null;

// Supabase'den veri yükleme fonksiyonu - TEK KAYNAK
async function loadFromSupabase(triggerAnimation = true) {
    try {
        console.log('Supabase\'den veri yükleniyor...');
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/heritage_data?id=eq.1`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const dataArray = await response.json();
        if (dataArray.length === 0) {
            throw new Error('Supabase\'de veri bulunamadı');
        }
        
        const heritageData = dataArray[0];
        
        // Global data objesini Supabase verisiyle güncelle
        data = {
            endustri: {
                count: heritageData.endustri,
                texts: ["Endüstri", "Miras", "Yapısı"]
            },
            anit: {
                count: heritageData.anit,
                texts: ["Anıt", "Eser"]
            },
            turbe: {
                count: heritageData.turbe,
                texts: ["Tarihi", "Türbe"]
            },
            muze: {
                count: heritageData.muze,
                texts: ["Müze ve", "Sergi Mekanı"]
            },
            kamusal: {
                count: heritageData.kamusal,
                texts: ["Kamusal", "Sanat Eseri"]
            },
            arkeopark: {
                count: heritageData.arkeopark,
                texts: ["Arkeopark"]
            },
            hazire: {
                count: heritageData.hazire,
                texts: ["Tarihi", "Hazire ve", "Mezar"]
            },
            sarnic: {
                count: heritageData.sarnic,
                texts: ["Sarnıç ve", "Maksem"]
            },
            cesme: {
                count: heritageData.cesme,
                texts: ["Tarihi", "Çeşme"]
            },
            circle: {
                ilce: heritageData.ilce,
                rota: heritageData.rota,
                nokta: heritageData.nokta,
                description: "ayrı noktalarda İstanbul'un kültür varlıklarında rutin koruma çalışmaları yapıyoruz."
            }
        };
        
        // DOM'u güncelle
        updateDOM();
        
        // Animasyonu tetikle
        if (triggerAnimation && !isAnimating) {
            setTimeout(() => {
                animateNumbers('data-update');
            }, 300);
        }
        
        console.log('✅ Veriler Supabase\'den başarıyla yüklendi:', heritageData);
        return data;
        
    } catch (error) {
        console.error('❌ Supabase load error:', error);
        
        // Fallback default data - sadece hata durumunda
        if (!data) {
            data = {
                endustri: { count: 7, texts: ["Endüstri", "Miras", "Yapısı"] },
                anit: { count: 63, texts: ["Anıt", "Eser"] },
                turbe: { count: 19, texts: ["Tarihi", "Türbe"] },
                muze: { count: 36, texts: ["Müze ve", "Sergi Mekanı"] },
                kamusal: { count: 40, texts: ["Kamusal", "Sanat Eseri"] },
                arkeopark: { count: 4, texts: ["Arkeopark"] },
                hazire: { count: 610, texts: ["Tarihi", "Hazire ve", "Mezar"] },
                sarnic: { count: 6, texts: ["Sarnıç ve", "Maksem"] },
                cesme: { count: 215, texts: ["Tarihi", "Çeşme"] },
                circle: { 
                    ilce: 28, rota: 42, nokta: 1348,
                    description: "ayrı noktalarda İstanbul'un kültür varlıklarında rutin koruma çalışmaları yapıyoruz."
                }
            };
            updateDOM();
            console.log('⚠️ Fallback veriler kullanılıyor');
        }
        return false;
    }
}

// DOM güncelleme fonksiyonu
function updateDOM() {
    if (!data) return;
    
    // Sayıları güncelle
    Object.keys(data).forEach(key => {
        if (key === 'circle') {
            // Dairesel metin güncelle - bold sayılarla
            const descElement = document.getElementById('circle-description');
            if (descElement && data.circle) {
                const { ilce, rota, nokta, description } = data.circle;
                descElement.innerHTML = `<tspan font-weight="bold">${ilce}</tspan> ilçede, <tspan font-weight="bold">${rota}</tspan> rotada ve <tspan font-weight="bold">${nokta}</tspan> ${description}`;
            }
        } else {
            const category = data[key];
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

// Admin panelinden güncelleme geldiğinde çağrılacak
function updateData(newData) {
    console.log('Admin panelinden güncelleme alındı:', newData);
    
    // Global data objesini güncelle
    Object.keys(newData).forEach(key => {
        if (data && data[key]) {
            if (key === 'circle') {
                data.circle = { ...data.circle, ...newData.circle };
            } else {
                data[key].count = newData[key].count;
                // Metinler değişmiyorsa mevcut metinleri koru
                if (newData[key].texts) {
                    data[key].texts = newData[key].texts;
                }
            }
        }
    });
    
    // DOM'u güncelle
    updateDOM();
}

// Gelişmiş sayma animasyonu fonksiyonu
function animateNumbers(triggerSource = 'manual') {
    if (isAnimating || !data) return;
    
    isAnimating = true;
    console.log(`Sayma animasyonu başlatıldı (${triggerSource})`);
    
    // Tüm sayıları animate et
    Object.keys(data).forEach((key, index) => {
        if (key !== 'circle' && data[key].count) {
            const element = document.getElementById(`${key}-count`);
            if (element) {
                const finalValue = data[key].count;
                
                // Başlangıçta 0 yap
                element.textContent = '0';
                
                // GSAP ile animate et
                gsap.to(element, {
                    textContent: finalValue,
                    duration: 2.5 + (Math.random() * 1),
                    delay: index * 0.1,
                    snap: { textContent: 1 },
                    ease: "power2.out",
                    onUpdate: function() {
                        if (Math.random() > 0.8) {
                            element.style.color = '#FF6B35';
                            setTimeout(() => {
                                element.style.color = '#22201c';
                            }, 100);
                        }
                    },
                    onComplete: function() {
                        if (index === Object.keys(data).length - 2) {
                            isAnimating = false;
                            console.log('Sayma animasyonu tamamlandı');
                            
                            gsap.to('[font-size="40"]', {
                                scale: 1.09,
                                duration: 0.3,
                                ease: "power2.out",
                                yoyo: true,
                                repeat: 1
                            });
                        }
                    }
                });
            }
        }
    });
}

// Periyodik animasyon
function startPeriodicAnimation(intervalMinutes = 3) {
    if (animationInterval) {
        clearInterval(animationInterval);
    }
    
    const intervalMs = intervalMinutes * 60 * 1000;
    
    animationInterval = setInterval(() => {
        if (!document.hidden && !isAnimating && data) {
            console.log(`Periyodik animasyon (${intervalMinutes} dakika interval)`);
            animateNumbers('periodic');
        }
    }, intervalMs);
    
    console.log(`Periyodik animasyon ${intervalMinutes} dakika arayla başlatıldı`);
}

function stopPeriodicAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
        console.log('Periyodik animasyon durduruldu');
    }
}

// Real-time veri kontrolü
function startRealtimeListener() {
    if (realtimeInterval) {
        clearInterval(realtimeInterval);
    }
    
    realtimeInterval = setInterval(async () => {
        if (!document.hidden) {
            const currentDataString = JSON.stringify(data);
            const updated = await loadFromSupabase(false);
            
            // Veri değişmişse animasyon tetikle
            if (updated && JSON.stringify(data) !== currentDataString) {
                console.log('Real-time veri güncellemesi tespit edildi');
                setTimeout(() => {
                    animateNumbers('realtime-update');
                }, 500);
            }
        }
    }, 15000); // 15 saniyede bir kontrol
    
    console.log('Real-time listener başlatıldı (15s interval)');
}

function stopRealtimeListener() {
    if (realtimeInterval) {
        clearInterval(realtimeInterval);
        realtimeInterval = null;
        console.log('Real-time listener durduruldu');
    }
}

// Sayfa görünürlük kontrolü
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopPeriodicAnimation();
        stopRealtimeListener();
    } else {
        // Sayfa geri geldiğinde fresh data çek
        setTimeout(async () => {
            await loadFromSupabase(true);
            startPeriodicAnimation(3);
            startRealtimeListener();
        }, 1000);
    }
});

// Ana başlatma fonksiyonu
async function initializeApp() {
    console.log('🚀 Uygulama başlatılıyor...');
    
    try {
        // İlk veri yükleme
        await loadFromSupabase(false);
        
        // İlk animasyonu başlat
        setTimeout(() => {
            animateNumbers('initial-load');
        }, 1000);
        
        // Periyodik sistemleri başlat
        setTimeout(() => {
            startPeriodicAnimation(3); // 3 dakika
            startRealtimeListener();   // 15 saniye
        }, 4000);
        
        console.log('✅ Uygulama başarıyla başlatıldı');
        
    } catch (error) {
        console.error('❌ Uygulama başlatma hatası:', error);
    }
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', initializeApp);

// Global erişim için window objesine fonksiyonları ekle
window.updateData = updateData;
window.loadFromSupabase = loadFromSupabase;
window.animateNumbers = animateNumbers;
window.startPeriodicAnimation = startPeriodicAnimation;
window.stopPeriodicAnimation = stopPeriodicAnimation;
window.startRealtimeListener = startRealtimeListener;
window.stopRealtimeListener = stopRealtimeListener;

// Debug için data objesi
Object.defineProperty(window, 'heritageData', {
    get: function() { return data; }
});

// Debug komutları
console.log('🎯 Veri Kontrolleri:');
console.log('- loadFromSupabase() : Supabase\'den veri yükle');
console.log('- animateNumbers() : Manuel animasyon başlat');
console.log('- startPeriodicAnimation(dakika) : Periyodik animasyon');
console.log('- startRealtimeListener() : Real-time dinlemeyi başlat');
console.log('- heritageData : Mevcut veri objesi');