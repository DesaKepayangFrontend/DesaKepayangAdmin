// File: app/panel-admin/Profile/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Admin {
  id_admin: number;
  username: string;
  role: string;
}

const AdminProfile = () => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          'https://desakepayangbackend-production.up.railway.app/admin/me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error('Gagal mengambil data admin');

        const result = await response.json();
        setAdmin(result.data);
      } catch (err) {
        setError('Gagal mengambil data profil');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Profil Admin</h1>
            <p className="text-gray-600 mt-2">Detail akun administrator Anda</p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Informasi Profil */}
              <div className="md:col-span-2">
                <div className="bg-gray-50 rounded-xl p-6 h-full">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Detail Akun</h2>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-1/3">
                        <label className="block text-sm font-medium text-gray-500">ID Admin</label>
                        <p className="mt-1 text-gray-900 font-medium">{admin?.id_admin || '-'}</p>
                      </div>
                      
                      <div className="w-full md:w-2/3 mt-4 md:mt-0">
                        <label className="block text-sm font-medium text-gray-500">Username</label>
                        <p className="mt-1 text-gray-900 font-medium">{admin?.username || '-'}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-1/3">
                        <label className="block text-sm font-medium text-gray-500">Role</label>
                        <p className="mt-1 text-gray-900 font-medium">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm capitalize">
                            {admin?.role || '-'}
                          </span>
                        </p>
                      </div>
                      
                      <div className="w-full md:w-2/3 mt-4 md:mt-0">
                        <label className="block text-sm font-medium text-gray-500">Status Akun</label>
                        <p className="mt-1 text-gray-900 font-medium">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            Aktif
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Keamanan Akun</h3>
                    <p className="text-gray-600 text-sm">
                      Password Anda disimpan dengan enkripsi tingkat tinggi dan tidak dapat dilihat oleh siapapun.
                      Untuk menjaga keamanan akun, pastikan Anda:
                    </p>
                    <ul className="mt-2 text-gray-600 text-sm list-disc pl-5 space-y-1">
                      <li>Tidak membagikan kredensial login Anda</li>
                      <li>Menggunakan password yang kuat dan unik</li>
                      <li>Logout setelah selesai menggunakan sistem</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Tips Keamanan */}
              <div className="md:col-span-1">
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-6 h-full">
                  <h3 className="text-lg font-medium text-blue-800 mb-3">Tips Keamanan</h3>
                  <ul className="space-y-3 text-blue-700">
                    <li className="flex items-start">
                      <span className="inline-block mr-2 mt-1">•</span>
                      <span>
                        <strong>Gunakan password yang kuat</strong> dengan kombinasi huruf dan angka
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block mr-2 mt-1">•</span>
                      <span>
                        <strong>Update password</strong> secara berkala setiap 3-6 bulan
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block mr-2 mt-1">•</span>
                      <span>
                        <strong>Hindari password umum</strong> seperti tanggal lahir atau nama
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block mr-2 mt-1">•</span>
                      <span>
                        <strong>Logout</strong> terutama saat menggunakan perangkat bersama
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block mr-2 mt-1">•</span>
                      <span>
                        <strong>Jaga kerahasiaan</strong> username dan password Anda
                      </span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 bg-white rounded-lg p-4 border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Butuh Bantuan?</h4>
                    <p className="text-blue-700 text-sm">
                      Jika Anda lupa password atau mengalami masalah akun, 
                      hubungi developer untuk mendapatkan bantuan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;