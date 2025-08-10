'use client';

import { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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

const SearchPendudukPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Penduduk[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fungsi untuk mengambil hasil pencarian
    const fetchSearchResults = useCallback(async (term: string) => {
        if (!term.trim()) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://desakepayangbackend-production.up.railway.app/penduduk/search?nama=${encodeURIComponent(term)}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Gagal mengambil hasil pencarian');
            }

            const data: Penduduk[] = await response.json();
            setSearchResults(data);
        } catch (err) {
            console.error(err);
            setError('Gagal mengambil hasil pencarian');
        } finally {
            setLoading(false);
        }
    }, []);

    // Gunakan debounce untuk mengurangi jumlah permintaan
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchSearchResults(searchTerm);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, fetchSearchResults]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Pencarian Data Penduduk</h1>
                            <p className="text-gray-600 mt-2">Cari penduduk berdasarkan nama</p>
                        </div>
                    </div>

                    {/* Input Pencarian */}
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama penduduk..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-600 bg-white"
                        />
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
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {searchResults.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
                                                {searchTerm ? 'Tidak ada hasil pencarian' : 'Masukkan kata kunci pencarian'}
                                            </td>
                                        </tr>
                                    ) : (
                                        searchResults.map((p, i) => (
                                            <tr key={p.id_penduduk} className="hover:bg-gray-50">
                                                <td className="py-4 px-4 text-gray-600">{i + 1}</td>
                                                <td className="py-4 px-4 font-medium text-gray-600">{p.nama}</td>
                                                <td className="py-4 px-4 text-gray-600">{p.agama}</td>
                                                <td className="py-4 px-4 text-gray-600">{p.gender}</td>
                                                <td className="py-4 px-4 text-gray-600">{`${p.rtrw?.rt ?? '-'} / ${p.rtrw?.rw ?? '-'}`}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPendudukPage;