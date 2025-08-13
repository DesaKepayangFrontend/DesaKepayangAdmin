'use client';

import { useEffect, useState } from 'react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

interface InfoDesa {
    id_info: number;
    indikator: string;
    jumlah: number;
}

const InfoDesa = () => {
    const [data, setData] = useState<InfoDesa[]>([]);
    const [formData, setFormData] = useState({
        indikator: '',
        jumlah: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [currentData, setCurrentData] = useState<InfoDesa | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<InfoDesa | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch('https://desakepayangbackend-production.up.railway.app/info-desa/');
            const json = await res.json();
            setData(json);
        } catch (err) {
            setError('Gagal mengambil data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openModal = (item?: InfoDesa) => {
        if (item) {
            setEditMode(true);
            setCurrentData(item);
            setFormData({
                indikator: item.indikator,
                jumlah: item.jumlah.toString()
            });
        } else {
            setEditMode(false);
            setCurrentData(null);
            setFormData({
                indikator: '',
                jumlah: ''
            });
        }
        setShowModal(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        if (name === 'jumlah') {
            // Hanya izinkan angka untuk field jumlah
            setFormData(prev => ({
                ...prev,
                [name]: value.replace(/\D/g, '')
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validasi frontend
        if (!formData.indikator.trim()) {
            setError('Indikator tidak boleh kosong');
            return;
        }
        
        if (formData.jumlah === '' || parseInt(formData.jumlah) < 0) {
            setError('Jumlah harus angka positif');
            return;
        }

        const token = localStorage.getItem('token');
        const method = editMode ? 'PUT' : 'POST';
        const url = editMode
            ? `https://desakepayangbackend-production.up.railway.app/info-desa/${currentData?.id_info}`
            : 'https://desakepayangbackend-production.up.railway.app/info-desa/';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    indikator: formData.indikator,
                    jumlah: parseInt(formData.jumlah)
                }),
            });

            if (!res.ok) throw new Error();
            fetchData();
            setShowModal(false);
            setError('');
        } catch {
            setError(editMode ? 'Gagal memperbarui data' : 'Gagal menambahkan data');
        }
    };

    const confirmDelete = (item: InfoDesa) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`https://desakepayangbackend-production.up.railway.app/info-desa/${itemToDelete.id_info}`, {
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

    const formFields = [
        { label: 'Indikator', name: 'indikator', value: formData.indikator },
        { label: 'Jumlah', name: 'jumlah', value: formData.jumlah },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manajemen Info Desa</h1>
                            <p className="text-gray-600 mt-2">Kelola data informasi desa</p>
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

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">No</th>
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">Indikator</th>
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">Jumlah</th>
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-8 px-4 text-center text-gray-500">
                                                Tidak ada data
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((item, index) => (
                                            <tr key={item.id_info ?? `row-${index}`} className="hover:bg-gray-50">
                                                <td className="py-4 px-4 text-gray-600">{index + 1}</td>
                                                <td className="py-4 px-4 text-gray-600">{item.indikator}</td>
                                                <td className="py-4 px-4 text-gray-600">{item.jumlah}</td>
                                                <td className="py-4 px-4 text-gray-600">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => openModal(item)}
                                                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => confirmDelete(item)}
                                                            className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Modal form */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-screen">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">{editMode ? 'Edit Data Info Desa' : 'Tambah Data Info Desa'}</h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {formFields.map((field) => (
                                        <div key={field.name} className="mb-3">
                                            <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
                                            {field.name === 'indikator' ? (
                                                <input
                                                    type="text"
                                                    name={field.name}
                                                    value={field.value}
                                                    onChange={handleChange}
                                                    placeholder={`Masukkan ${field.label}`}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-600"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    name={field.name}
                                                    value={field.value}
                                                    onChange={handleChange}
                                                    placeholder={`Masukkan ${field.label}`}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-600"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end space-x-3 mt-4">
                                    <button 
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border rounded-lg text-gray-600"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        onClick={handleSubmit}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delete confirmation modal */}
                    <DeleteConfirmationModal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleDelete}
                        itemName={`Data Info Desa: ${itemToDelete?.indikator}`}
                        description="Data yang dihapus tidak dapat dikembalikan"
                    />
                </div>
            </div>
        </div>
    );
};

export default InfoDesa;