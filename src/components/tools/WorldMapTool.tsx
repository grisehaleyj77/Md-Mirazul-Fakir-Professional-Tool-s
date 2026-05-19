import React, { useState } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  ZoomableGroup,
  Sphere,
  Graticule
} from 'react-simple-maps';
import { 
  Globe, 
  Maximize2, 
  Minimize2, 
  Info, 
  Search,
  Map as MapIcon,
  Navigation,
  Crosshair
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const WorldMapTool = () => {
  const [content, setContent] = useState("");
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
  };

  const handleMoveEnd = (position: any) => {
    setPosition(position);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 dark:shadow-none">
            <Globe size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Interactive World Explorer</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">High-Precision Geospatial Data</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-48 md:w-64 transition-all"
            />
          </div>
          <button onClick={handleZoomIn} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Maximize2 size={18} className="text-slate-600 dark:text-slate-400" />
          </button>
          <button onClick={handleZoomOut} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Minimize2 size={18} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-4 shadow-sm relative overflow-hidden h-[600px]">
          <div className="absolute top-8 left-8 z-10 space-y-2">
             <div className="px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm flex items-center gap-3">
                <Navigation size={14} className="text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                   Long: {position.coordinates[0].toFixed(2)} Lat: {position.coordinates[1].toFixed(2)}
                </span>
             </div>
             <AnimatePresence>
               {content && (
                 <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="px-4 py-2 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-600/20 text-xs font-bold"
                 >
                   {content}
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          <ComposableMap 
            projectionConfig={{ scale: 180 }}
            className="w-full h-full outline-none"
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates as [number, number]}
              onMoveEnd={handleMoveEnd}
            >
              <Sphere id="sphere" stroke="#cbd5e1" strokeWidth={0.5} fill="transparent" />
              <Graticule id="graticule" stroke="#cbd5e1" strokeWidth={0.3} fill="transparent" />
              <Geographies geography={geoUrl}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setContent(geo.properties.name)}
                      onMouseLeave={() => setContent("")}
                      onClick={() => setSelectedCountry(geo.properties)}
                      style={{
                        default: {
                          fill: "#f8fafc",
                          stroke: "#d1d5db",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        hover: {
                          fill: "#3b82f6",
                          stroke: "#2563eb",
                          strokeWidth: 0.5,
                          outline: "none",
                          cursor: "pointer"
                        },
                        pressed: {
                          fill: "#1d4ed8",
                          outline: "none",
                        },
                      }}
                      className="transition-colors duration-200"
                    />
                  ))
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
          
          <div className="absolute bottom-8 right-8 flex flex-col gap-2">
             <div className="p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
                <div className="space-y-1">
                   <p className="text-[8px] font-black uppercase text-slate-400">Map Mode</p>
                   <div className="flex gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      <div className="w-4 h-4 rounded-full bg-slate-200" />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full min-h-[300px]">
            <div className="flex items-center gap-2 mb-6">
              <MapIcon size={16} className="text-blue-600" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white">Region Details</h3>
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                {selectedCountry ? (
                  <motion.div
                    key={selectedCountry.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="p-6 bg-blue-50 dark:bg-blue-500/5 rounded-3xl border border-blue-100 dark:border-blue-500/10">
                       <h4 className="text-2xl font-black text-slate-800 dark:text-white italic">{selectedCountry.name}</h4>
                       <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">Country Node Alpha</p>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                          <div className="flex items-center gap-3">
                             <Crosshair size={14} className="text-slate-400" />
                             <span className="text-[10px] font-black uppercase text-slate-500">Global ID</span>
                          </div>
                          <span className="text-xs font-bold font-mono">#{selectedCountry.iso_a3 || 'N/A'}</span>
                       </div>
                       
                       <div className="p-5 bg-amber-50 dark:bg-amber-500/5 rounded-3xl border border-amber-100 dark:border-amber-500/10 flex gap-4">
                          <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400">Data Insight</p>
                             <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                               This region is synchronized. Precision geographic visualization is active for {selectedCountry.name}.
                             </p>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-row lg:flex-col items-center justify-center text-center opacity-30 py-10">
                    <Globe size={48} className="mb-4 text-slate-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest max-w-[120px]">Select a country component to inspect</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                     <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Satellite: Connected</span>
                  </div>
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">v4.2.0-map</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
