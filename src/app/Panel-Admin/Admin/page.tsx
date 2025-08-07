'use client';

import { useState, useEffect } from 'react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

interface Admin {
    id?: number;
    id_admin?: number;
    username?: string;
    role?: string;
}

const AdminPage = () => {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string } | null>(null);

    useEffect(() => {
        fetchAdmins();
    }, []);

    useEffect(() => {
        console.log("formData:", formData);
    }, [formData]);

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://desakepayangbackend-production.up.railway.app/admin/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Gagal mengambil data admin');

            const result = await response.json();

            // Mapping data agar id_admin sesuai frontend
            const transformed: Admin[] = (result.data as Admin[]).map((admin) => ({
                id_admin: admin.id_admin ?? admin.id ?? 0,
                username: admin.username ?? '',
                role: admin.role ?? '',
            }));

            setAdmins(transformed);
        } catch (err) {
            setError('Gagal mengambil data admin');
        } finally {
            setLoading(false);
        }
    };

    const sanitizeInput = (value: string) => {
        return value.replace(/[<>]/g, ''); // filter tag injection
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const openCreateModal = () => {
        setEditMode(false);
        setCurrentAdmin(null);
        setFormData({ username: '', password: '' });
        setShowModal(true); // <- INI YANG KURANG
    };

    const openEditModal = (item: Admin) => {
        setFormData({ username: item.username ?? '', password: '' });
        setCurrentAdmin(item);
        setEditMode(true);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const url = editMode
            ? `https://desakepayangbackend-production.up.railway.app/admin/${currentAdmin?.id_admin}`
            : `https://desakepayangbackend-production.up.railway.app/admin/register`;
        const method = editMode ? 'PUT' : 'POST';

        // Lakukan sanitasi sebelum dikirim
        const sanitizedForm = {
            username: sanitizeInput(formData.username),
            password: sanitizeInput(formData.password),
        };

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(sanitizedForm),
            });

            if (!response.ok) throw new Error('Gagal menyimpan data admin');

            setShowModal(false);
            fetchAdmins();
        } catch (err) {
            setError('Gagal menyimpan data admin');
        }
    };

    const openDeleteModal = (id: number, name: string) => {
        setItemToDelete({ id, name });
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(
                `https://desakepayangbackend-production.up.railway.app/admin/${itemToDelete.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error('Gagal menghapus admin');

            setShowDeleteModal(false);
            fetchAdmins();
        } catch (err) {
            setError('Gagal menghapus admin');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manajemen Admin</h1>
                            <p className="text-gray-600 mt-2">Kelola akun administrator</p>
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
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
                            {error}
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
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">Username</th>
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">Role</th>
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {admins.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-8 px-4 text-center text-gray-500">
                                                Tidak ada data admin
                                            </td>
                                        </tr>
                                    ) : (
                                        admins.map((item, index) => (
                                            <tr key={`${item.id_admin}-${index}`} className="hover:bg-gray-50">
                                                <td className="py-4 px-4 text-gray-600">{index + 1}</td>
                                                <td className="py-4 px-4 font-medium text-gray-600">{item.username}</td>
                                                <td className="py-4 px-4 text-gray-600">{item.role}</td>
                                                <td className="py-4 px-4 text-gray-600">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => openEditModal(item)}
                                                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(item.id_admin ?? 0, item.username ?? '')}
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
                        </div>
                    )}
                </div>
            </div>

            {/* Modal tambah/edit */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {editMode ? 'Edit Admin' : 'Tambah Admin Baru'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setFormData({ username: '', password: '' });
                                        setEditMode(false);
                                        setCurrentAdmin(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        autoComplete="off"
                                        value={formData.username ?? ''}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">
                                        Password {editMode && <span className="text-sm text-gray-500">(opsional)</span>}
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        value={formData.password ?? ''}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-600"
                                        placeholder={editMode ? 'Kosongkan jika tidak ingin mengubah' : ''}
                                        required={!editMode}
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border rounded-lg text-gray-600"
                                    >
                                        Batal
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
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
                description="Data admin yang dihapus tidak dapat dikembalikan"
            />
        </div>
    );
};

export default AdminPage;
