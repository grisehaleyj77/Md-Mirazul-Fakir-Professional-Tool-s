import React, { useState } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
} from 'react-simple-maps';
import { 
  Map as MapIcon, 
  Search, 
  Info, 
  Navigation, 
  Layout, 
  Layers,
  MousePointer2,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// GeoJSON for Bangladesh Districts
const bdGeoUrl = "https://raw.githubusercontent.com/strabd/bangladesh-geojson/master/bd-districts.json";

export const Bangladesh3DMap = () => {
  const [hoveredDistrict, setHoveredDistrict] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRotating, setIsRotating] = useState(true);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Control Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-200 dark:shadow-none">
            <Layout size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">BD DISTRICT <span className="text-emerald-600">3D EXPLORER</span></h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Atmospheric Geospatial Rendering</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text"
               placeholder="Search District..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl text-sm font-bold focus:outline-none focus:border-emerald-500/20 transition-all shadow-inner"
             />
          </div>
          <button 
            onClick={() => setIsRotating(!isRotating)}
            className={`p-3.5 rounded-2xl border-2 transition-all ${isRotating ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
          >
            <Layers size={20} className={isRotating ? 'animate-spin-slow' : ''} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Map Stage */}
        <div className="lg:col-span-8 relative">
           <div 
             className="bg-white dark:bg-slate-900 rounded-[50px] border border-slate-100 dark:border-slate-800 p-8 shadow-xl overflow-hidden aspect-square md:aspect-video flex items-center justify-center relative cursor-crosshair"
             style={{ perspective: '1200px' }}
           >
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />
              
              <motion.div 
                className="w-full h-full relative"
                animate={{ 
                  rotateX: 45, 
                  rotateZ: isRotating ? [0, 360] : 0,
                  y: -20
                }}
                transition={{ 
                  rotateZ: { repeat: Infinity, duration: 80, ease: "linear" },
                  rotateX: { duration: 1 },
                  y: { duration: 1 }
                }}
              >
                {/* Shadow Layer */}
                <div className="absolute inset-0 translate-y-8 blur-lg opacity-20 pointer-events-none">
                   <ComposableMap 
                    projection="geoMercator"
                    projectionConfig={{ 
                      scale: 8500,
                      center: [90.3563, 23.6850] 
                    }}
                    className="w-full h-full"
                  >
                    <Geographies geography={bdGeoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => (
                          <Geography key={geo.rsmKey} geography={geo} fill="#000" />
                        ))
                      }
                    </Geographies>
                  </ComposableMap>
                </div>

                {/* Main Map Layer */}
                <ComposableMap 
                  projection="geoMercator"
                  projectionConfig={{ 
                    scale: 8500,
                    center: [90.3563, 23.6850] 
                  }}
                  className="w-full h-full relative z-10"
                >
                  <Geographies geography={bdGeoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const isHovered = hoveredDistrict?.name === geo.properties.name;
                        const isSelected = selectedDistrict?.name === geo.properties.name;
                        const isMatch = searchQuery && geo.properties.name.toLowerCase().includes(searchQuery.toLowerCase());

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={() => setHoveredDistrict(geo.properties)}
                            onMouseLeave={() => setHoveredDistrict(null)}
                            onClick={() => setSelectedDistrict(geo.properties)}
                            style={{
                              default: {
                                fill: isMatch ? "#10b981" : "#f1f5f9",
                                stroke: "#cbd5e1",
                                strokeWidth: 0.5,
                                outline: "none",
                              },
                              hover: {
                                fill: "#10b981",
                                stroke: "#059669",
                                strokeWidth: 1,
                                outline: "none",
                              },
                              pressed: {
                                fill: "#059669",
                                outline: "none",
                              },
                            }}
                            className="transition-all duration-300"
                          />
                        );
                      })
                    }
                  </Geographies>
                </ComposableMap>
              </motion.div>

              {/* HUD Overlays */}
              <div className="absolute top-8 right-8 z-20 space-y-3 pointer-events-none">
                 <div className="px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-100 dark:border-white/10 rounded-2xl shadow-xl flex items-center gap-3">
                    <Maximize2 size={14} className="text-emerald-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Render: 60FPS</span>
                 </div>
                 <div className="px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-100 dark:border-white/10 rounded-2xl shadow-xl flex items-center gap-3">
                    <Navigation size={14} className="text-emerald-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Engine: v3.1</span>
                 </div>
              </div>

              <div className="absolute bottom-8 left-8 z-20">
                 <AnimatePresence>
                   {(hoveredDistrict || selectedDistrict) && (
                     <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-6 bg-slate-900 text-white rounded-[32px] shadow-2xl border border-white/10 min-w-[240px] space-y-4"
                     >
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Current Node</p>
                           <h3 className="text-2xl font-black italic">{(hoveredDistrict || selectedDistrict).name}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <p className="text-[8px] font-bold text-slate-500 uppercase">Division</p>
                              <p className="text-xs font-black">{(hoveredDistrict || selectedDistrict).division || 'N/A'}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[8px] font-bold text-slate-500 uppercase">Status</p>
                              <p className="text-xs font-black text-emerald-400">Synchronized</p>
                           </div>
                        </div>
                        <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                           <MousePointer2 size={12} className="text-slate-500" />
                           <span className="text-[9px] font-black uppercase text-slate-500">Interactive Mesh</span>
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
           </div>
        </div>

        {/* Sidebar Intel */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden h-full">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 blur-[80px] rounded-full" />
              
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                       <MapIcon size={20} />
                    </div>
                    <h3 className="text-lg font-black tracking-tight italic">DATA INTELLIGENCE</h3>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Analysis</p>
                       <div className="p-4 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                          <div className="flex items-center justify-between">
                             <span className="text-xs font-bold">Total Districts</span>
                             <span className="text-xs font-black">64 Units</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: '100%' }}
                               className="h-full bg-emerald-500"
                             />
                          </div>
                       </div>
                    </div>

                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[32px] flex gap-4">
                       <Info size={20} className="text-emerald-500 shrink-0" />
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Projection Info</p>
                          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                            This visualization uses a raw SVG mesh matched with GeoJSON coordinates. 
                            The 3D tilt is simulated via CSS perspective rendering.
                          </p>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Global Meta</p>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                             <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Projection</p>
                             <p className="text-[10px] font-black">Mercator</p>
                          </div>
                          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                             <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Resolution</p>
                             <p className="text-[10px] font-black">1:110m</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
