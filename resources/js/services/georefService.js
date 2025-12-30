import axios from 'axios';

/**
 * Servicio para consumir la API Georef a través del backend Laravel
 * 
 * Este servicio actúa como intermediario entre el frontend y el backend,
 * centralizando todas las llamadas relacionadas con búsqueda de direcciones.
 */

/**
 * Busca direcciones (calles) según los parámetros proporcionados
 * 
 * @param {Object} params - Parámetros de búsqueda
 * @param {string} params.calle - Nombre de la calle a buscar
 * @param {number} [params.altura] - Altura numérica (opcional)
 * @param {string} [params.provincia] - Nombre de la provincia (opcional)
 * @param {string} [params.localidad] - Nombre de la localidad (opcional)
 * @param {number} [params.max] - Cantidad máxima de resultados (default: 10)
 * @returns {Promise<Array>} Array de direcciones encontradas
 * 
 * @example
 * const resultados = await buscarDirecciones({
 *   calle: 'Rivadavia',
 *   altura: 1000,
 *   provincia: 'Buenos Aires',
 *   max: 10
 * });
 */
export const buscarDirecciones = async (params) => {
  try {
    const response = await axios.get('/general/georef/direcciones', {
      params: {
        calle: params.calle,
        altura: params.altura,
        provincia: params.provincia,
        localidad: params.localidad,
        max: params.max || 10,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al buscar direcciones:', error);
    throw error;
  }
};

/**
 * Busca calles según los parámetros proporcionados
 * 
 * @param {Object} params - Parámetros de búsqueda
 * @param {string} params.nombre - Nombre de la calle a buscar
 * @param {string} [params.provincia] - Nombre de la provincia (opcional)
 * @param {string} [params.departamento] - Nombre del departamento (opcional)
 * @param {number} [params.max] - Cantidad máxima de resultados (default: 10)
 * @returns {Promise<Array>} Array de calles encontradas
 * 
 * @example
 * const calles = await buscarCalles({
 *   nombre: 'San Martin',
 *   provincia: 'Córdoba',
 *   max: 15
 * });
 */
export const buscarCalles = async (params) => {
  try {
    const response = await axios.get('/general/georef/calles', {
      params: {
        nombre: params.nombre,
        provincia: params.provincia,
        departamento: params.departamento,
        max: params.max || 10,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al buscar calles:', error);
    throw error;
  }
};

/**
 * Normaliza una dirección para obtener información completa y estandarizada
 * 
 * @param {Object} params - Parámetros de normalización
 * @param {string} params.calle - Nombre de la calle
 * @param {number} params.altura - Altura numérica
 * @param {string} [params.provincia] - Nombre de la provincia (opcional)
 * @returns {Promise<Object>} Dirección normalizada
 * 
 * @example
 * const direccionNormalizada = await normalizarDireccion({
 *   calle: 'Av Rivadavia',
 *   altura: 1234,
 *   provincia: 'Ciudad Autónoma de Buenos Aires'
 * });
 */
export const normalizarDireccion = async (params) => {
  try {
    const response = await axios.post('/general/georef/normalizar', {
      calle: params.calle,
      altura: params.altura,
      provincia: params.provincia,
    });

    return response.data;
  } catch (error) {
    console.error('Error al normalizar dirección:', error);
    throw error;
  }
};

/**
 * Busca provincias según el texto ingresado
 * 
 * @param {Object} params - Parámetros de búsqueda
 * @param {string} params.nombre - Nombre de la provincia a buscar
 * @param {number} [params.max] - Cantidad máxima de resultados (default: 10)
 * @returns {Promise<Array>} Array de provincias encontradas
 */
export const buscarProvincias = async (params) => {
  try {
    const response = await axios.get('/general/georef/provincias', {
      params: {
        nombre: params.nombre,
        max: params.max || 10,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al buscar provincias:', error);
    throw error;
  }
};

/**
 * Busca localidades según el texto ingresado
 * 
 * @param {Object} params - Parámetros de búsqueda
 * @param {string} params.nombre - Nombre de la localidad a buscar
 * @param {string} [params.provincia] - Nombre de la provincia (opcional)
 * @param {number} [params.max] - Cantidad máxima de resultados (default: 10)
 * @returns {Promise<Array>} Array de localidades encontradas
 */
export const buscarLocalidades = async (params) => {
  try {
    const response = await axios.get('/general/georef/localidades', {
      params: {
        nombre: params.nombre,
        provincia: params.provincia,
        max: params.max || 10,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al buscar localidades:', error);
    throw error;
  }
};

export default {
  buscarDirecciones,
  buscarCalles,
  normalizarDireccion,
  buscarProvincias,
  buscarLocalidades,
};
