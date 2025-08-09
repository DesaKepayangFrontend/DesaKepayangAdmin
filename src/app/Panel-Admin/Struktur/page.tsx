// app/Panel-Admin/struktur/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

interface StrukturDesa {
  IDStruktur: number;
  Foto: string;
  Nama: string;
  Jabatan: string;
}

const StrukturDesaPage = () => {
  const [struktur, setStruktur] = useState<StrukturDesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStruktur, setCurrentStruktur] = useState<StrukturDesa | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: ''
  });
  // Tambahkan state baru untuk konfirmasi delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number, name: string } | null>(null);

  useEffect(() => {
    fetchStruktur();
  }, []);

  const fetchStruktur = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://desakepayangbackend-production.up.railway.app/struktur-desa/');

      if (!response.ok) {
        throw new Error('Gagal mengambil data struktur desa');
      }

      const data = await response.json();
      setStruktur(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal mengambil data struktur desa');
      setLoading(false);
    }
  };

  const sanitizeInput = (value: string) => {
    return value.replace(/[<>]/g, ''); // filter tag injection
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: sanitizeInput(value) }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFotoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setFormData({ nama: '', jabatan: '' });
    setFotoPreview(null);
    setFotoFile(null);
    setEditMode(false);
    setCurrentStruktur(null);
    setShowModal(true);
  };

  const openEditModal = (item: StrukturDesa) => {
    setFormData({
      nama: item.Nama,
      jabatan: item.Jabatan
    });

    setFotoPreview(item.Foto); // langsung URL dari Cloudinary
    setFotoFile(null);

    setEditMode(true);
    setCurrentStruktur(item);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nama', formData.nama);
      formDataToSend.append('jabatan', formData.jabatan);

      if (fotoFile) {
        formDataToSend.append('foto', fotoFile);
      }

      const baseUrl = 'https://desakepayangbackend-production.up.railway.app/struktur-desa';

      let url = `${baseUrl}/`;
      let method = 'POST';

      if (editMode && currentStruktur) {
        url = `${baseUrl}/${currentStruktur.IDStruktur}`;
        method = 'PUT';
      }

      const token = localStorage.getItem('token');

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan data');
      }

      setShowModal(false);
      fetchStruktur();
    } catch (err) {
      console.error('Error saving data:', err);
      setError('Gagal menyimpan data');
    }
  };

  // Fungsi untuk membuka modal konfirmasi delete
  const openDeleteModal = (id: number, name: string) => {
    setItemToDelete({ id, name });
    setShowDeleteModal(true);
  };

  // Fungsi untuk menghandle konfirmasi delete
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://desakepayangbackend-production.up.railway.app/struktur-desa/${itemToDelete.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Gagal menghapus data');
      }

      fetchStruktur();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      console.error('Error deleting data:', err);
      setError('Gagal menghapus data');
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manajemen Struktur Desa</h1>
              <p className="text-gray-600 mt-2">Kelola data struktur pemerintahan desa</p>
            </div>

            <button
              onClick={openCreateModal}
              className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Tambah Baru
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-400">{error}</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">No</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Foto</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Nama</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Jabatan</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {struktur.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
                        Tidak ada data struktur desa
                      </td>
                    </tr>
                  ) : (
                    struktur.map((item, index) => (
                      <tr key={item.IDStruktur} className="hover:bg-gray-50">
                        <td className="py-4 px-4 text-gray-600">{index + 1}</td>
                        <td className="py-4 px-4">
                          <div className="w-16 h-16 relative">
                            <Image
                              src={item.Foto}
                              alt={item.Nama}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-lg border"
                            />
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-600">{item.Nama}</td>
                        <td className="py-4 px-4 text-gray-600">{item.Jabatan}</td>
                        <td className="py-4 px-4 text-gray-600">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteModal(item.IDStruktur, item.Nama)}
                              className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal untuk menambah/edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editMode ? 'Edit Struktur Desa' : 'Tambah Struktur Desa Baru'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="nama">
                    Nama
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
             outline-none transition text-gray-600 bg-white"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="jabatan">
                    Jabatan
                  </label>
                  <input
                    type="text"
                    id="jabatan"
                    name="jabatan"
                    value={formData.jabatan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
             outline-none transition text-gray-600 bg-white"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="foto">
                    Foto
                  </label>
                  <input
                    type="file"
                    id="foto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
             outline-none transition text-gray-600 bg-white"
                  />
                  {fotoPreview && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <img
                        src={fotoPreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
                  >
                    {editMode ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal konfirmasi hapus */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        itemName={itemToDelete?.name}
        description="Data struktur desa yang dihapus tidak dapat dikembalikan"
      />
    </div>
  );
};

export default StrukturDesaPage;