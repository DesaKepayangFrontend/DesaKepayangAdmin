'use client';

import { useEffect, useState } from 'react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

interface Komentar {
    id_komentar: number;
    nama: string;
    email: string;
    no_hp: string;
    komentar: string;
}

const KomentarPage = () => {
    const [komentarList, setKomentarList] = useState<Komentar[]>([]);
    const [formData, setFormData] = useState<Omit<Komentar, 'id_komentar'>>({
        nama: '',
        email: '',
        no_hp: '',
        komentar: '',
    });
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string } | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // Tambahkan state loading

    useEffect(() => {
        fetchKomentar();
    }, []);

    const fetchKomentar = async () => {
        try {
            setLoading(true);
            const res = await fetch('https://desakepayangbackend-production.up.railway.app/komentar/');
            const data = await res.json();
            setKomentarList(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Gagal mengambil data komentar');
            setLoading(false);
        }
    };

    const sanitizeInput = (value: string) => {
        return value.replace(/[<>]/g, ''); // filter tag injection
    };

    const validateInput = (name: string, value: string): boolean => {
        if (name === 'nama') {
            // Hanya huruf dan spasi, maksimal 20 karakter
            const regex = /^[a-zA-Z\s]{1,20}$/;
            return regex.test(value);
        }

        if (name === 'email') {
            // Format email dengan domain valid
            const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
            return regex.test(value);
        }

        if (name === 'no_hp') {
            // Hanya angka, panjang 10-13 digit
            const regex = /^\d{10,13}$/;
            return regex.test(value);
        }

        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let sanitizedValue = sanitizeInput(value);

        // Terapkan validasi khusus untuk setiap field
        if (name === 'nama') {
            // Hanya izinkan huruf dan spasi
            sanitizedValue = sanitizedValue.replace(/[^a-zA-Z\s]/g, '');

            // Batasi panjang maksimal 20 karakter
            if (sanitizedValue.length > 20) {
                sanitizedValue = sanitizedValue.substring(0, 20);
            }
        }
        else if (name === 'no_hp') {
            // Hanya izinkan angka
            sanitizedValue = sanitizedValue.replace(/\D/g, '');

            // Batasi panjang 10-13 digit
            if (sanitizedValue.length > 13) {
                sanitizedValue = sanitizedValue.substring(0, 13);
            }
        }

        setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi input sebelum submit
        const validations = [
            { field: 'nama', value: formData.nama },
            { field: 'email', value: formData.email },
            { field: 'no_hp', value: formData.no_hp },
        ];

        for (const validation of validations) {
            if (!validateInput(validation.field, validation.value)) {
                let errorMessage = '';
                
                switch (validation.field) {
                    case 'nama':
                        errorMessage = 'Nama hanya boleh huruf dan spasi (maks 20 karakter)';
                        break;
                    case 'email':
                        errorMessage = 'Format email tidak valid (contoh: user@domain.com)';
                        break;
                    case 'no_hp':
                        errorMessage = 'Nomor HP hanya angka (10-13 digit)';
                        break;
                }
                
                setError(errorMessage);
                return;
            }
        }

        // Reset error jika validasi berhasil
        setError('');

        const token = localStorage.getItem('token');
        const method = editMode ? 'PUT' : 'POST';
        const url = editMode
            ? `https://desakepayangbackend-production.up.railway.app/komentar/${selectedId}`
            : 'https://desakepayangbackend-production.up.railway.app/komentar/';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    // Pastikan nomor HP dikirim sebagai string
                    no_hp: formData.no_hp.toString()
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Gagal menyimpan data');
            }

            setShowModal(false);
            setFormData({ nama: '', email: '', no_hp: '', komentar: '' });
            setSelectedId(null);
            setEditMode(false);
            fetchKomentar();
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat menyimpan');
        }
    };

    const openEditModal = (item: Komentar) => {
        setFormData({
            nama: item.nama,
            email: item.email,
            no_hp: item.no_hp,
            komentar: item.komentar,
        });
        setSelectedId(item.id_komentar);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDeleteConfirm = async () => {
        const token = localStorage.getItem('token');
        if (!itemToDelete) return;

        try {
            await fetch(`https://desakepayangbackend-production.up.railway.app/komentar/${itemToDelete.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchKomentar();
            setItemToDelete(null);
            setDeleteModalOpen(false);
        } catch (err) {
            setError('Gagal menghapus komentar');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manajemen Komentar</h1>
                            <p className="text-gray-600 mt-2">Kelola komentar yang dikirim pengguna</p>
                        </div>

                        <button
                            onClick={() => {
                                setFormData({ nama: '', email: '', no_hp: '', komentar: '' });
                                setEditMode(false);
                                setShowModal(true);
                            }}
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
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">Nama</th>
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">Email</th>
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">No HP</th>
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">Komentar</th>
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {komentarList.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                                                Tidak ada data komentar
                                            </td>
                                        </tr>
                                    ) : (
                                        komentarList.map((item, index) => (
                                            <tr key={item.id_komentar} className="hover:bg-gray-50">
                                                <td className="py-4 px-4 text-gray-600">{index + 1}</td>
                                                <td className="py-4 px-4 font-medium text-gray-600">{item.nama}</td>
                                                <td className="py-4 px-4 text-gray-600">{item.email}</td>
                                                <td className="py-4 px-4 text-gray-600">{item.no_hp}</td>
                                                <td className="py-4 px-4 text-gray-600">{item.komentar}</td>
                                                <td className="py-4 px-4">
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
                                                            onClick={() => {
                                                                setItemToDelete({ id: item.id_komentar, name: item.nama });
                                                                setDeleteModalOpen(true);
                                                            }}
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

            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {editMode ? 'Edit Komentar' : 'Tambah Komentar'}
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
                                {['nama', 'email', 'no_hp'].map((field) => (
                                    <div key={field} className="mb-4">
                                        <label className="block text-gray-700 text-sm font-medium mb-2 capitalize" htmlFor={field}>
                                            {field.replace('_', ' ')}
                                        </label>
                                        <input
                                            type="text"
                                            id={field}
                                            name={field}
                                            value={(formData as any)[field]}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         outline-none transition text-gray-600 bg-white"
                                            required
                                        />
                                    </div>
                                ))}

                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="komentar">
                                        Komentar
                                    </label>
                                    <textarea
                                        id="komentar"
                                        name="komentar"
                                        value={formData.komentar}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       outline-none transition text-gray-600 bg-white"
                                        required
                                        rows={4}
                                    />
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

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemName={itemToDelete?.name}
                description="Data komentar akan dihapus secara permanen"
            />
        </div>
    );
};

export default KomentarPage;