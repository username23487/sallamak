let state = 0;
let secimler = {};
const Harfler = ["A", "B", "C", "D", "E"];
        
const sorular = [
    // 0: Şık Sayısı (BUTON)
    { id: 0, soru: "Soru kaç şıklı?", sonraki: 1, key: 'sik_sayisi', tip: 'tek', secenekler: [{text: "4 Şık (A-B-C-D)", value: 4}, {text: "5 Şık (A-B-C-D-E)", value: 5}] },
    
    // 1: Şık Tipi (BUTON) - Sorunlu buton burada tekrar kontrol edildi.
    { id: 1, soru: "Şıklar sayısal mı yoksa metin mi içeriyor?", sonraki: 2, key: 'tip', tip: 'tek', secenekler: [{text: "Sayısal", value: "SAYISAL"}, {text: "Metin", value: "METİN"}] },
    
    // 2: Uç Eleme (BUTON)
    { id: 2, soru: "Sayısal şıklarda, en küçük ve en büyük şık arasında çok büyük bir fark var mı?", sonraki: 21, key: 'uc_eleme_var', tip: 'tek', secenekler: [{text: "Evet, var", value: "EVET"}, {text: "Hayır, yok", value: "HAYIR"}] },
    
    // 21: Uç Olmayanlar (ÇOKLU ŞIK BUTON)
    { id: 21, soru: "Uç değer tuzağı varsa: Hangi şıklar uç değer **DEĞİLDİR** (ortada kalmıştır)?", sonraki: 3, key: 'uc_olmayan_sik', tip: 'coklu_sik' },

    // 3: Nadir Kelimeler/Yuvarlak Sayılar (BUTON)
    { id: 3, soru: "Şıklardan biri '9.81' gibi teknik bir sayı içerirken, diğeri '10' gibi yuvarlak bir sayı içeriyor mu?", sonraki: 31, key: 'teknik_sayi_var', tip: 'tek', secenekler: [{text: "Evet, içeriyor", value: "EVET"}, {text: "Hayır, içermiyor", value: "HAYIR"}] }, 
    
    // 31: Teknik Sayı Hangi Şıkta? (TEK ŞIK BUTON)
    { id: 31, soru: "Hangi şık küsuratlı teknik sayıyı içeriyor?", sonraki: 4, key: 'teknik_sayi_sik', tip: 'tek_sik' },

    // 4: Hepsi/Tümü Kuralı (BUTON)
    { id: 4, soru: "Şıklardan biri 'Hepsi', 'Tümü' gibi kapsayıcı ifadeler içeriyor mu?", sonraki: 5, key: 'hepsi_tumu_var', tip: 'tek', secenekler: [{text: "Evet, içeriyor", value: "EVET"}, {text: "Hayır, içermiyor", value: "HAYIR"}] },
    
    // 5: Hangi Şık Hepsi/Tümü İçeriyor? (TEK ŞIK BUTON)
    { id: 5, soru: "Hangi şık, 'Hepsi/Tümü' ifadesini içeriyor?", sonraki: 6, key: 'hepsi_tumu_sik', tip: 'tek_sik' },
    
    // 6: Aşırı Genelleme/Kısıtlama (ÇOKLU ŞIK BUTON)
    { id: 6, soru: "Hangi şıklar 'yalnızca', 'mutlak', 'tek nedeni' gibi çok kısıtlayıcı kelimeler içeriyor?", sonraki: 7, key: 'kisitlayici', tip: 'coklu_sik_hicbiri' },

    // 7: Çelişki Kuralı (ÇOKLU ŞIK BUTON)
    { id: 7, soru: "Hangi ikisi birbirine tamamen zıt ve çelişen ifade içeriyor?", sonraki: 8, key: 'celiski', tip: 'ikili_sik_hicbiri' },

    // 8: Destek Tuzağı Kuralı (ÇOKLU ŞIK BUTON)
    { id: 8, soru: "Hangi iki şık aynı fikri farklı kelimelerle destekliyor?", sonraki: 9, key: 'destek', tip: 'ikili_sik_hicbiri' },

    // 9: Çifte İsim Tuzağı (BUTON)
    { id: 9, soru: "Şıklardan biri 'İki olayı/kişiyi' aynı anda içeriyor mu?", sonraki: 11, key: 'cifte_isim', tip: 'tek', secenekler: [{text: "Evet, içeriyor", value: "EVET"}, {text: "Hayır, içermiyor", value: "HAYIR"}] }
];

const soruMap = {};
sorular.forEach(s => soruMap[s.id] = s);

let anlikSecilenSiklar = [];

// --- GÖSTERİM VE İLERLEME FONKSİYONLARI ---

