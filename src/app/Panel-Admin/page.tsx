'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  HomeIcon,
  UserGroupIcon,
  LightBulbIcon,
  BuildingOfficeIcon,
  NewspaperIcon,
  ChatBubbleLeftRightIcon,
  IdentificationIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  MapIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// Lazy load halaman
const StrukturDesaPage = lazy(() => import('./Struktur/page'));
const BeritaPage = lazy(() => import('./Berita/page'));
const VisiMisiPage = lazy(() => import('./VisiMisi/page'));
const SambutanPage = lazy(() => import('./Sambutan/page'));
const AdminPage = lazy(() => import('./Admin/page'));
const AdminProfile = lazy(() => import('./Profile/page'));
const JumlahKKPage = lazy(() => import('./JumlahKK/page'));
const KomentarPage = lazy(() => import('./Komentar/page'));
const RTRWPage = lazy(() => import('./RTRW/page'));
const PendudukPage = lazy(() => import('./Penduduk/page'));
const SearchPendudukPage = lazy(() => import('./Search/page'));

type Menu = 'dashboard' | 'admin' | 'visi-misi' | 'struktur' | 'berita' | 'kata-sambutan' | 'jumlahkk' | 'komentar' | 'rtrw' | 'penduduk' | 'search';

const PanelAdminPage = () => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<Menu>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const socket = new WebSocket("wss://desakepayangbackend-production.up.railway.app/ws");

    socket.onopen = () => {
      // Kirim pesan awal tanpa log
      socket.send("Halo dari frontend");
    };

    socket.onmessage = (event) => {
      // Bisa proses data di sini tanpa log
      // contoh: handleMessage(event.data)
    };

    socket.onclose = () => {
      // Tutup koneksi tanpa log
    };

    return () => socket.close();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://desakepayangbackend-production.up.railway.app/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.clear();
      document.cookie = 'auth_token=; Max-Age=0; path=/';
      document.cookie = 'admin=; Max-Age=0; path=/';

      if (res.ok) {
        router.push('/');
      } else {
        console.error('Gagal logout');
      }
    } catch (error) {
      console.error('Error saat logout:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'admin', label: 'Admin', icon: ShieldCheckIcon },
    { id: 'visi-misi', label: 'Visi Misi', icon: LightBulbIcon },
    { id: 'struktur', label: 'Struktur', icon: BuildingOfficeIcon },
    { id: 'berita', label: 'Berita', icon: NewspaperIcon },
    { id: 'kata-sambutan', label: 'Kata Sambutan', icon: MegaphoneIcon },
    { id: 'jumlahkk', label: 'Jumlah KK', icon: IdentificationIcon },
    { id: 'komentar', label: 'Komentar', icon: ChatBubbleLeftRightIcon },
    { id: 'rtrw', label: 'RT dan RW', icon: MapIcon },
    { id: 'penduduk', label: 'Penduduk', icon: UserGroupIcon },
    { id: 'search', label: 'Search Penduduk', icon: MagnifyingGlassIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Header Mobile */}
      <div className="md:hidden bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 flex justify-between items-center">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <div className="w-8"></div>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-10 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div
        className={`fixed md:relative inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-700 to-indigo-800 text-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
      >
        <div className="p-5 border-b border-indigo-500 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id as Menu);
                if (windowWidth < 768) setIsSidebarOpen(false);
              }}
              className={`w-full text-left px-5 py-3 transition-colors duration-200 hover:bg-indigo-600 flex items-center ${activeMenu === item.id ? 'bg-indigo-600' : ''
                }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="mt-5 w-full flex items-center px-5 py-3 text-red-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <Suspense
          fallback={
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-6xl flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }
        >
          {activeMenu === 'struktur' && <StrukturDesaPage />}
          {activeMenu === 'berita' && <BeritaPage />}
          {activeMenu === 'visi-misi' && <VisiMisiPage />}
          {activeMenu === 'kata-sambutan' && <SambutanPage />}
          {activeMenu === 'admin' && <AdminPage />}
          {activeMenu === 'dashboard' && <AdminProfile />}
          {activeMenu === 'jumlahkk' && <JumlahKKPage />}
          {activeMenu === 'komentar' && <KomentarPage />}
          {activeMenu === 'rtrw' && <RTRWPage />}
          {activeMenu === 'penduduk' && <PendudukPage />}
          {activeMenu === 'search' && <SearchPendudukPage />}

          {/* Default: placeholder layout untuk menu lainnya */}
          {!['struktur', 'berita', 'visi-misi', 'kata-sambutan', 'admin', 'dashboard', 'jumlahkk', 'komentar', 'rtrw', 'penduduk', 'search'].includes(activeMenu) && (
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-4xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {menuItems.find((item) => item.id === activeMenu)?.label}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {activeMenu === 'dashboard'
                      ? 'Selamat datang di panel admin. Silakan pilih menu untuk mengelola konten.'
                      : `Halaman pengelolaan ${menuItems.find((item) => item.id === activeMenu)?.label.toLowerCase()}. Fitur akan segera tersedia.`}
                  </p>
                </div>

                {activeMenu === 'dashboard' && windowWidth >= 768 && (
                  <div className="hidden md:flex space-x-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center min-w-[100px]">
                      <div className="text-2xl font-bold text-blue-700">12</div>
                      <div className="text-sm text-gray-600">Admin</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center min-w-[100px]">
                      <div className="text-2xl font-bold text-green-700">24</div>
                      <div className="text-sm text-gray-600">Berita</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                      <div className="ml-4">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mt-8">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-blue-700">
                    Halaman ini sedang dalam pengembangan. Silakan pilih menu lain atau gunakan fitur logout untuk keluar.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Suspense>
      </div>

      {/* Logout Button Mobile */}
      <div className="md:hidden fixed bottom-4 right-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PanelAdminPage;
