import { useState, useEffect } from 'react';
import { RiCloseLine, RiSaveLine } from '@remixicon/react';
import { post, put, get } from '../api/api';

const initialFormState = {
  animal_id: '',
  date: new Date().toISOString().split('T')[0],
  vaccine_name: '',
  disease: '',
  treatment: '',
  observations: '',
  next_check: '',
  veterinarian: '',
  health_status: 'healthy'
};

export const HealthRecordForm = ({ onClose, onRecordSaved, recordId = null, animalId = null }) => {
  const [formData, setFormData] = useState({...initialFormState});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const animalsData = await get('/animals');
        setAnimals(animalsData);
      } catch (error) {
        console.error('Error fetching animals', error);
        setError('No se pudieron cargar los animales. Intente nuevamente.');
      }
    };

    fetchAnimals();

    if (recordId) {
      const fetchHealthRecord = async () => {
        try {
          setLoading(true);
          const record = await get(`/health/${recordId}`);
          setFormData(record);
          setIsEditing(true);
        } catch (error) {
          console.error('Error fetching health record', error);
          setError('No se pudo cargar el registro de salud. Intente nuevamente.');
        } finally {
          setLoading(false);
        }
      };

      fetchHealthRecord();
    } else if (animalId) {
      setFormData(prev => ({...prev, animal_id: animalId}));
    }
  }, [recordId, animalId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.animal_id) {
      setError('Debe seleccionar un animal');
      return;
    }
    
    if (!formData.date) {
      setError('La fecha es obligatoria');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (isEditing) {
        await put(`/health/${recordId}`, formData);
      } else {
        await post('/health', formData);
      }
      
      onRecordSaved(formData.animal_id);
      onClose();
    } catch (error) {
      console.error('Error saving health record:', error);
      setError('Ocurrió un error al guardar el registro de salud. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Editar Registro de Salud' : 'Nuevo Registro de Salud'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <RiCloseLine size={24} />
          </button>
        </div>
        
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Animal <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="animal_id"
                    value={formData.animal_id}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={animalId !== null}
                    required
                  >
                    <option value="">Seleccione un animal</option>
                    {animals.map(animal => (
                      <option key={animal.id} value={animal.id}>
                        {animal.name} (Caravana: {animal.caravan})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de Vacuna
                  </label>
                  <input
                    type="text"
                    name="vaccine_name"
                    value={formData.vaccine_name || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre de la vacuna (si aplica)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enfermedad
                  </label>
                  <input
                    type="text"
                    name="disease"
                    value={formData.disease || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enfermedad diagnosticada (si aplica)"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Detalles de Tratamiento</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tratamiento
                  </label>
                  <textarea
                    name="treatment"
                    value={formData.treatment || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descripción del tratamiento aplicado"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observaciones
                  </label>
                  <textarea
                    name="observations"
                    value={formData.observations || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Observaciones adicionales"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Próximo Control
                  </label>
                  <input
                    type="date"
                    name="next_check"
                    value={formData.next_check || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Veterinario
                  </label>
                  <input
                    type="text"
                    name="veterinarian"
                    value={formData.veterinarian || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del veterinario"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado de Salud
                  </label>
                  <select
                    name="health_status"
                    value={formData.health_status || 'healthy'}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="healthy">Saludable</option>
                    <option value="sick">Enfermo</option>
                    <option value="recovering">En recuperación</option>
                    <option value="under_treatment">Bajo tratamiento</option>
                    <option value="critical">Crítico</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  {isEditing ? 'Actualizando...' : 'Guardando...'}
                </>
              ) : (
                <>
                  <RiSaveLine className="mr-2" />
                  {isEditing ? 'Actualizar Registro' : 'Guardar Registro'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