function gosterSoru(id) {
    state = id;
    anlikSecilenSiklar = []; 
    
    if (id === 11) { finalTahmin(); return; } 
    
    const s = soruMap[id];
    
    // --- AKIŞ KONTROLÜ ---
    if (secimler.tip === "METİN" && (id >= 2 && id <= 31)) { gosterSoru(4); return; } 
    
    if (secimler.uc_eleme_var === "HAYIR" && id === 21) { gosterSoru(3); return; }
    if (secimler.teknik_sayi_var === "HAYIR" && id === 31) { gosterSoru(4); return; }
    if (secimler.hepsi_tumu_var === "HAYIR" && id === 5) { gosterSoru(6); return; }
    
    if (!s) { return; } 

    document.getElementById('soruMetni').textContent = s.soru;
    const cevapSecenekleri = document.getElementById('cevapSecenekleri');
    cevapSecenekleri.innerHTML = '';
    
    if (s.tip === 'tek') {
        // Soru 0, 1, 2, 3, 4, 9 gibi tek cevaplı sorular
        s.secenekler.forEach(secenek => {
            const btn = document.createElement('button');
            btn.className = 'secenek-butonu';
            btn.textContent = secenek.text;
            btn.onclick = () => cevaplaTekli(secenek.value, s.key, s.sonraki);
            cevapSecenekleri.appendChild(btn);
        });
    } 
    else if (s.tip === 'tek_sik') {
        gosterSikButonlari(s.key, s.sonraki, 'tek_sik');
    }
    else if (s.tip === 'coklu_sik' || s.tip === 'ikili_sik_hicbiri' || s.tip === 'coklu_sik_hicbiri') {
        gosterSikButonlari(s.key, s.sonraki, s.tip.startsWith('ikili') ? 'ikili' : 'coklu');
    }
}

// --- BUTON TIKLAMA FONKSİYONLARI ---

function cevaplaTekli(cevap, key, sonraki) {
    if (key === 'sik_sayisi') {
         secimler[key] = parseInt(cevap); 
    } else {
         secimler[key] = cevap;
    }
    gosterSoru(sonraki);
}

function gosterSikButonlari(key, sonraki, tip) {
    const sikSayisi = secimler.sik_sayisi;
    const HarfSecenekleri = Harfler.slice(0, sikSayisi);
    const cevapSecenekleri = document.getElementById('cevapSecenekleri');
    
    HarfSecenekleri.forEach(harf => {
        const btn = document.createElement('button');
        btn.className = 'secenek-butonu sik-butonu';
        btn.id = 'btn-' + harf;
        btn.textContent = harf;
        btn.onclick = () => sikButonuTiklandi(harf, tip);
        cevapSecenekleri.appendChild(btn);
    });

    if (tip === 'coklu' || tip === 'ikili') {
         const hicbiriBtn = document.createElement('button');
         hicbiriBtn.className = 'secenek-butonu sik-butonu';
         hicbiriBtn.id = 'btn-HICBIRI';
         hicbiriBtn.textContent = 'HİÇBİRİ';
         hicbiriBtn.onclick = () => sikButonuTiklandi('HİÇBİRİ', tip);
         cevapSecenekleri.appendChild(hicbiriBtn);
    }
    
    const onayBtn = document.createElement('button');
    onayBtn.className = 'cevap-btn';
    onayBtn.textContent = (tip === 'tek_sik') ? "Devam Et" : "Onayla ve İlerle";
    onayBtn.disabled = (tip !== 'tek_sik'); 
    onayBtn.id = 'onay-btn';
    onayBtn.onclick = () => cevaplaCokluSik(key, sonraki, tip);
    cevapSecenekleri.appendChild(onayBtn);
}

function sikButonuTiklandi(harf, tip) {
    const btn = document.getElementById('btn-' + harf);
    const onayBtn = document.getElementById('onay-btn');
    
    // Tek Şık Modu (Soru 31, 5)
    if (tip === 'tek_sik') {
        document.querySelectorAll('.sik-butonu').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        anlikSecilenSiklar = [harf];
        onayBtn.disabled = false;
    } 
    // Çoklu Şık Modu (Soru 21, 6, 7, 8)
    else {
        if (harf === 'HİÇBİRİ') {
            document.querySelectorAll('.sik-butonu').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            anlikSecilenSiklar = ['HİÇBİRİ'];
        } else {
            const hicbiriBtn = document.getElementById('btn-HICBIRI');
            if(hicbiriBtn) hicbiriBtn.classList.remove('active');

            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                anlikSecilenSiklar = anlikSecilenSiklar.filter(s => s !== harf);
            } else {
                if (tip.startsWith('ikili') && anlikSecilenSiklar.length >= 2) {
                    alert("Bu soru için sadece iki şık seçebilirsiniz.");
                    return;
                }
                btn.classList.add('active');
                anlikSecilenSiklar.push(harf);
            }
            anlikSecilenSiklar = anlikSecilenSiklar.filter(s => s !== 'HİÇBİRİ'); 
        }
        
        // Onay butonunu etkinleştirme
        if (tip.startsWith('ikili')) {
            onayBtn.disabled = !(anlikSecilenSiklar.length === 2 || anlikSecilenSiklar[0] === 'HİÇBİRİ');
        } else {
            onayBtn.disabled = anlikSecilenSiklar.length === 0;
        }
    }
}

