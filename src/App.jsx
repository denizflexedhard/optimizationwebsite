import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MessageCircle, 
  Package, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Phone, 
  MapPin, 
  Clock,
  Car,
  Settings,
  ShieldCheck
} from 'lucide-react';

// --- MÜŞTERİ ÖZEL AYARLARI (CONFIG) ---
const CONFIG = {
  SUPABASE_URL: "https://atgmkqjlgremodizgrwj.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0Z21rcWpsZ3JlbW9kaXpncndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwODIzMzUsImV4cCI6MjA4NDY1ODMzNX0.Nzw4XAQTNIaeqKltO0ailB5oG1TBydaiTfQiRP5PMe0",
  WHATSAPP_NO: "905554443322", // Müşterinin WhatsApp numarası
  FIRM_NAME: "Kuzey Oto Yedek Parça",
  ADDRESS: "İkitelli Organize Sanayi Bölgesi, İstanbul",
  WORKING_HOURS: "Pzt - Cmt: 09:00 - 19:00"
};

const App = () => {
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Supabase kütüphanesini dinamik olarak yüklüyoruz
  useEffect(() => {
    const loadSupabase = async () => {
      if (window.supabase) {
        initClient();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js';
      script.async = true;
      script.onload = initClient;
      document.head.appendChild(script);
    };

    const initClient = () => {
      if (window.supabase) {
        const client = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
        setSupabaseClient(client);
      }
    };

    loadSupabase();
  }, []);

  // Client hazır olduğunda ürünleri getir
  useEffect(() => {
    if (supabaseClient) {
      fetchProducts();
    }
  }, [supabaseClient]);

  useEffect(() => {
    const results = products.filter(product =>
      product.display_baslik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.urun_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    if (!supabaseClient) return;
    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('urunler')
        .select('*')
        .order('olusturma_tarihi', { ascending: false });
      
      if (!error) {
        setProducts(data || []);
        setFilteredProducts(data || []);
      }
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    }
    setLoading(false);
  };

  const getProductImages = (resimData) => {
    if (!resimData) return ['https://via.placeholder.com/600x400?text=Resim+Yok'];
    try {
      const decoded = JSON.parse(resimData);
      return Array.isArray(decoded) ? decoded : [resimData];
    } catch (e) {
      return [resimData];
    }
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Üst Bilgi Çubuğu */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center opacity-80">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><MapPin size={12}/> {CONFIG.ADDRESS}</span>
            <span className="flex items-center gap-1"><Clock size={12}/> {CONFIG.WORKING_HOURS}</span>
          </div>
          <div className="flex items-center gap-1 font-bold">
            <ShieldCheck size={12} className="text-green-400"/> %100 Orjinal Parça Garantisi
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <Car size={24} strokeWidth={2.5}/>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight leading-none text-slate-800">{CONFIG.FIRM_NAME.split(' ')[0]}</span>
              <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase">{CONFIG.FIRM_NAME.split(' ').slice(1).join(' ')}</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Parça adı veya stok kodu ile ara..."
              className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <a 
            href={`tel:${CONFIG.WHATSAPP_NO}`}
            className="hidden sm:flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-2xl hover:bg-slate-200 transition-colors text-sm font-bold"
          >
            <Phone size={16}/>
            Hızlı Destek
          </a>
        </div>
      </header>

      {/* Hero Section */}
      {!searchTerm && (
        <section className="bg-slate-900 py-12 px-4 text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-8 relative z-10">
            <div className="space-y-6">
              <span className="inline-block bg-indigo-500 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">Yedek Parçada Güven</span>
              <h1 className="text-4xl md:text-6xl font-black leading-tight">Aradığınız Parça <br/><span className="text-indigo-400">Tek Tıkla</span> Kapınızda.</h1>
              <p className="text-slate-400 text-lg max-w-md">Kataloğumuzdaki tüm ürünler güncel stok bilgileriyle listelenmektedir. Sipariş için WhatsApp üzerinden iletişime geçebilirsiniz.</p>
              <div className="flex gap-4">
                <div className="bg-white/5 backdrop-blur p-4 rounded-2xl border border-white/10 flex-1">
                  <div className="text-2xl font-black text-indigo-400">{products.length}+</div>
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Aktif Parça</div>
                </div>
                <div className="bg-white/5 backdrop-blur p-4 rounded-2xl border border-white/10 flex-1">
                  <div className="text-2xl font-black text-indigo-400">24s</div>
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Hızlı Kargolama</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full"></div>
               <Settings className="w-64 h-64 text-white/5 absolute right-0 top-0 animate-spin-slow" />
               <Car className="w-full h-auto text-indigo-500/20 relative z-10" strokeWidth={1}/>
            </div>
          </div>
        </section>
      )}

      {/* Katalog Alanı */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8 border-b pb-6">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <Package className="text-indigo-600"/>
            Ürün Kataloğu
          </h2>
          <div className="text-sm text-slate-400 font-medium">
            {filteredProducts.length} parça bulundu
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map(n => (
              <div key={n} className="bg-white rounded-[2rem] h-96 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => {
              const images = getProductImages(product.resim_url);
              return (
                <div 
                  key={product.urun_id} 
                  className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
                  onClick={() => openProduct(product)}
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img 
                      src={images[0]} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={product.display_baslik}
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl text-lg font-black shadow-xl text-slate-900 border border-slate-100">
                      ₺{product.fiyat?.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{product.kategori || 'Genel Parça'}</span>
                      <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{product.display_baslik}</h3>
                    </div>
                    <div className="flex items-center justify-between py-2 border-y border-slate-50">
                       <span className={`text-[10px] font-black uppercase flex items-center gap-1.5 ${product.stok_miktari > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${product.stok_miktari > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                        {product.stok_miktari > 0 ? `STOKTA ${product.stok_miktari} ADET` : 'TÜKENDİ'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">#{product.urun_id}</span>
                    </div>
                    <button 
                      className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
                    >
                      İncele & Bilgi Al
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-20 space-y-4">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <Search size={40} />
            </div>
            <p className="text-slate-500 font-bold text-xl">Aradığınız parça bulunamadı.</p>
            <p className="text-slate-400 text-sm">Lütfen farklı bir anahtar kelime deneyin.</p>
          </div>
        )}
      </main>

      {/* Ürün Detay Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
            <button 
              onClick={closeProduct}
              className="absolute top-6 right-6 z-10 bg-white/80 hover:bg-white p-2 rounded-full text-slate-900 transition-all border shadow-sm"
            >
              <X size={24} />
            </button>

            {/* Sol: Görsel Alanı */}
            <div className="md:w-1/2 bg-slate-100 relative h-[40vh] md:h-auto">
              <img 
                src={getProductImages(selectedProduct.resim_url)[activeImageIndex]} 
                className="w-full h-full object-cover" 
                alt={selectedProduct.display_baslik} 
              />
              
              {/* Çoklu Resim Navigasyonu */}
              {getProductImages(selectedProduct.resim_url).length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImageIndex(i => (i - 1 + getProductImages(selectedProduct.resim_url).length) % getProductImages(selectedProduct.resim_url).length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/50 backdrop-blur p-2 rounded-full text-white transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setActiveImageIndex(i => (i + 1) % getProductImages(selectedProduct.resim_url).length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/50 backdrop-blur p-2 rounded-full text-white transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                  
                  {/* Thumbnail'lar */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[80%] p-2 no-scrollbar">
                    {getProductImages(selectedProduct.resim_url).map((url, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${activeImageIndex === idx ? 'border-indigo-500 scale-110 shadow-lg' : 'border-white/50'}`}
                      >
                        <img src={url} className="w-full h-full object-cover" alt=""/>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sağ: Bilgi Alanı */}
            <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto bg-white">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Car size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">{selectedProduct.kategori || 'Yedek Parça'}</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 leading-tight">{selectedProduct.display_baslik}</h2>
                  <div className="text-slate-400 text-sm font-mono">Stok Kodu: #{selectedProduct.urun_id}</div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-indigo-600">₺{selectedProduct.fiyat?.toLocaleString()}</span>
                  <span className="text-slate-400 text-sm line-through">₺{(selectedProduct.fiyat * 1.2).toLocaleString()}</span>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                  <h4 className="font-bold flex items-center gap-2 text-slate-700">
                    <Settings size={18}/> Parça Özellikleri
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
                    {selectedProduct.display_text}
                  </p>
                </div>

                <div className="flex flex-col gap-4 pt-6">
                  <a 
                    href={`https://wa.me/${CONFIG.WHATSAPP_NO}?text=Merhaba, "${selectedProduct.display_baslik}" (${selectedProduct.urun_id}) isimli parça hakkında detaylı bilgi ve stok durumunu sormak istiyorum.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 bg-emerald-500 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-emerald-600 hover:scale-[1.02] transition-all shadow-xl shadow-emerald-100"
                  >
                    <MessageCircle size={24} fill="white"/>
                    WhatsApp ile Sipariş Ver
                  </a>
                  <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                    Hızlı teslimat & kolay iade garantisi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <Car size={24} strokeWidth={2.5}/>
              </div>
              <span className="font-black text-xl tracking-tight">{CONFIG.FIRM_NAME}</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">Aradığınız tüm marka ve model araçlar için orijinal yedek parça kataloğumuzla 7/24 hizmetinizdeyiz.</p>
          </div>
          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-indigo-400">İletişim</h4>
            <div className="space-y-4 text-sm text-slate-300">
              <p className="flex items-start gap-3"><MapPin className="text-indigo-500 shrink-0" size={18}/> {CONFIG.ADDRESS}</p>
              <p className="flex items-center gap-3"><Phone className="text-indigo-500" size={18}/> {CONFIG.WHATSAPP_NO}</p>
              <p className="flex items-center gap-3"><Clock className="text-indigo-500" size={18}/> {CONFIG.WORKING_HOURS}</p>
            </div>
          </div>
          <div className="space-y-6 text-center md:text-left">
            <h4 className="font-black uppercase tracking-widest text-indigo-400">Hızlı Sipariş</h4>
            <p className="text-slate-400 text-sm">Ürün kodunu kopyalayıp WhatsApp üzerinden bize ileterek hızlıca stok sorgulayabilirsiniz.</p>
            <div className="flex justify-center md:justify-start gap-4">
               <div className="bg-white/5 p-4 rounded-2xl flex-1 text-center">
                  <div className="font-black text-xl">100%</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Güvenli Alışveriş</div>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl flex-1 text-center">
                  <div className="font-black text-xl">AYNI</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Gün Kargolama</div>
               </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
           {CONFIG.FIRM_NAME} © 2026 - Tüm Hakları Saklıdır
        </div>
      </footer>

      {/* Global Style for Slow Animation */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;
