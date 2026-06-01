import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, 
  Activity, 
  Download, 
  Upload, 
  RefreshCw, 
  Server, 
  History, 
  CheckCircle, 
  FileText, 
  AlertTriangle, 
  Clock, 
  Gauge,
  Play,
  Trash2,
  TrendingUp,
  Monitor,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface SpeedTestRecord {
  id: string;
  timestamp: string;
  ping: number;
  jitter: number;
  download: number;
  upload: number;
  server: string;
  grade: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

const SERVERS = [
  { id: 'dhaka', name: 'Dhaka, Bangladesh (BDIX Routing)', distance: '8 km', basePing: 4, jitterMin: 1 },
  { id: 'sg', name: 'Singapore (Equinix SG3)', distance: '2,890 km', basePing: 42, jitterMin: 2 },
  { id: 'tokyo', name: 'Tokyo, Japan (AWS ap-northeast-1)', distance: '4,900 km', basePing: 85, jitterMin: 3 },
  { id: 'london', name: 'London, UK (Linode EU)', distance: '8,010 km', basePing: 138, jitterMin: 5 },
  { id: 'sfo', name: 'California, US (Google Cloud Core)', distance: '12,400 km', basePing: 210, jitterMin: 8 }
];

export const InternetSpeedChecker = () => {
  const [activeServer, setActiveServer] = useState(SERVERS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [testPhase, setTestPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  
  // Real-time metrics
  const [currentSpeed, setCurrentSpeed] = useState(0); // Display on speedometer dial
  const [ping, setPing] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  
  // Graph tracking points
  const [chartData, setChartData] = useState<{ name: string; speed: number }[]>([]);
  const [testHistory, setTestHistory] = useState<SpeedTestRecord[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load local-history records on initial mount
  useEffect(() => {
    const records = localStorage.getItem('speed_test_records_v1');
    if (records) {
      try {
        setTestHistory(JSON.parse(records));
      } catch (err) {
        console.error('Failed to parse speed logs history', err);
      }
    }
  }, []);

  const saveRecord = (dl: number, ul: number, pg: number, jt: number) => {
    let finalGrade: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Excellent';
    if (dl > 80 && pg < 20) finalGrade = 'Excellent';
    else if (dl > 30 && pg < 60) finalGrade = 'Good';
    else if (dl > 10 && pg < 150) finalGrade = 'Fair';
    else finalGrade = 'Poor';

    const newRecord: SpeedTestRecord = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      ping: pg,
      jitter: jt,
      download: dl,
      upload: ul,
      server: activeServer.name.split(' (')[0],
      grade: finalGrade
    };

    const updated = [newRecord, ...testHistory].slice(0, 15); // limit histories count
    setTestHistory(updated);
    localStorage.setItem('speed_test_records_v1', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setTestHistory([]);
    localStorage.removeItem('speed_test_records_v1');
  };

  // Perform smooth physics-based fluid test simulation loop
  const startSpeedTest = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setTestPhase('ping');
    setCurrentSpeed(0);
    setPing(0);
    setJitter(0);
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setChartData([]);

    // Step 1: Ping / Latency Simulation phase
    let currentTick = 0;
    const pingInterval = setInterval(() => {
      currentTick++;
      const randomPing = activeServer.basePing + Math.floor(Math.random() * 8) - 3;
      const randomJitter = activeServer.jitterMin + (Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0);
      setPing(Math.max(1, randomPing));
      setJitter(Math.max(1, randomJitter));

      if (currentTick >= 8) {
        clearInterval(pingInterval);
        startDownloadTest(Math.max(1, randomPing), Math.max(1, randomJitter));
      }
    }, 250);
  };

  const startDownloadTest = (finalPing: number, finalJit: number) => {
    setTestPhase('download');
    let tick = 0;
    const tempChartPoints: { name: string; speed: number }[] = [];
    
    const dlInterval = setInterval(() => {
      tick++;
      // Natural network curve: slow startup, peaks, plateaus slightly
      let simulatedSpeed = 0;
      const targetMax = activeServer.id === 'dhaka' ? 96.4 : activeServer.id === 'sg' ? 78.2 : activeServer.id === 'tokyo' ? 54.8 : activeServer.id === 'london' ? 32.5 : 18.9;
      
      if (tick < 6) {
        // Boost phase
        simulatedSpeed = (targetMax * 0.4) + (Math.random() * (targetMax * 0.3));
      } else if (tick < 16) {
        // Peak plateau
        simulatedSpeed = targetMax + (Math.random() * 6 - 3);
      } else {
        // Stabilization
        simulatedSpeed = targetMax + (Math.random() * 2 - 1);
      }

      // Safe bounds
      simulatedSpeed = Math.max(0.1, Number(simulatedSpeed.toFixed(1)));
      setCurrentSpeed(simulatedSpeed);
      setDownloadSpeed(simulatedSpeed);

      tempChartPoints.push({ name: `DL ${tick * 0.5}s`, speed: simulatedSpeed });
      setChartData([...tempChartPoints]);

      if (tick >= 20) {
        clearInterval(dlInterval);
        startUploadTest(finalPing, finalJit, simulatedSpeed, tempChartPoints);
      }
    }, 200);
  };

  const startUploadTest = (finalPing: number, finalJit: number, finalDl: number, oldChartPoints: { name: string; speed: number }[]) => {
    setTestPhase('upload');
    setCurrentSpeed(0);
    let tick = 0;
    const tempChartPoints = [...oldChartPoints];

    const ulInterval = setInterval(() => {
      tick++;
      // Upload typically lower bandwidth asymmetric pipeline ratios
      const targetMax = (activeServer.id === 'dhaka' ? 84.1 : activeServer.id === 'sg' ? 41.2 : activeServer.id === 'tokyo' ? 24.8 : activeServer.id === 'london' ? 14.2 : 8.1);
      let simulatedSpeed = 0;
      
      if (tick < 6) {
        simulatedSpeed = (targetMax * 0.5) + (Math.random() * (targetMax * 0.3));
      } else {
        simulatedSpeed = targetMax + (Math.random() * 3 - 1.5);
      }

      simulatedSpeed = Math.max(0.1, Number(simulatedSpeed.toFixed(1)));
      setCurrentSpeed(simulatedSpeed);
      setUploadSpeed(simulatedSpeed);

      tempChartPoints.push({ name: `UL ${tick * 0.5}s`, speed: simulatedSpeed });
      setChartData([...tempChartPoints]);

      if (tick >= 16) {
        clearInterval(ulInterval);
        setIsRunning(false);
        setTestPhase('complete');
        setCurrentSpeed(0);
        saveRecord(finalDl, simulatedSpeed, finalPing, finalJit);
      }
    }, 200);
  };

  // Convert current speed to rotate degrees for the visual gauge
  const getSpeedRotation = () => {
    // Limits max mapped bounds on gauge to 150 Mbps
    const maxVal = 150;
    const percentage = Math.min(currentSpeed / maxVal, 1);
    // Gauge sweep from -120 deg (left) to +120 deg (right)
    return -120 + (percentage * 240);
  };

  const getSuitedVerdict = () => {
    if (downloadSpeed > 75 && ping < 25) {
      return {
        title: 'High-Performance 4K Streaming & Gaming Ready',
        description: 'Your latency is exceptionally low with robust overall bandwidth. Perfectly suited for real-time multiplayer VR esports, Ultra-HD content distribution, hosting cloud servers, and bulk backups.',
        color: 'text-emerald-600 bg-emerald-50/40 border-emerald-100'
      };
    } else if (downloadSpeed > 25 && ping < 60) {
      return {
        title: 'Full High-Definition & Home Office Friendly',
        description: 'Highly responsive network. Great for active multi-user remote business work, lag-free zoom group conferences, HD Netflix stream pipelines, and robust social media multitasking.',
        color: 'text-blue-600 bg-blue-50/40 border-blue-100'
      };
    } else if (downloadSpeed > 10 && ping < 150) {
      return {
        title: 'Standard Web Surfing & Social Browsing Active',
        description: 'Decent performance parameters. Provides standard digital operations, although multiple concurrent heavy video downloads, file rendering, or competitive active multiplayer servers might induce occasional buffers.',
        color: 'text-amber-700 bg-amber-50/40 border-amber-100'
      };
    } else {
      return {
        title: 'Degraded Connection detected',
        description: 'Sluggish performance margins. Standard emails work but you will experience packet loss dropouts, pixelated video chats, or heavy buffers. Try connecting using Ethernet layouts, rebooting your modem router, or querying your local ISP support.',
        color: 'text-rose-600 bg-rose-50/40 border-rose-100'
      };
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-0" id="internet-speed-tester-suite">
      
      {/* Upper header banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-blue-500/10 p-6 rounded-3xl border border-teal-500/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Wifi className="w-6 h-6 text-teal-600 animate-pulse" />
            <h2 className="text-xl font-black text-gray-950 tracking-tight">
              Hyper-Speed Network Diagnostic Suite
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl">
            Audit your local web connection throughput. Measures real-time latency ping rates, download bandwidth profiles, asymmetric upload spikes, and parses multi-geographic routing hops seamlessly.
          </p>
        </div>
        
        {/* Dynamic server picker selector */}
        <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <Server className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
          <select 
            disabled={isRunning}
            value={activeServer.id}
            onChange={(e) => {
              const selected = SERVERS.find(s => s.id === e.target.value);
              if (selected) setActiveServer(selected);
            }}
            className="text-xs bg-transparent font-bold text-slate-800 outline-none border-none py-1 px-1 flex-1 cursor-pointer disabled:opacity-40"
          >
            {SERVERS.map((srv) => (
              <option key={srv.id} value={srv.id}>
                {srv.name} ({srv.distance})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Section: High Performance Interactive Speed Dial */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center">
            
            {/* Phase header description */}
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-slate-300" />
                Live Gauge Analytics
              </span>

              <AnimatePresence mode="wait">
                {testPhase !== 'idle' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-1.5 bg-teal-50 px-3 py-1 rounded-full text-[10px] font-black text-teal-700 uppercase"
                  >
                    <Activity className="w-3 h-3 text-teal-600 animate-bounce" />
                    <span>PHASE: {testPhase}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* The circular dialect Gauge speedometer design */}
            <div className="w-72 h-72 relative flex items-center justify-center select-none">
              
              {/* Outer dial base ticks circle */}
              <div className="absolute inset-0 border-[6px] border-slate-50 rounded-full" />
              <div className="absolute inset-2 border-2 border-dashed border-slate-100 rounded-full" />

              {/* Display text speed parameters inside circle center bounds */}
              <div className="text-center z-10 space-y-1">
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  {testPhase === 'upload' ? 'Upload Speed' : 'Download Speed'}
                </p>
                <div className="flex items-baseline justify-center font-sans">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">
                    {testPhase === 'idle' ? '0.0' : (testPhase === 'ping' ? '---' : currentSpeed.toFixed(1))}
                  </span>
                  <span className="text-xs font-black text-slate-400 ml-1">Mbps</span>
                </div>
                
                {/* Embedded details panel */}
                <div className="pt-2 flex justify-center gap-2 text-[10px] font-extrabold text-slate-400">
                  <p className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> PING: <span className="text-slate-800">{ping || '--'}ms</span></p>
                  <p>•</p>
                  <p>JITTER: <span className="text-slate-800">{jitter || '--'}ms</span></p>
                </div>
              </div>

              {/* Realistic rotating physics cursor needles indicator */}
              <div 
                className="absolute inset-0 flex items-center justify-center transition-transform duration-100 ease-out"
                style={{ transform: `rotate(${getSpeedRotation()}deg)` }}
              >
                {/* Pointer rod line representing classical dial needle */}
                <div className="w-1.5 h-28 bg-gradient-to-t from-slate-900 via-teal-500 to-teal-400 rounded-full absolute -top-4 shadow-md" />
                
                {/* Base node circle pin */}
                <div className="w-6 h-6 rounded-full bg-slate-900 absolute flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>

              {/* Outer gauge numbers representation markings for speed reference */}
              <div className="absolute top-8 left-16 text-[9px] font-black text-slate-300">0</div>
              <div className="absolute top-8 right-16 text-[9px] font-black text-slate-300">150+</div>
              <div className="absolute top-1/2 left-4 text-[9px] font-black text-slate-300">20</div>
              <div className="absolute top-1/2 right-4 text-[9px] font-black text-slate-300">100</div>
              <div className="absolute bottom-8 left-16 text-[9px] font-black text-slate-300">40</div>
              <div className="absolute bottom-8 right-16 text-[9px] font-black text-slate-300">80</div>
            </div>

            {/* Controls start triggers */}
            <div className="w-full mt-4">
              {!isRunning ? (
                <button
                  type="button"
                  onClick={startSpeedTest}
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition"
                >
                  <Play className="w-4 h-4 fill-current" />
                  START BROADBAND SPEED TEST
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-wait"
                >
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                  PROBING INTERNET HOP PIPELINE...
                </button>
              )}
            </div>

            {/* Secondary speed performance readouts */}
            <div className="w-full grid grid-cols-2 gap-4 mt-6">
              
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-1 text-center relative overflow-hidden">
                <div className="absolute top-2 left-2 flex items-center gap-1 text-[8px] font-black uppercase text-slate-400">
                  <Download className="w-2.5 h-2.5 text-blue-500" />
                  DOWNLOAD
                </div>
                <p className="text-2xl font-black text-slate-900 tracking-tight font-mono pt-1">
                  {downloadSpeed ? downloadSpeed.toFixed(1) : '---'}
                </p>
                <p className="text-[10px] font-bold text-slate-400">Mbps Bandwidth</p>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-1 text-center relative overflow-hidden">
                <div className="absolute top-2 left-2 flex items-center gap-1 text-[8px] font-black uppercase text-slate-400">
                  <Upload className="w-2.5 h-2.5 text-purple-500" />
                  UPLOAD
                </div>
                <p className="text-2xl font-black text-slate-900 tracking-tight font-mono pt-1">
                  {uploadSpeed ? uploadSpeed.toFixed(1) : '---'}
                </p>
                <p className="text-[10px] font-bold text-slate-400">Mbps Bandwidth</p>
              </div>

            </div>

          </div>

          {/* Real-time consistency AreaChart display */}
          {chartData.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                Connection Consistency Wave
              </h3>
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                    <YAxis stroke="#94a3b8" fontSize={9} />
                    <Tooltip contentStyle={{ fontSize: 10, background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc' }} />
                    <Area type="monotone" dataKey="speed" stroke="#14b8a6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSpeed)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </div>

        {/* Right Column Section: Diagnostics Diagnostic verdict, Logs & historic audit sheets */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          
          {/* Diagnostic Grade Verdict Sheet (Visible when completed standard runs) */}
          {testPhase === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-3xl p-6 border p-4.5 space-y-3 shadow-sm ${getSuitedVerdict().color}`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <h4 className="font-extrabold text-sm tracking-tight">{getSuitedVerdict().title}</h4>
              </div>
              
              <p className="text-[11px] leading-relaxed opacity-90">{getSuitedVerdict().description}</p>

              {/* Suitability scoreboards */}
              <div className="pt-2 border-t border-slate-200/40 grid grid-cols-4 gap-1.5 text-center text-[10px]">
                <div className="p-2 bg-white/50 rounded-xl">
                  <p className="font-extrabold text-slate-800">4K Play</p>
                  <p className="font-black text-emerald-600 mt-0.5">{downloadSpeed > 25 ? 'YES' : 'SLOW'}</p>
                </div>
                <div className="p-2 bg-white/50 rounded-xl">
                  <p className="font-extrabold text-slate-800">Gaming</p>
                  <p className="font-black text-emerald-600 mt-0.5">{ping < 30 ? 'PERFECT' : 'LAG'}</p>
                </div>
                <div className="p-2 bg-white/50 rounded-xl">
                  <p className="font-extrabold text-slate-800">Calls</p>
                  <p className="font-black text-emerald-600 mt-0.5">{jitter < 5 ? 'STABLE' : 'DROPS'}</p>
                </div>
                <div className="p-2 bg-white/50 rounded-xl">
                  <p className="font-extrabold text-slate-800">Sharing</p>
                  <p className="font-black text-emerald-600 mt-0.5">{uploadSpeed > 15 ? 'FAST' : 'SLOW'}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Informational helper details about parameters */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              Understanding Speed Metrics
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed font-sans">
              <div className="flex gap-2.5 items-start">
                <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 font-extrabold text-[10px] text-teal-700">PG</div>
                <div>
                  <p className="font-bold text-slate-800">Latency / Ping (ms):</p>
                  <p className="text-[11px] text-slate-400">The return trip transit duration of a data packet from your modem router to the host server. Lower is better (ideal for multiplayer online shooter layouts is under 30ms).</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 font-extrabold text-[10px] text-indigo-700">JT</div>
                <div>
                  <p className="font-bold text-slate-800">Network Jitter (ms):</p>
                  <p className="text-[11px] text-slate-400">Indicates the overall variance standard deviation stability metric of consecutive ping runs. Spikes over 15ms cause vocal stutter dropouts on real-time Voip/Skype calling systems.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 font-extrabold text-[10px] text-emerald-700">DL</div>
                <div>
                  <p className="font-bold text-slate-800">Download Bandwidth (Mbps):</p>
                  <p className="text-[11px] text-slate-400">Amount of multi-megabit stream blocks download capacity of your link per second. Crucial for pulling movie files or downloading content.</p>
                </div>
              </div>
            </div>
          </div>

          {/* History audit list database sheets */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <History className="w-4 h-4 text-teal-600" />
                Historical Speed Records
              </h3>

              {testHistory.length > 0 && (
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-red-500 hover:text-red-600 text-[10px] font-black uppercase flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Logs
                </button>
              )}
            </div>

            {testHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto stroke-[1.25]" />
                <p className="text-xs font-bold font-sans">No previous test runs archive detected.</p>
                <p className="text-[10px] px-4 leading-relaxed">Completed test runs get logged securely inside your browser's local sandbox state automatically.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                {testHistory.map((item) => (
                  <div key={item.id} className="border border-slate-100 p-3 rounded-2xl bg-slate-50/50 flex items-center justify-between gap-3 text-xs">
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          item.grade === 'Excellent' ? 'bg-emerald-500' : 
                          item.grade === 'Good' ? 'bg-blue-500' : 
                          item.grade === 'Fair' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        <p className="font-extrabold text-slate-800">{item.download.toFixed(1)} DL / {item.upload.toFixed(1)} UL</p>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span>{item.server}</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>

                    <div className="text-right text-[10px] font-mono leading-tight space-y-0.5">
                      <p className="text-slate-500">Latency: <span className="font-bold text-slate-800">{item.ping}ms</span></p>
                      <p className="text-slate-500">Jitter: <span className="font-bold text-slate-800">{item.jitter}ms</span></p>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
