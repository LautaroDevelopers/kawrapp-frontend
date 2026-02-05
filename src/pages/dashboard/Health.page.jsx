import { useState, useEffect } from 'react';
import { get } from '../../api/api';
import { NavBar } from './components/NavBar';
import { RiSearchLine, RiFilterLine, RiRefreshLine, RiHealthBookLine } from '@remixicon/react';
import { HealthRecordForm } from '../../components/HealthRecordForm';
import { AnimalHealthRecords } from '../../components/AnimalHealthRecords';

export const HealthPage = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [healthRecords, setHealthRecords] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch animals data
    useEffect(() => {
        const fetchAnimals = async () => {
            setLoading(true);
            try {
                const response = await get('/animals');
                setAnimals(response);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch animals', error);
                setError('No se pudieron cargar los animales. Intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };
        fetchAnimals();
    }, []);

    // Fetch health records when an animal is selected
    useEffect(() => {
        if (selectedAnimal) {
            const fetchHealthRecords = async () => {
                try {
                    const data = await get(`/health/animal/${selectedAnimal.id}`);
                    setHealthRecords(data);
                    setError(null);
                } catch (error) {
                    console.error('Failed to fetch health records', error);
                    setError('No se pudieron cargar los registros de salud. Intente nuevamente.');
                }
            };
            fetchHealthRecords();
        } else {
            setHealthRecords([]);
        }
    }, [selectedAnimal]);

    // Filter animals based on search term
    const filteredAnimals = animals.filter(animal => {
        const name = String(animal.name || '').toLowerCase();
        const caravan = String(animal.caravan || '').toLowerCase();
        const term = searchTerm.toLowerCase();
        return name.includes(term) || caravan.includes(term);
    });

    const handleRefresh = async () => {
        setSearchTerm('');
        
        try {
            setLoading(true);
            const response = await get('/animals');
            setAnimals(response);
            setError(null);
        } catch (error) {
            setError('No se pudieron actualizar los animales. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const getHealthStatusIndicator = (animal) => {
        // This would ideally come from the most recent health record
        // For now, we'll use a placeholder
        return (
            <span className="inline-flex h-3 w-3 bg-green-400 rounded-full"></span>
        );
    };

    return (
        <div className='container bg-sky-200 min-h-screen min-w-full p-4'>
            <NavBar />
            
            {/* Header with search */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 mt-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">Gestión de Salud Animal</h1>
                        <button 
                            onClick={() => setShowAddForm(true)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                            title="Agregar nuevo registro de salud"
                        >
                            <RiHealthBookLine className="mr-2" />
                            Nuevo Registro de Salud
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Buscar animal por nombre o caravana..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                        
                        <button 
                            onClick={handleRefresh}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            title="Actualizar"
                        >
                            <RiRefreshLine className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Success message */}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
                    <span>{successMessage}</span>
                    <button onClick={() => setSuccessMessage('')}>
                        <RiRefreshLine className="text-green-700" />
                    </button>
                </div>
            )}
            
            {/* Error message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}
            
            {/* Loading state */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Animal List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h2 className="text-lg font-semibold mb-4">Seleccionar Animal</h2>
                            {filteredAnimals.length === 0 ? (
                                <p className="text-gray-500 p-4 text-center">No se encontraron animales</p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {filteredAnimals.map(animal => (
                                        <li 
                                            key={animal.id}
                                            className={`py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg flex items-center justify-between ${
                                                selectedAnimal?.id === animal.id ? 'bg-blue-50' : ''
                                            }`}
                                            onClick={() => setSelectedAnimal(animal)}
                                        >
                                            <div className="flex items-center">
                                                <div className="mr-3">
                                                    {getHealthStatusIndicator(animal)}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{animal.name}</h3>
                                                    <p className="text-sm text-gray-500">Caravana: {animal.caravan}</p>
                                                </div>
                                            </div>
                                            <div className="text-sm">
                                                {Number(animal.sex) === 1 ? 'H' : 'M'} | {animal.age} años
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    
                    {/* Health Records */}
                    <div className="lg:col-span-2">
                        {selectedAnimal ? (
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <AnimalHealthRecords 
                                    animalId={selectedAnimal.id} 
                                    animalName={selectedAnimal.name} 
                                />
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-10 flex flex-col items-center justify-center h-64">
                                <RiHealthBookLine size={50} className="text-gray-300 mb-4" />
                                <p className="text-gray-500 text-center">
                                    Seleccione un animal para ver su historial de salud
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Add Health Record Form */}
            {showAddForm && (
                <HealthRecordForm
                    onClose={() => setShowAddForm(false)}
                    onRecordSaved={(animalId) => {
                        setShowAddForm(false);
                        setSuccessMessage('Registro de salud guardado exitosamente');
                        
                        // If the animal is already selected, refresh its health records
                        if (selectedAnimal && selectedAnimal.id === parseInt(animalId)) {
                            const fetchHealthRecords = async () => {
                                try {
                                    const data = await get(`/health/animal/${selectedAnimal.id}`);
                                    setHealthRecords(data);
                                } catch (error) {
                                    console.error('Failed to fetch health records', error);
                                }
                            };
                            fetchHealthRecords();
                        }
                        
                        // Hide message after 3 seconds
                        setTimeout(() => setSuccessMessage(''), 3000);
                    }}
                />
            )}
        </div>
    );
};
