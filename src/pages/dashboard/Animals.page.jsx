import { get, put, del } from '../../api/api'
import { useEffect, useState } from 'react'
import { RiMenFill, RiWomenFill, RiSearchLine, RiFilterLine, RiInformationLine, RiCloseCircleLine, RiRefreshLine, RiDeleteBinLine, RiEdit2Line, RiSaveLine, RiAddLine } from '@remixicon/react';
import { NavBar } from './components/NavBar';
import { NewAnimalForm } from '../../components/NewAnimalForm';

export const AnimalsPage = () => {
    const [animals, setAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: 'all',
        sex: 'all'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedAnimal, setEditedAnimal] = useState({});
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showNewAnimalForm, setShowNewAnimalForm] = useState(false);
    const animalsPerPage = 8;

    // Fetch animals data
    useEffect(() => {
        const fetchAnimals = async () => {
            setLoading(true);
            try {
                const response = await get('/animals');
                setAnimals(response);
                setFilteredAnimals(response);
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

    // Apply filters and search
    useEffect(() => {
        let result = [...animals];
        
        // Apply search term
        if (searchTerm.trim()) {
            result = result.filter(animal => {
                const name = String(animal.name || '').toLowerCase();
                const caravan = String(animal.caravan || '').toLowerCase();
                const term = searchTerm.toLowerCase();
                return name.includes(term) || caravan.includes(term);
            });
        }
        
        // Apply type filter
        if (filters.type !== 'all') {
            // tipe: 0 = Producción, 1 = Reposición
            const typeValue = filters.type === 'replacement' ? 1 : 0;
            result = result.filter(animal => Number(animal.tipe) === typeValue);
        }
        
        // Apply sex filter
        if (filters.sex !== 'all') {
            // sex: 0 = Macho, 1 = Hembra
            const sexValue = filters.sex === 'female' ? 1 : 0;
            result = result.filter(animal => Number(animal.sex) === sexValue);
        }
        
        setFilteredAnimals(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTerm, filters, animals]);

    // Pagination logic
    const indexOfLastAnimal = currentPage * animalsPerPage;
    const indexOfFirstAnimal = indexOfLastAnimal - animalsPerPage;
    const currentAnimals = filteredAnimals.slice(indexOfFirstAnimal, indexOfLastAnimal);
    const totalPages = Math.ceil(filteredAnimals.length / animalsPerPage);

    const handleRefresh = async () => {
        setSearchTerm('');
        setFilters({
            type: 'all',
            sex: 'all'
        });
        
        try {
            setLoading(true);
            const response = await get('/animals');
            setAnimals(response);
            setFilteredAnimals(response);
            setError(null);
        } catch (error) {
            setError('No se pudieron actualizar los animales. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnimalClick = (animal) => {
        setSelectedAnimal(animal);
        setEditedAnimal({...animal});
        setIsEditing(false);
        setDeleteConfirmation(false);
    };

    const closeAnimalDetails = () => {
        setSelectedAnimal(null);
        setIsEditing(false);
        setDeleteConfirmation(false);
        setSuccessMessage('');
    };
    
    const startEditing = () => {
        setIsEditing(true);
        setDeleteConfirmation(false);
    };
    
    const cancelEditing = () => {
        setIsEditing(false);
        setEditedAnimal({...selectedAnimal});
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Manejar valores según el tipo de campo
        let processedValue = value;
        
        if (name === "sex" || name === "tipe" || name === "productive") {
            processedValue = value === "1" ? 1 : 0;
        } else if (name === "caravan" || name === "cant_children" || name === "age") {
            processedValue = parseInt(value) || 0;
        }
        
        setEditedAnimal({
            ...editedAnimal,
            [name]: processedValue
        });
    };
    
    const saveAnimalChanges = async () => {
        setActionLoading(true);
        try {
            await put(`/animals/${editedAnimal.id}`, editedAnimal);
            
            // Actualizar la lista de animales con el animal editado
            const updatedAnimals = animals.map(animal => 
                animal.id === editedAnimal.id ? editedAnimal : animal
            );
            setAnimals(updatedAnimals);
            setFilteredAnimals(updatedAnimals);
            setSelectedAnimal(editedAnimal);
            setIsEditing(false);
            setSuccessMessage('Animal actualizado exitosamente');
            
            // Ocultar el mensaje después de 3 segundos
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            setError('Error al actualizar el animal. Intente nuevamente.');
        } finally {
            setActionLoading(false);
        }
    };
    
    const confirmDeleteAnimal = () => {
        setDeleteConfirmation(true);
        setIsEditing(false);
    };
    
    const cancelDeleteConfirmation = () => {
        setDeleteConfirmation(false);
    };
    
    const deleteAnimal = async () => {
        setActionLoading(true);
        try {
            await del(`/animals/${selectedAnimal.id}`);
            
            // Eliminar el animal de la lista
            const updatedAnimals = animals.filter(animal => animal.id !== selectedAnimal.id);
            setAnimals(updatedAnimals);
            setFilteredAnimals(updatedAnimals);
            setSelectedAnimal(null);
            setSuccessMessage('Animal eliminado exitosamente');
            
            // Ocultar el mensaje después de 3 segundos
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            setError('Error al eliminar el animal. Intente nuevamente.');
            setDeleteConfirmation(false);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className='container bg-sky-200 min-h-screen min-w-full p-4'>
            <NavBar />
            
            {/* Header with search and filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 mt-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">Gestión de Animales</h1>
                        <button 
                            onClick={() => setShowNewAnimalForm(true)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                            title="Agregar nuevo animal"
                        >
                            <RiAddLine className="mr-2" />
                            Nuevo Animal
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Buscar por nombre o caravana..."
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
                
                <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <RiFilterLine className="text-gray-500" />
                        <select 
                            value={filters.type} 
                            onChange={(e) => setFilters({...filters, type: e.target.value})}
                            className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todos los tipos</option>
                            <option value="production">Producción</option>
                            <option value="replacement">Reposición</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">Sexo:</span>
                        <select 
                            value={filters.sex} 
                            onChange={(e) => setFilters({...filters, sex: e.target.value})}
                            className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todos</option>
                            <option value="female">Hembra</option>
                            <option value="male">Macho</option>
                        </select>
                    </div>
                    
                    <div className="ml-auto text-sm text-gray-500">
                        {filteredAnimals.length} animales encontrados
                    </div>
                </div>
            </div>
            
            {/* Error message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>
                        <RiCloseCircleLine className="text-red-700" />
                    </button>
                </div>
            )}
            
            {/* Success message */}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
                    <span>{successMessage}</span>
                    <button onClick={() => setSuccessMessage('')}>
                        <RiCloseCircleLine className="text-green-700" />
                    </button>
                </div>
            )}
            
            {/* Loading state */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {/* Animal cards */}
                    {currentAnimals.length > 0 ? (
                        <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
                            {currentAnimals.map(animal => (
                                <li 
                                    key={animal.id} 
                                    className='flex flex-col gap-2 p-4 border border-gray-300 rounded-lg shadow-md bg-white hover:bg-gray-50 transition-colors duration-200 hover:shadow-lg cursor-pointer'
                                    onClick={() => handleAnimalClick(animal)}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className='font-bold text-xl text-gray-800'>{animal.name}</h2>
                                        <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">{animal.caravan}</span>
                                    </div>
                                    
                                    <div className="border-t border-gray-200 pt-2">
                                        <div className="flex justify-between items-center">
                                            <span className='bg-pink-100 text-pink-800 px-2 py-1 rounded-lg text-sm font-medium'>
                                                {animal.liters_produce} Lts
                                            </span>
                                            
                                            <span>
                                                {Number(animal.sex) === 1 ? (
                                                    <div className='flex items-center text-pink-500'>
                                                        <RiWomenFill /> <span className="ml-1">Hembra</span>
                                                    </div>
                                                ) : (
                                                    <div className='flex items-center text-blue-500'>
                                                        <RiMenFill /> <span className="ml-1">Macho</span>
                                                    </div>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-2 flex justify-between items-center">
                                        <div>
                                            {Number(animal.tipe) === 1 ? (
                                                <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-medium'>Reposición</span>
                                            ) : (
                                                <span className='bg-orange-100 text-orange-800 px-2 py-1 rounded-lg text-sm font-medium'>Producción</span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">
                                                {animal.age || 0} {animal.age === 1 ? 'año' : 'años'}
                                            </span>
                                            <div className="flex items-center">
                                                <span className="inline-flex h-2 w-2 bg-green-400 rounded-full mr-1" title="Estado de salud"></span>
                                                <button className="text-blue-500 hover:text-blue-700">
                                                    <RiInformationLine size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                            <p className="text-gray-500 text-lg mb-4">No se encontraron animales con los filtros actuales</p>
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilters({ type: 'all', sex: 'all' });
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {filteredAnimals.length > animalsPerPage && (
                        <div className="flex justify-center mt-6">
                            <div className="flex space-x-1">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-l-lg ${
                                        currentPage === 1 
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                >
                                    Anterior
                                </button>
                                
                                {/* Page numbers */}
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-4 py-2 ${
                                            currentPage === i + 1
                                            ? 'bg-blue-700 text-white'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-r-lg ${
                                        currentPage === totalPages 
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
            
            {/* New Animal Form Modal */}
            {showNewAnimalForm && (
                <NewAnimalForm 
                    onClose={() => setShowNewAnimalForm(false)}
                    onAnimalCreated={() => {
                        handleRefresh();
                        setSuccessMessage('Animal creado exitosamente');
                        setTimeout(() => {
                            setSuccessMessage('');
                        }, 3000);
                    }}
                />
            )}
            
            {/* Animal Detail Modal */}
            {selectedAnimal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {isEditing ? 'Editar Animal' : 'Detalles del Animal'}
                            </h2>
                            <button 
                                onClick={closeAnimalDetails}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <RiCloseCircleLine size={24} />
                            </button>
                        </div>
                        
                        {deleteConfirmation ? (
                            <div className="p-6">
                                <div className="bg-red-50 p-4 rounded-lg mb-6">
                                    <h3 className="text-lg font-semibold text-red-800 mb-2">¿Está seguro que desea eliminar este animal?</h3>
                                    <p className="text-red-700">Esta acción no se puede deshacer. Se eliminará permanentemente el animal <strong>{selectedAnimal.name}</strong> con caravan <strong>{selectedAnimal.caravan}</strong>.</p>
                                </div>
                                
                                <div className="flex justify-end space-x-4">
                                    <button 
                                        onClick={cancelDeleteConfirmation}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                                        disabled={actionLoading}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={deleteAnimal}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? (
                                            <>
                                                <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                                                Eliminando...
                                            </>
                                        ) : (
                                            <>
                                                <RiDeleteBinLine className="mr-2" />
                                                Confirmar Eliminación
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : isEditing ? (
                            <div className="p-6">
                                <form>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={editedAnimal.name || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Caravan</label>
                                                    <input
                                                        type="number"
                                                        name="caravan"
                                                        value={editedAnimal.caravan || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                                    <select
                                                        name="tipe"
                                                        value={editedAnimal.tipe || 0}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value={0}>Producción</option>
                                                        <option value={1}>Reposición</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                                                    <select
                                                        name="sex"
                                                        value={editedAnimal.sex || 0}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value={0}>Macho</option>
                                                        <option value={1}>Hembra</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de crías</label>
                                                    <input
                                                        type="number"
                                                        name="cant_children"
                                                        value={editedAnimal.cant_children || 0}
                                                        onChange={handleInputChange}
                                                        min="0"
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Producción</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Litros producidos</label>
                                                    <input
                                                        type="text"
                                                        name="liters_produce"
                                                        value={editedAnimal.liters_produce || ''}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado de producción</label>
                                                    <select
                                                        name="productive"
                                                        value={editedAnimal.productive || 0}
                                                        onChange={handleInputChange}
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value={0}>No productivo</option>
                                                        <option value={1}>Productivo</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Edad (años)</label>
                                                    <input
                                                        type="number"
                                                        name="age"
                                                        value={editedAnimal.age || 0}
                                                        onChange={handleInputChange}
                                                        min="0"
                                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 flex justify-end space-x-4">
                                        <button 
                                            type="button" 
                                            onClick={cancelEditing}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                                            disabled={actionLoading}
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={saveAnimalChanges}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? (
                                                <>
                                                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                                                    Guardando...
                                                </>
                                            ) : (
                                                <>
                                                    <RiSaveLine className="mr-2" />
                                                    Guardar Cambios
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Información Básica</h3>
                                        <div className="space-y-2">
                                            <p><span className="font-medium">Nombre:</span> {selectedAnimal.name}</p>
                                            <p><span className="font-medium">Caravan:</span> {selectedAnimal.caravan}</p>
                                            <p>
                                                <span className="font-medium">Tipo:</span>{' '}
                                                {Number(selectedAnimal.tipe) === 1 ? 'Reposición' : 'Producción'}
                                            </p>
                                            <p>
                                                <span className="font-medium">Sexo:</span>{' '}
                                                {Number(selectedAnimal.sex) === 1 ? 'Hembra' : 'Macho'}
                                            </p>
                                            <p>
                                                <span className="font-medium">Cantidad de crías:</span>{' '}
                                                {selectedAnimal.cant_children || 0}
                                            </p>
                                            <p>
                                                <span className="font-medium">Edad:</span>{' '}
                                                {selectedAnimal.age || 0} {selectedAnimal.age === 1 ? 'año' : 'años'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Producción</h3>
                                        <div className="space-y-2">
                                            <p>
                                                <span className="font-medium">Litros producidos:</span>{' '}
                                                <span className="text-lg font-bold text-pink-600">{selectedAnimal.liters_produce} Lts</span>
                                            </p>
                                            <p>
                                                <span className="font-medium">Estado:</span>{' '}
                                                {Number(selectedAnimal.productive) === 1 ? (
                                                    <span className="text-green-600 font-medium">Productivo</span>
                                                ) : (
                                                    <span className="text-gray-600 font-medium">No productivo</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-2">Acciones</h3>
                                    <div className="flex space-x-4">
                                        <button 
                                            onClick={startEditing}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                                        >
                                            <RiEdit2Line className="mr-2" />
                                            Editar Animal
                                        </button>
                                        <button 
                                            onClick={confirmDeleteAnimal}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                                        >
                                            <RiDeleteBinLine className="mr-2" />
                                            Eliminar Animal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}