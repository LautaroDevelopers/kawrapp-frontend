import { useState, useEffect } from 'react';
import { get, del } from '../api/api';
import { RiCalendarLine, RiSyringeLine, RiVirusLine, RiMedicineBottleLine, RiUserHeartLine, RiAlarmLine, RiEditLine, RiDeleteBinLine } from '@remixicon/react';
import { HealthRecordForm } from './HealthRecordForm';

export const AnimalHealthRecords = ({ animalId, animalName }) => {
    const [healthRecords, setHealthRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);

    const fetchHealthRecords = async () => {
        setLoading(true);
        try {
            const data = await get(`/health/animal/${animalId}`);
            setHealthRecords(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching health records:', err);
            setError('No se pudieron cargar los registros de salud');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (animalId) {
            fetchHealthRecords();
        }
    }, [animalId]);

    const handleDelete = async (id) => {
        try {
            await del(`/health/${id}`);
            setHealthRecords(healthRecords.filter(record => record.id !== id));
            setDeleteConfirmation(null);
        } catch (error) {
            console.error('Error deleting health record:', error);
            setError('Error al eliminar el registro de salud');
        }
    };

    const getHealthStatusBadge = (status) => {
        switch (status) {
            case 'healthy':
                return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-sm font-medium">Saludable</span>;
            case 'sick':
                return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-lg text-sm font-medium">Enfermo</span>;
            case 'recovering':
                return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg text-sm font-medium">Recuperación</span>;
            case 'under_treatment':
                return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-medium">En tratamiento</span>;
            case 'critical':
                return <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-sm font-medium">Crítico</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-lg text-sm font-medium">Desconocido</span>;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Historial de Salud - {animalName}</h3>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                >
                    <RiSyringeLine className="mr-2" />
                    Nuevo Registro
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : healthRecords.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-600">No hay registros de salud para este animal.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {healthRecords.map((record) => (
                        <div
                            key={record.id}
                            className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                    <span className="text-gray-600 mr-2">
                                        <RiCalendarLine />
                                    </span>
                                    <span className="font-medium">{formatDate(record.date)}</span>
                                </div>
                                <div>{getHealthStatusBadge(record.health_status)}</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                <div>
                                    {record.vaccine_name && (
                                        <div className="flex items-center text-sm mt-1">
                                            <RiSyringeLine className="text-blue-500 mr-2" />
                                            <span><strong>Vacuna:</strong> {record.vaccine_name}</span>
                                        </div>
                                    )}
                                    {record.disease && (
                                        <div className="flex items-center text-sm mt-1">
                                            <RiVirusLine className="text-red-500 mr-2" />
                                            <span><strong>Enfermedad:</strong> {record.disease}</span>
                                        </div>
                                    )}
                                    {record.treatment && (
                                        <div className="flex items-start text-sm mt-1">
                                            <RiMedicineBottleLine className="text-green-500 mr-2 mt-1" />
                                            <div>
                                                <strong>Tratamiento:</strong> 
                                                <p className="mt-0.5">{record.treatment}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {record.veterinarian && (
                                        <div className="flex items-center text-sm mt-1">
                                            <RiUserHeartLine className="text-purple-500 mr-2" />
                                            <span><strong>Veterinario:</strong> {record.veterinarian}</span>
                                        </div>
                                    )}
                                    {record.next_check && (
                                        <div className="flex items-center text-sm mt-1">
                                            <RiAlarmLine className="text-orange-500 mr-2" />
                                            <span>
                                                <strong>Próximo control:</strong> {formatDate(record.next_check)}
                                            </span>
                                        </div>
                                    )}
                                    {record.observations && (
                                        <div className="flex items-start text-sm mt-1">
                                            <div>
                                                <strong>Observaciones:</strong> 
                                                <p className="mt-0.5">{record.observations}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={() => {
                                        setSelectedRecord(record);
                                        setShowEditForm(true);
                                    }}
                                    className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-md"
                                    title="Editar registro"
                                >
                                    <RiEditLine size={18} />
                                </button>
                                <button
                                    onClick={() => setDeleteConfirmation(record.id)}
                                    className="p-1.5 text-red-500 hover:bg-red-100 rounded-md"
                                    title="Eliminar registro"
                                >
                                    <RiDeleteBinLine size={18} />
                                </button>
                            </div>

                            {/* Delete Confirmation Modal */}
                            {deleteConfirmation === record.id && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                                        <h3 className="text-lg font-bold text-red-600 mb-4">Confirmar eliminación</h3>
                                        <p className="mb-6">¿Está seguro que desea eliminar este registro de salud? Esta acción no se puede deshacer.</p>
                                        <div className="flex justify-end gap-4">
                                            <button
                                                onClick={() => setDeleteConfirmation(null)}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(record.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Health Record Form */}
            {showAddForm && (
                <HealthRecordForm
                    onClose={() => setShowAddForm(false)}
                    onRecordSaved={() => {
                        fetchHealthRecords();
                        setShowAddForm(false);
                    }}
                    animalId={animalId}
                />
            )}

            {/* Edit Health Record Form */}
            {showEditForm && selectedRecord && (
                <HealthRecordForm
                    onClose={() => {
                        setShowEditForm(false);
                        setSelectedRecord(null);
                    }}
                    onRecordSaved={() => {
                        fetchHealthRecords();
                        setShowEditForm(false);
                        setSelectedRecord(null);
                    }}
                    recordId={selectedRecord.id}
                />
            )}
        </div>
    );
};
