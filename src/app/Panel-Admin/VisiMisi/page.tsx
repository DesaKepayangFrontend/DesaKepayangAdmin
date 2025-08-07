'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

interface VisiMisi {
    IDVisiMisi: number;
    Visi: string;
    Misi: string;
    Foto: string;
}

const VisiMisiPage = () => {
    const [data, setData] = useState<VisiMisi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [current, setCurrent] = useState<VisiMisi | null>(null);
    const [formData, setFormData] = useState({ visi: '', misi: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string } | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch('https://desakepayangbackend-production.up.railway.app/visimisi');
            const json = await res.json();
            setData(json);
        } catch (err) {
            setError('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const sanitizeInput = (v: string) => v.replace(/[<>]/g, '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: sanitizeInput(value) }));
    };

    const openCreateModal = () => {
        setFormData({ visi: '', misi: '' });
        setEditMode(false);
        setCurrent(null);
        setShowModal(true);
    };

    const openEditModal = (item: VisiMisi) => {
        setFormData({ visi: item.Visi, misi: item.Misi });
        setEditMode(true);
        setCurrent(item);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Hapus formData dan ganti dengan JSON
        const bodyData = {
            visi: formData.visi,
            misi: formData.misi
        };

        const method = editMode ? 'PUT' : 'POST';
        const url = editMode
            ? `https://desakepayangbackend-production.up.railway.app/visimisi/${current?.IDVisiMisi}`
            : `https://desakepayangbackend-production.up.railway.app/visimisi/`;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' // Tambahkan header JSON
                },
                body: JSON.stringify(bodyData), // Kirim sebagai JSON
            });

            if (!res.ok) throw new Error();
            setShowModal(false);
            fetchData();
        } catch {
            setError('Gagal menyimpan data');
        }
    };

    const openDeleteModal = (id: number, name: string) => {
        setItemToDelete({ id, name });
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`https://desakepayangbackend-production.up.railway.app/visimisi/${itemToDelete.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchData();
        } catch {
            setError('Gagal menghapus data');
        } finally {
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manajemen Visi & Misi</h1>
                            <p className="text-gray-600 mt-2">Kelola data visi dan misi desa</p>
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
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">Visi</th>
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">Misi</th>
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-8 px-4 text-center text-gray-500">
                                                Tidak ada data visi dan misi
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((item, i) => (
                                            <tr key={item.IDVisiMisi} className="hover:bg-gray-50">
                                                <td className="py-4 px-4 text-gray-600">{i + 1}</td>
                                                <td className="py-4 px-4 font-medium text-gray-600">{sanitizeInput(item.Visi)}</td>
                                                <td className="py-4 px-4 text-gray-600">{sanitizeInput(item.Misi)}</td>
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
                                                            onClick={() => openDeleteModal(item.IDVisiMisi, item.Visi)}
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
                                    {editMode ? 'Edit Visi Misi' : 'Tambah Visi Misi Baru'}
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
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="visi">
                                        Visi
                                    </label>
                                    <textarea
                                        id="visi"
                                        name="visi"
                                        value={formData.visi}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg 
             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
             outline-none transition text-gray-600 bg-white"
                                        required
                                        rows={4}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="misi">
                                        Misi
                                    </label>
                                    <textarea
                                        id="misi"
                                        name="misi"
                                        value={formData.misi}
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
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                itemName={itemToDelete?.name}
                description="Data visi misi yang dihapus tidak dapat dikembalikan"
            />
        </div>
    );
};

export default VisiMisiPage;