function cevaplaCokluSik(key, sonraki, tip) {
    let cevapStr = '';
    
    if (anlikSecilenSiklar[0] === 'HİÇBİRİ') {
         cevapStr = 'HİÇBİRİ';
    } 
    else if (tip === 'tek_sik') {
         cevapStr = anlikSecilenSiklar[0]; 
    }
    else if (tip.startsWith('ikili')) {
        if (anlikSecilenSiklar.length === 2) {
            cevapStr = anlikSecilenSiklar[0] + " VE " + anlikSecilenSiklar[1];
        } else {
            alert("Bu soru için iki şık seçmeniz gerekiyordu."); return;
        }
    }
    else {
        cevapStr = anlikSecilenSiklar.join(', ');
    }

    secimler[key] = cevapStr;
    gosterSoru(sonraki);
}

// --- FİNAL TAHMİN FONKSİYONU ---

function finalTahmin() {
    const sikSayisi = secimler.sik_sayisi;
    if (!sikSayisi) { alert("Şık sayısı bilgisi alınamadı. Lütfen yeniden başlayın."); return; }
    const HarfSecenekleri = Harfler.slice(0, sikSayisi);
    let tahminPuani = new Array(sikSayisi).fill(0);
    let analizler = [];

    // 1. İSTATİSTİKSEL MERKEZ EĞİLİMİ
    if (sikSayisi === 4) {
        tahminPuani[1] += 3; tahminPuani[2] += 5; 
        analizler.push("Merkez Eğilimi: B şıkkına (+3), C şıkkına (+5) puan verildi.");
    } else if (sikSayisi === 5) {
        tahminPuani[1] += 3; tahminPuani[2] += 5; tahminPuani[3] += 3; 
        analizler.push("Merkez Eğilimi: C şıkkı (+5), B ve D şıkları (+3) puan aldı.");
    }
    
    // --- 2. KULLANILAN KURALLARA GÖRE PUANLAMA ---
    
    // 2.7. Uç Eleme Kuralı (Soru 2 ve 21)
    if (secimler.tip === "SAYISAL" && secimler.uc_eleme_var === "EVET" && secimler.uc_olmayan_sik) {
         const ucOlmayanCevap = secimler.uc_olmayan_sik; 
         const ucOlmayanHarfler = ucOlmayanCevap.split(/ VE |, /).map(h => h.trim());
         
         ucOlmayanHarfler.forEach(harf => {
            const harfIndex = HarfSecenekleri.indexOf(harf);
            if (harfIndex !== -1) {
                tahminPuani[harfIndex] += 5; 
                analizler.push("Uç Eleme Kuralı: Şık " + harf + " (Ortada kaldığı için) (+5) puan aldı.");
            }
         });
    }
    
    // 2.6. Nadir Kelimeler Kuralı (Soru 3 ve 31)
    if (secimler.tip === "SAYISAL" && secimler.teknik_sayi_var === "EVET" && secimler.teknik_sayi_sik) {
         const teknikHarf = secimler.teknik_sayi_sik;
         const teknikIndex = HarfSecenekleri.indexOf(teknikHarf);
         if (teknikIndex !== -1) {
             tahminPuani[teknikIndex] += 8;
             analizler.push("Nadir Kelimeler (Sayısal): Teknik sayı içeren şık (" + teknikHarf + ") (+8) puan aldı.");
         }
    }

    // Hepsi/Tümü Kuralı (2.1)
    if (secimler.hepsi_tumu_var === "EVET" && secimler.hepsi_tumu_sik) {
        const kapsayiciHarf = secimler.hepsi_tumu_sik;
        const kapsayiciIndex = HarfSecenekleri.indexOf(kapsayiciHarf);
        if (kapsayiciIndex !== -1) {
            tahminPuani[kapsayiciIndex] += 15;
            analizler.push("Hepsi/Tümü Kuralı: Şık " + kapsayiciHarf + " (+15) puan aldı.");
        }
    }

    // Aşırı Genelleme Elemesi (2.2)
    const kesinlikCevabi = secimler.kisitlayici; 
    if (kesinlikCevabi && kesinlikCevabi !== "HİÇBİRİ") {
        const kesinlikHarfleri = kesinlikCevabi.split(',').map(h => h.trim());
        kesinlikHarfleri.forEach(harf => {
            const kesinlikIndex = HarfSecenekleri.indexOf(harf);
            if (kesinlikIndex !== -1) {
                tahminPuani[kesinlikIndex] -= 10; 
                analizler.push("Aşırı Genelleme Elemesi: Şık " + harf + " (Mutlak ifade içerdiği için) (-10) puan kaybetti.");
            }
        });
    }

    // Çelişki Kuralı (2.3)
    const celiskiCevabi = secimler.celiski; 
    if (celiskiCevabi && celiskiCevabi !== "HİÇBİRİ") {
        const harfler = celiskiCevabi.split('VE').map(h => h.trim()); 
        const index1 = HarfSecenekleri.indexOf(harfler[0].trim());
        const index2 = HarfSecenekleri.indexOf(harfler[1].trim());
        if (index1 !== -1 && index2 !== -1) {
            tahminPuani[index1] += 10;
            tahminPuani[index2] += 10;
            analizler.push("Çelişki Kuralı: " + harfler[0].trim() + " ve " + harfler[1].trim() + " şıkları birbirini çürüttüğü için (+10) puan aldı.");
        }
    }
    
    // Destek Tuzağı Kuralı (2.4)
    const destekCevabi = secimler.destek; 
    if (destekCevabi && destekCevabi !== "HİÇBİRİ") {
        const harfler = destekCevabi.split('VE').map(h => h.trim()); 
        const index1 = HarfSecenekleri.indexOf(harfler[0].trim());
        const index2 = HarfSecenekleri.indexOf(harfler[1].trim());
        if (index1 !== -1 && index2 !== -1) {
            tahminPuani[index1] -= 5; 
            tahminPuani[index2] -= 5;
            analizler.push("Destek Tuzağı Kuralı: " + harfler[0].trim() + " ve " + harfler[1].trim() + " şıkları birbirini desteklediği için (-5) puan kaybetti.");
        }
    }

    // Çifte İsim Tuzağı (2.5)
    if (secimler.cifte_isim === "EVET") {
         if (sikSayisi >= 3) {
             tahminPuani[1] += 5; tahminPuani[2] += 5; 
             analizler.push("Çifte İsim Tuzağı: B ve C şıklarına (+5) puan verildi.");
         }
    }


    // 3. SONUÇ HESAPLAMA
    let maxPuan = -Infinity;
    let esitPuanlar = [];
    
    tahminPuani.forEach((puan, index) => {
        if (puan > maxPuan) {
            maxPuan = puan;
            esitPuanlar = [HarfSecenekleri[index]];
        } else if (puan === maxPuan && maxPuan !== -Infinity) {
            esitPuanlar.push(HarfSecenekleri[index]);
        }
    });

    let tahminSik = (esitPuanlar.length > 1) ? esitPuanlar.join(" ve ") + " (Eşitlik)" : esitPuanlar[0];

    // Sonucu gösterme
    document.getElementById('tahminSik').textContent = tahminSik + " (Puan: " + maxPuan + ")";
    
    const analizListesi = document.getElementById('analizListesi');
    analizListesi.innerHTML = '';
    
    // Puan Tablosu Ekle
    let puanTablosu = 'Puan Durumu: ';
    HarfSecenekleri.forEach((harf, index) => {
        puanTablosu += `${harf}: ${tahminPuani[index]}, `;
    });
    analizler.push(puanTablosu.slice(0, -2));

    analizler.forEach(a => {
        const li = document.createElement('li');
        li.textContent = a;
        analizListesi.appendChild(li);
    });
    
    if (analizler.length === 1 && analizler[0].startsWith('Puan Durumu')) { 
         analizListesi.innerHTML = "<li>Yeterli ipucu edinilemediği için sadece Merkez Eğilimi Kuralı uygulandı.</li>" + analizListesi.innerHTML;
    }

    document.getElementById('diyalogAlani').style.display = 'none';
    document.getElementById('sonucAlani').style.display = 'block';
}

function baslat() {
    secimler = {};
    document.getElementById('diyalogAlani').style.display = 'block';
    document.getElementById('sonucAlani').style.display = 'none';
    gosterSoru(0);
}

// Sayfa yüklendiğinde başlat
window.onload = baslat;
