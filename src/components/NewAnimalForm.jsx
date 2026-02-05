import { useState } from 'react';
import { RiCloseLine, RiSaveLine } from '@remixicon/react';
import { post } from '../api/api';

const initialFormState = {
  name: '',
  caravan: '',
  sex: 0,
  cant_children: 0,
  productive: 0,
  tipe: 0,
  liters_produce: '0',
  age: 0
};

export const NewAnimalForm = ({ onClose, onAnimalCreated }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Procesar valores según el tipo de campo
    let processedValue = value;
    
    if (name === "sex" || name === "tipe" || name === "productive") {
      processedValue = parseInt(value);
    } else if (name === "caravan" || name === "cant_children" || name === "age") {
      processedValue = value === '' ? '' : parseInt(value);
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.name.trim()) {
      setError('El nombre del animal es obligatorio');
      return;
    }
    
    if (!formData.caravan) {
      setError('El número de caravana es obligatorio');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await post('/animals', formData);
      onAnimalCreated();
      onClose();
    } catch (error) {
      console.error('Error creating animal:', error);
      setError('Ocurrió un error al crear el animal. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Agregar Nuevo Animal</h2>
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
            {/* Información básica */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del animal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Caravana <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="caravan"
                    value={formData.caravan}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Número de caravana"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    name="tipe"
                    value={formData.tipe}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Producción</option>
                    <option value={1}>Reposición</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexo
                  </label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Macho</option>
                    <option value={1}>Hembra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Edad (años)
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Edad en años"
                  />
                </div>
              </div>
            </div>
            
            {/* Información de producción */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Producción</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado productivo
                  </label>
                  <select
                    name="productive"
                    value={formData.productive}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>No productivo</option>
                    <option value={1}>Productivo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Litros producidos
                  </label>
                  <input
                    type="text"
                    name="liters_produce"
                    value={formData.liters_produce}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Litros producidos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad de crías
                  </label>
                  <input
                    type="number"
                    name="cant_children"
                    value={formData.cant_children}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cantidad de crías"
                  />
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
                  Creando...
                </>
              ) : (
                <>
                  <RiSaveLine className="mr-2" />
                  Crear Animal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
