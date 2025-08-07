'use client';

import { useEffect, useState } from 'react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

interface JumlahKK {
    IDJumlahKK: number;
    JumlahKK: number;
}

const JumlahKKPage = () => {
    const [data, setData] = useState<JumlahKK[]>([]);
    const [formData, setFormData] = useState({ jumlahkk: '' });
    const [editMode, setEditMode] = useState(false);
    const [currentData, setCurrentData] = useState<JumlahKK | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<JumlahKK | null>(null);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const res = await fetch('https://desakepayangbackend-production.up.railway.app/jumlahkk/');
            const json = await res.json();
            setData(json);
        } catch (err) {
            setError('Gagal mengambil data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openModal = (item?: JumlahKK) => {
        if (item) {
            setEditMode(true);
            setCurrentData(item);
            setFormData({ jumlahkk: item.JumlahKK.toString() });
        } else {
            setEditMode(false);
            setCurrentData(null);
            setFormData({ jumlahkk: '' });
        }
        setShowModal(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ jumlahkk: e.target.value.replace(/\D/g, '') });
    };

    const sanitizeInput = (value: string) => {
        return value.replace(/[<>]/g, ''); // filter tag injection
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const method = editMode ? 'PUT' : 'POST';
        const url = editMode
            ? `https://desakepayangbackend-production.up.railway.app/jumlahkk/${currentData?.IDJumlahKK}`
            : 'https://desakepayangbackend-production.up.railway.app/jumlahkk/';

        // Sanitize di sini
        const sanitizedValue = sanitizeInput(formData.jumlahkk);

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ jumlahkk: parseInt(sanitizedValue) }),
            });
            if (!res.ok) throw new Error();
            fetchData();
            setShowModal(false);
        } catch (err) {
            setError('Gagal menyimpan data');
        }
    };

    const confirmDelete = (item: JumlahKK) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`https://desakepayangbackend-production.up.railway.app/jumlahkk/${itemToDelete.IDJumlahKK}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error();
            fetchData();
            setShowDeleteModal(false);
        } catch {
            setError('Gagal menghapus data');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    {/* Perbaikan layout header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manajemen Jumlah KK</h1>
                            <p className="text-gray-600 mt-2">Kelola data jumlah kepala keluarga di desa</p>
                        </div>

                        <button
                            onClick={() => openModal()}
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

                    {/* Perbaikan tampilan tabel */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">No</th>
                                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Jumlah KK</th>
                                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-8 px-4 text-center text-gray-500">
                                            Tidak ada data
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((item, index) => (
                                        <tr key={item.IDJumlahKK} className="hover:bg-gray-50">
                                            <td className="py-4 px-4 text-gray-600">{index + 1}</td>
                                            <td className="py-4 px-4 font-medium text-gray-600">{item.JumlahKK}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => openModal(item)}
                                                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(item)}
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
                    {/* Modal Form */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                                <div className="mb-4">
                                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                                        {editMode ? 'Edit Data' : 'Tambah Data'}
                                    </h2>
                                    <input
                                        type="text"
                                        value={formData.jumlahkk}
                                        onChange={handleChange}
                                        placeholder="Masukkan jumlah KK"
                                        className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-600"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal Konfirmasi Hapus */}
                    <DeleteConfirmationModal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleDelete}
                        itemName={`${itemToDelete?.JumlahKK} KK`}
                        description="Data jumlah KK yang dihapus tidak dapat dikembalikan"
                    />
                </div>
            </div>
        </div>
    );
};

export default JumlahKKPage;
