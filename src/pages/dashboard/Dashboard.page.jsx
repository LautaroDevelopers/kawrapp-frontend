import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../api/api';
import { NavBar } from './components/NavBar';
import {
  RiStackLine,
  RiWomenFill,
  RiMenFill,
  RiHealthBookLine,
  RiSpeedLine,
  RiCalendarScheduleLine,
  RiRefreshLine,
  RiArrowRightUpLine,
} from '@remixicon/react';

export const DashboardPage = () => {
  const [animals, setAnimals] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const [animalsRes, healthRes] = await Promise.all([
        get('/animals'),
        get('/health'),
      ]);
      setAnimals(Array.isArray(animalsRes) ? animalsRes : []);
      setHealthRecords(Array.isArray(healthRes) ? healthRes : []);
    } catch (e) {
      setError('No se pudieron cargar los datos del dashboard.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const metrics = useMemo(() => {
    const total = animals.length;
    const females = animals.filter(a => Number(a.sex) === 1).length;
    const males = animals.filter(a => Number(a.sex) === 0).length;
    const producing = animals.filter(a => Number(a.productive) === 1).length;
    const litersValues = animals
      .map(a => parseFloat(String(a.liters_produce).replace(',', '.')))
      .filter(v => !Number.isNaN(v));
    const avgLiters = litersValues.length
      ? (litersValues.reduce((s, v) => s + v, 0) / litersValues.length)
      : 0;

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endIn7Days = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Agrupar próximos controles por fecha (next_check) y contar animales
    const upcomingMap = new Map(); // key: YYYY-MM-DD -> { date: Date, count: number, items: any[] }
    for (const r of healthRecords) {
      if (!r.next_check) continue;
      const d = new Date(r.next_check);
      if (d < startOfToday) continue;
      const dateKey = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
        .toISOString()
        .slice(0, 10); // YYYY-MM-DD en UTC para evitar desfases
      const at = new Date(dateKey + 'T00:00:00Z');
      const current = upcomingMap.get(dateKey) || { dateKey, date: at, count: 0, items: [] };
      current.count += 1;
      current.items.push(r);
      upcomingMap.set(dateKey, current);
    }
    const upcomingDates = Array.from(upcomingMap.values())
      .sort((a, b) => a.date - b.date)
      .slice(0, 5);

    // Controles dentro de los próximos 7 días
    const next7DaysCount = Array.from(upcomingMap.values())
      .filter(e => e.date <= endIn7Days)
      .reduce((sum, e) => sum + e.count, 0);

    // Última actividad de salud
    const lastHealth = [...healthRecords]
      .filter(h => h.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;

    return {
      total,
      females,
      males,
      producing,
      avgLiters: Number.isFinite(avgLiters) ? avgLiters.toFixed(1) : '0.0',
      upcomingDates,
      totalHealth: healthRecords.length,
      next7DaysCount,
      lastHealth,
    };
  }, [animals, healthRecords]);

  // ... no recent lists displayed in this home view; keep it minimal

  return (
    <div className="bg-sky-200 min-h-screen p-4">
      <NavBar />

      <div className="max-w-7xl mx-auto mt-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={fetchAll}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transform hover:scale-105 transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
            title="Actualizar"
          >
            <RiRefreshLine />
            Actualizar
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-700">
                  <RiStackLine />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total animales</p>
                  <p className="text-2xl font-bold text-gray-800">{metrics.total}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 text-green-700">
                  <RiSpeedLine />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Promedio litros</p>
                  <p className="text-2xl font-bold text-gray-800">{metrics.avgLiters} L</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-pink-100 text-pink-700">
                  <RiWomenFill />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hembras</p>
                  <p className="text-2xl font-bold text-gray-800">{metrics.females}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-700">
                  <RiMenFill />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Machos</p>
                  <p className="text-2xl font-bold text-gray-800">{metrics.males}</p>
                </div>
              </div>
            </div>

            {/* Extra quick stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Registros de salud</p>
                  <p className="text-2xl font-bold text-gray-800">{metrics.totalHealth}</p>
                </div>
                <RiHealthBookLine className="text-gray-500" />
              </div>
              <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Controles próximos (7 días)</p>
                  <p className="text-2xl font-bold text-gray-800">{metrics.next7DaysCount}</p>
                </div>
                <RiCalendarScheduleLine className="text-gray-500" />
              </div>
            </div>

            {/* Secondary metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-gray-800">En producción</h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    {metrics.producing}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Animales marcados como productivos</p>
                <Link
                  to="/dashboard/animals"
                  className="inline-flex items-center gap-1 px-3 py-1.5 mt-3 bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200 rounded-lg transition-all duration-150 cursor-pointer shadow-sm hover:shadow hover:translate-x-0.5"
                >
                  Ver animales
                  <RiArrowRightUpLine className="transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-gray-800">Próximos controles</h2>
                  <RiCalendarScheduleLine className="text-gray-500" />
                </div>
                {metrics.upcomingDates.length === 0 ? (
                  <p className="text-sm text-gray-500">Sin controles próximos</p>
                ) : (
                  <ul className="space-y-2">
                    {metrics.upcomingDates.map((e) => {
                      const [y, m, d] = e.dateKey.split('-');
                      const human = `${d}/${m}/${y}`; // dd/mm/aaaa
                      return (
                        <li key={e.dateKey} className="text-sm text-gray-700 flex justify-between">
                          <span>{human}</span>
                          <span>{e.count} {e.count === 1 ? 'animal' : 'animales'}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Última actividad de salud */}
              <div className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-gray-800">Última actividad de salud</h2>
                  <RiHealthBookLine className="text-gray-500" />
                </div>
                {metrics.lastHealth ? (
                  <div className="text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span className="font-medium">{metrics.lastHealth.animal_name || `#${metrics.lastHealth.animal_id}`}</span>
                      <span className="text-gray-500">{new Date(metrics.lastHealth.date).toLocaleDateString()}</span>
                    </div>
                    <div className="text-gray-500 mt-1">
                      {metrics.lastHealth.vaccine_name || metrics.lastHealth.disease || metrics.lastHealth.treatment || metrics.lastHealth.health_status || 'Registro'}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Sin registros recientes</p>
                )}
                <Link
                  to="/dashboard/health"
                  className="inline-flex items-center gap-1 px-3 py-1.5 mt-3 bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200 rounded-lg transition-all duration-150 cursor-pointer shadow-sm hover:shadow hover:translate-x-0.5"
                >
                  Ver salud
                  <RiArrowRightUpLine className="transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};