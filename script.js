// Supabase Configuration
const SUPABASE_URL = 'https://nitcvhzbnpvgbzaiesqx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdGN2aHpibnB2Z2J6YWllc3F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjg3NzIsImV4cCI6MjA2NTkwNDc3Mn0.3W2DWBuIxHWno1MSsJEwEpK8uAnbKuHIdIJv-K7n-qg';

// Cache ayarları
const CACHE_DURATION = 24 * 60 * 60 * 1000;  // 24 saat cache
const ANIMATION_INTERVAL = 5;                 // 5 dakikada bir animasyon
const REALTIME_CHECK_INTERVAL = 60;           // 60 dakikada bir veri kontrol

// Global veri objesi ve cache bilgileri
let data = null;
let lastDataFetch = null;
let lastDataHash = null;

// Animasyon durumu takibi
let isAnimating = false;
let animationInterval = null;
let realtimeInterval = null;

// Cache kontrollü Supabase veri yükleme fonksiyonu
async function loadFromSupabase(triggerAnimation = true, forceRefresh = false) {
    try {
        const now = Date.now();
        
        // Cache kontrolü - admin güncellemesi değilse cache kullan
        if (!forceRefresh && lastDataFetch && (now - lastDataFetch) < CACHE_DURATION) {
            console.log(`📦 Cache aktif - ${Math.round((CACHE_DURATION - (now - lastDataFetch)) / 1000 / 60)} dakika kaldı`);
            return data;
        }
        
        console.log('🔄 Supabase\'den fresh veri yükleniyor...');
        
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
        const newDataHash = JSON.stringify(heritageData);
        
        // Veri değişmiş mi kontrol et
        const dataChanged = lastDataHash !== newDataHash;
        
        // Global data objesini güncelle
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
        
        // Cache bilgilerini güncelle
        lastDataFetch = now;
        lastDataHash = newDataHash;
        
        // DOM'u güncelle
        updateDOM();
        
        // Sadece veri değişmişse animasyon tetikle
        if (triggerAnimation && !isAnimating && (dataChanged || forceRefresh)) {
            setTimeout(() => {
                animateNumbers(forceRefresh ? 'admin-update' : 'data-update');
            }, 300);
        }
        
        console.log('✅ Veriler Supabase\'den başarıyla yüklendi:', heritageData);
        if (dataChanged) console.log('🔄 Veri değişikliği tespit edildi');
        
        return data;
        
    } catch (error) {
        console.error('❌ Supabase load error:', error);
        
        // Fallback default data - sadece hata durumunda ve hiç veri yoksa
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

// Admin panelinden güncelleme geldiğinde çağrılacak - ANINDA GÜNCELLEME
function updateData(newData) {
    console.log('🔧 Admin panelinden güncelleme alındı:', newData);
    
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
    
    // Cache'i sıfırla - admin güncellemesi yapıldı
    lastDataFetch = Date.now();
    lastDataHash = JSON.stringify(data);
    
    // DOM'u güncelle
    updateDOM();
    
    // Admin güncellemesi animasyonu
    if (!isAnimating) {
        setTimeout(() => {
            animateNumbers('admin-panel-update');
        }, 200);
    }
}

// Gelişmiş sayma animasyonu fonksiyonu
function animateNumbers(triggerSource = 'manual') {
    if (isAnimating || !data) return;
    
    isAnimating = true;
    console.log(`🎬 Sayma animasyonu başlatıldı (${triggerSource})`);
    
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
                            console.log('✨ Sayma animasyonu tamamlandı');
                            
                            // Başarı efekti
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

// Sadece görsel animasyon - veri çekmeyen periyodik animasyon
function startVisualAnimation(intervalMinutes = 5) {
    if (animationInterval) {
        clearInterval(animationInterval);
    }
    
    const intervalMs = intervalMinutes * 60 * 1000;
    
    animationInterval = setInterval(() => {
        if (!document.hidden && !isAnimating && data) {
            console.log(`🎨 Görsel animasyon (${intervalMinutes} dakika interval)`);
            animateNumbers('visual-refresh');
        }
    }, intervalMs);
    
    console.log(`🎬 Görsel animasyon ${intervalMinutes} dakika arayla başlatıldı`);
}

function stopVisualAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
        console.log('⏸️ Görsel animasyon durduruldu');
    }
}

// Uzun aralıklı veri kontrol - sadece değişiklik varsa animasyon
function startRealtimeListener(intervalMinutes = 60) {
    if (realtimeInterval) {
        clearInterval(realtimeInterval);
    }
    
    const intervalMs = intervalMinutes * 60 * 1000;
    
    realtimeInterval = setInterval(async () => {
        if (!document.hidden) {
            console.log('🔍 Periyodik veri kontrol başlatıldı...');
            await loadFromSupabase(true, false); // Cache'i atla ama force refresh değil
        }
    }, intervalMs);
    
    console.log(`🔄 Veri kontrol ${intervalMinutes} dakika arayla başlatıldı`);
}

function stopRealtimeListener() {
    if (realtimeInterval) {
        clearInterval(realtimeInterval);
        realtimeInterval = null;
        console.log('⏸️ Veri kontrol durduruldu');
    }
}

// Sayfa görünürlük kontrolü
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopVisualAnimation();
        stopRealtimeListener();
        console.log('😴 Sayfa gizli - tüm işlemler durduruldu');
    } else {
        console.log('👁️ Sayfa tekrar görünür - sistemler yeniden başlatılıyor');
        // Sayfa geri geldiğinde sadece cache kontrol et
        setTimeout(async () => {
            await loadFromSupabase(true, false);
            startVisualAnimation(ANIMATION_INTERVAL);
            startRealtimeListener(REALTIME_CHECK_INTERVAL);
        }, 1000);
    }
});

