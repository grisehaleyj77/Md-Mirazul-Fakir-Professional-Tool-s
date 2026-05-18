import React, { useState, useRef, Suspense, useEffect } from 'react';
import { 
  Camera, 
  Rotate3d, 
  Upload, 
  Download, 
  Maximize, 
  RotateCw, 
  Eye, 
  Zap,
  Info,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Html, 
  useProgress, 
  useTexture
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// --- Viewer Component ---

const SphereViewer = ({ imageUrl, mode }: { imageUrl: string; mode: '360' | '3D' }) => {
  const texture = useTexture(imageUrl);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mode === '3D' && meshRef.current) {
      // Add a slight floating/parallax effect in 3D mode
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group>
      {mode === '360' ? (
        <mesh scale={[-1, 1, 1]} rotation={[0, -Math.PI / 2, 0]}>
          <sphereGeometry args={[500, 60, 40]} />
          <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </mesh>
      ) : (
        <mesh ref={meshRef}>
          <planeGeometry args={[16, 9, 32, 32]} />
          <meshStandardMaterial 
            map={texture} 
            displacementScale={0.5} 
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>
      )}
      
      {mode === '3D' && (
        <>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
        </>
      )}
    </group>
  );
};

const LoadingScreen = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xs font-black text-blue-600 uppercase tracking-widest">{Math.round(progress)}% RENDERING</div>
      </div>
    </Html>
  );
};

// --- Main Tool ---

export const PictureTo360 = () => {
  const [image, setImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'360' | '3D'>('360');
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `360-capture-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header & Controls */}
      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Rotate3d className="w-3 h-3" />
              Immersive Graphics Engine
            </div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900">360° Vision Pro</h2>
            <p className="text-sm font-medium text-gray-500 max-w-sm">
              Convert static images into immersive 3D environments or cinematic 360° panoramas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Source
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden" 
              accept="image/*"
            />
          </div>
        </div>

        {image && (
          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-50">
             <button 
               onClick={() => setViewMode('360')}
               className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === '360' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
             >
               <RotateCw className="w-4 h-4" />
               360° Panorama
             </button>
             <button 
               onClick={() => setViewMode('3D')}
               className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === '3D' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
             >
               <Maximize className="w-4 h-4" />
               3D Parallax
             </button>
             <div className="flex-1" />
             <button 
               onClick={downloadScreenshot}
               className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
             >
               <Download className="w-4 h-4" />
               Capture View
             </button>
          </div>
        )}
      </div>

      {/* Main Experience Area */}
      <div className="relative aspect-video bg-gray-900 rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
        <AnimatePresence mode="wait">
          {image ? (
            <motion.div 
              key="viewer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <Canvas 
                gl={{ preserveDrawingBuffer: true }}
                camera={{ position: [0, 0, 0.1], fov: 75 }}
              >
                <Suspense fallback={<LoadingScreen />}>
                  <SphereViewer imageUrl={image} mode={viewMode} />
                  <OrbitControls 
                    enableZoom={true} 
                    enablePan={viewMode === '3D'} 
                    autoRotate={viewMode === '360'}
                    autoRotateSpeed={0.5}
                    minDistance={viewMode === '3D' ? 5 : 0.1}
                    maxDistance={viewMode === '3D' ? 20 : 0.5}
                  />
                </Suspense>
              </Canvas>

              {/* Instructions Overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                 <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    Drag to explore • Scroll to zoom
                 </div>
                 <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    <Info className="w-5 h-5 opacity-50" />
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full flex flex-col items-center justify-center text-white/40 space-y-4"
            >
              <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center border border-white/10">
                 <Camera className="w-10 h-10" />
              </div>
              <div className="text-center">
                 <h3 className="font-black text-sm uppercase tracking-widest text-white">No Input Detected</h3>
                 <p className="text-[10px] font-medium opacity-50 mt-1">Upload a panorama or regular photo to start</p>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all mt-4"
              >
                Select Image
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feature Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
           <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <RotateCw className="w-5 h-5" />
           </div>
           <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 leading-tight">Equirectangular Mapping</h3>
           <p className="text-xs text-gray-500 font-medium leading-relaxed">
             Our engine automatically projects your static images onto a mathematical sphere, creating a seamless 360-degree environment you can step inside.
           </p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
           <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Eye className="w-5 h-5" />
           </div>
           <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 leading-tight">3D Parallax Depth</h3>
           <p className="text-xs text-gray-500 font-medium leading-relaxed">
             Toggle 3D mode to activate spatial displacement. This creates a realistic parallax effect where closer elements respond dynamically to your cursor.
           </p>
        </div>
      </div>
    </div>
  );
};
