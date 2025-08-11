'use client';

import { useState, useEffect } from 'react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface RTRW {
    id_rtrw: number;
    rt: string;
    rw: string;
}

interface Penduduk {
    id_penduduk: number;
    id_rtrw: number;
    nama: string;
    agama: string;
    gender: string;
    rtrw: {
        id_rtrw: number;
        rt: string;
        rw: string;
    };
}

const PendudukPage = () => {
    const [penduduk, setPenduduk] = useState<Penduduk[]>([]);
    const [rtrwList, setRtrwList] = useState<RTRW[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentPenduduk, setCurrentPenduduk] = useState<Penduduk | null>(null);
    const [formData, setFormData] = useState({
        id_rtrw: '',
        nama: '',
        agama: '',
        gender: ''
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: number, name: string } | null>(null);
    const [selectedGender, setSelectedGender] = useState('');

    useEffect(() => {
        fetchPenduduk();
        fetchRTRW();
    }, []);

    const fetchPenduduk = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://desakepayangbackend-production.up.railway.app/penduduk/');
            if (!response.ok) throw new Error('Gagal mengambil data penduduk');
            const data = await response.json();
            setPenduduk(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Gagal mengambil data penduduk');
            setLoading(false);
        }
    };

    const fetchRTRW = async () => {
        try {
            const response = await fetch('https://desakepayangbackend-production.up.railway.app/rtrw/');
            if (!response.ok) throw new Error('Gagal mengambil data RTRW');
            const data = await response.json();
            setRtrwList(data);
        } catch (err) {
            console.error(err);
            setError('Gagal mengambil data RTRW');
        }
    };

    const agamaOptions = [
        'Islam',
        'Konghucu',
        'Kristen',
        'Katolik',
        'Buddha',
        'Lain - Lain'
    ];

    const sanitizeInput = (value: string) => value.replace(/[<>]/g, '');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: sanitizeInput(value) }));
    };

    const handleGenderChange = (value: string) => {
        setSelectedGender(value);
        setFormData(prev => ({ ...prev, gender: value }));
    };

    const openCreateModal = () => {
        setFormData({ id_rtrw: '', nama: '', agama: '', gender: '' });
        setSelectedGender(''); // Reset pilihan gender
        setEditMode(false);
        setCurrentPenduduk(null);
        setShowModal(true);
    };

    const openEditModal = (item: Penduduk) => {
        setFormData({
            id_rtrw: item.id_rtrw.toString(),
            nama: item.nama,
            agama: item.agama,
            gender: item.gender
        });
        setEditMode(true);
        setCurrentPenduduk(item);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi semua field harus diisi
        if (!formData.id_rtrw || !formData.nama.trim() || !formData.agama || !formData.gender) {
            setError('Semua field wajib diisi!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const url = editMode && currentPenduduk
                ? `https://desakepayangbackend-production.up.railway.app/penduduk/${currentPenduduk.id_penduduk}`
                : `https://desakepayangbackend-production.up.railway.app/penduduk/`;
            const method = editMode ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_rtrw: Number(formData.id_rtrw),
                    nama: formData.nama,
                    agama: formData.agama,
                    gender: formData.gender
                })
            });

            if (!res.ok) throw new Error('Gagal menyimpan data');
            setShowModal(false);
            fetchPenduduk();
        } catch (err) {
            console.error(err);
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
            const res = await fetch(`https://desakepayangbackend-production.up.railway.app/penduduk/${itemToDelete.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Gagal menghapus data');
            fetchPenduduk();
            setShowDeleteModal(false);
        } catch (err) {
            console.error(err);
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
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manajemen Data Penduduk</h1>
                            <p className="text-gray-600 mt-2">Kelola data penduduk desa</p>
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
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">Nama</th>
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">Agama</th>
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">Gender</th>
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">RT/RW</th>
                                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {penduduk.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                                                Tidak ada data penduduk
                                            </td>
                                        </tr>
                                    ) : (
                                        penduduk.map((p, i) => (
                                            <tr key={p.id_penduduk} className="hover:bg-gray-50">
                                                <td className="py-4 px-4 text-gray-600">{i + 1}</td>
                                                <td className="py-4 px-4 font-medium text-gray-600">{p.nama}</td>
                                                <td className="py-4 px-4 text-gray-600">{p.agama}</td>
                                                <td className="py-4 px-4 text-gray-600">{p.gender}</td>
                                                <td className="py-4 px-4 text-gray-600">{`${p.rtrw?.rt ?? '-'} / ${p.rtrw?.rw ?? '-'}`}</td>
                                                <td className="py-4 px-4 text-gray-600">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => openEditModal(p)}
                                                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                            </svg>
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(p.id_penduduk, p.nama)}
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

            {/* Modal tambah/edit */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {editMode ? 'Edit Penduduk' : 'Tambah Penduduk'}
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

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="id_rtrw">
                                        RT/RW
                                    </label>

                                    <Listbox value={formData.id_rtrw} onChange={(value) => setFormData(prev => ({ ...prev, id_rtrw: value }))}>
                                        {({ open }) => (
                                            <div className="relative">
                                                <Listbox.Button className="relative w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-600 bg-white text-left flex items-center justify-between">
                                                    <span className="block truncate">
                                                        {formData.id_rtrw
                                                            ? (rtrwList.find(rtrw => rtrw.id_rtrw.toString() === formData.id_rtrw)
                                                                ? `${rtrwList.find(rtrw => rtrw.id_rtrw.toString() === formData.id_rtrw)?.rt} / ${rtrwList.find(rtrw => rtrw.id_rtrw.toString() === formData.id_rtrw)?.rw}`
                                                                : 'Pilih RT/RW')
                                                            : 'Pilih RT/RW'}
                                                    </span>
                                                    <svg
                                                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                        stroke="currentColor"
                                                    >
                                                        <path d="M7 7l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </Listbox.Button>

                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                                                        <Listbox.Option
                                                            className={({ active }) =>
                                                                `cursor-default select-none relative py-2 pl-3 pr-9 ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}`
                                                            }
                                                            value=""
                                                        >
                                                            {({ selected }) => (
                                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                    Pilih RT/RW
                                                                </span>
                                                            )}
                                                        </Listbox.Option>
                                                        {rtrwList.map((rtrw) => (
                                                            <Listbox.Option
                                                                key={rtrw.id_rtrw}
                                                                className={({ active }) =>
                                                                    `cursor-default select-none relative py-2 pl-3 pr-9 ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}`
                                                                }
                                                                value={rtrw.id_rtrw.toString()}
                                                            >
                                                                {({ selected }) => (
                                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                        {rtrw.rt} / {rtrw.rw}
                                                                    </span>
                                                                )}
                                                            </Listbox.Option>
                                                        ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        )}
                                    </Listbox>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="nama">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        id="nama"
                                        name="nama"
                                        placeholder="Nama Lengkap"
                                        value={formData.nama}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-600 bg-white"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="agama">
                                        Agama
                                    </label>

                                    <Listbox value={formData.agama} onChange={(value) => setFormData(prev => ({ ...prev, agama: value }))}>
                                        {({ open }) => (
                                            <div className="relative">
                                                <Listbox.Button className="relative w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-600 bg-white text-left flex items-center justify-between">
                                                    <span className="block truncate">
                                                        {formData.agama || 'Pilih Agama'}
                                                    </span>
                                                    <svg
                                                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                        stroke="currentColor"
                                                    >
                                                        <path d="M7 7l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </Listbox.Button>

                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                                                        <Listbox.Option
                                                            className={({ active }) =>
                                                                `cursor-default select-none relative py-2 pl-3 pr-9 ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}`
                                                            }
                                                            value=""
                                                        >
                                                            {({ selected }) => (
                                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                    Pilih Agama
                                                                </span>
                                                            )}
                                                        </Listbox.Option>
                                                        {agamaOptions.map((agama) => (
                                                            <Listbox.Option
                                                                key={agama}
                                                                className={({ active }) =>
                                                                    `cursor-default select-none relative py-2 pl-3 pr-9 ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}`
                                                                }
                                                                value={agama}
                                                            >
                                                                {({ selected }) => (
                                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                        {agama}
                                                                    </span>
                                                                )}
                                                            </Listbox.Option>
                                                        ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        )}
                                    </Listbox>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="gender">
                                        Jenis Kelamin
                                    </label>

                                    <Listbox value={selectedGender} onChange={handleGenderChange}>
                                        {({ open }) => (
                                            <div className="relative">
                                                <Listbox.Button className="relative w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-600 bg-white text-left flex items-center justify-between">
                                                    <span className="block truncate">
                                                        {selectedGender || 'Pilih Gender'}
                                                    </span>
                                                    <svg
                                                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                        stroke="currentColor"
                                                    >
                                                        <path d="M7 7l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </Listbox.Button>

                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                                                        <Listbox.Option
                                                            className={({ active }) =>
                                                                `cursor-default select-none relative py-2 pl-3 pr-9 ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                                                                }`
                                                            }
                                                            value=""
                                                        >
                                                            {({ selected }) => (
                                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                    Pilih Gender
                                                                </span>
                                                            )}
                                                        </Listbox.Option>
                                                        <Listbox.Option
                                                            className={({ active }) =>
                                                                `cursor-default select-none relative py-2 pl-3 pr-9 ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                                                                }`
                                                            }
                                                            value="Laki-laki"
                                                        >
                                                            {({ selected }) => (
                                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                    Laki-laki
                                                                </span>
                                                            )}
                                                        </Listbox.Option>
                                                        <Listbox.Option
                                                            className={({ active }) =>
                                                                `cursor-default select-none relative py-2 pl-3 pr-9 ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                                                                }`
                                                            }
                                                            value="Perempuan"
                                                        >
                                                            {({ selected }) => (
                                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                    Perempuan
                                                                </span>
                                                            )}
                                                        </Listbox.Option>
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        )}
                                    </Listbox>
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
                description="Data penduduk yang dihapus tidak dapat dikembalikan"
            />
        </div>
    );
};

export default PendudukPage;