// Ana başlatma fonksiyonu
async function initializeApp() {
    console.log('🚀 Uygulama başlatılıyor...');
    
    try {
        // İlk veri yükleme - fresh data
        await loadFromSupabase(false, true);
        
        // İlk animasyonu başlat
        setTimeout(() => {
            animateNumbers('initial-load');
        }, 1000);
        
        // Sistemleri başlat
        setTimeout(() => {
            startVisualAnimation(ANIMATION_INTERVAL);      // 5 dakika görsel
            startRealtimeListener(REALTIME_CHECK_INTERVAL); // 60 dakika veri kontrol
        }, 4000);
        
        console.log('✅ Uygulama başarıyla başlatıldı');
        console.log(`📦 Cache süresi: ${CACHE_DURATION / 1000 / 60 / 60} saat`);
        console.log(`🎬 Animasyon aralığı: ${ANIMATION_INTERVAL} dakika`);
        console.log(`🔄 Veri kontrol aralığı: ${REALTIME_CHECK_INTERVAL} dakika`);
        
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
window.startVisualAnimation = startVisualAnimation;
window.stopVisualAnimation = stopVisualAnimation;
window.startRealtimeListener = startRealtimeListener;
window.stopRealtimeListener = stopRealtimeListener;

// Cache bilgilerini gösterme
window.getCacheInfo = function() {
    const now = Date.now();
    const cacheAge = lastDataFetch ? Math.round((now - lastDataFetch) / 1000 / 60) : 0;
    const cacheRemaining = lastDataFetch ? Math.round((CACHE_DURATION - (now - lastDataFetch)) / 1000 / 60) : 0;
    
    console.log('📊 Cache Bilgileri:');
    console.log(`- Yaş: ${cacheAge} dakika`);
    console.log(`- Kalan: ${cacheRemaining} dakika`);
    console.log(`- Son güncelleme: ${lastDataFetch ? new Date(lastDataFetch).toLocaleString() : 'Hiç'}`);
};

// Debug için data objesi
Object.defineProperty(window, 'heritageData', {
    get: function() { return data; }
});

// Debug komutları
console.log('🎯 Optimizasyonlu Veri Kontrolleri:');
console.log('- loadFromSupabase(anim, force) : Supabase\'den veri yükle');
console.log('- animateNumbers() : Manuel animasyon başlat');
console.log('- getCacheInfo() : Cache durumunu göster');
console.log('- startVisualAnimation(dk) : Görsel animasyon başlat');
console.log('- startRealtimeListener(dk) : Veri kontrol başlat');
console.log('- heritageData : Mevcut veri objesi');