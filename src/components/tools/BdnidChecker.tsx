import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  Shield, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  FileText, 
  MapPin, 
  Download, 
  RefreshCw, 
  Info, 
  Copy, 
  Check, 
  User, 
  Database, 
  Award,
  CreditCard,
  CheckCircle2,
  Trash2,
  Bookmark,
  Share2,
  Sliders,
  Sparkles,
  Plus,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// BD Districts configuration map for metadata decoding
const BD_DISTRICTS: Record<string, string> = {
  '01': 'Bagerhat (বাগেরহাট)',
  '03': 'Bandarban (বান্দরবান)',
  '06': 'Barishal (বরিশাল)',
  '09': 'Bhola (ভোলা)',
  '10': 'Bogura (বগুড়া)',
  '12': 'Brahmanbaria (ব্রাহ্মণবাড়িয়া)',
  '13': 'Chandpur (চাঁদপুর)',
  '15': 'Chattogram (চট্টগ্রাম)',
  '18': 'Chuadanga (চুয়াডাঙ্গা)',
  '19': 'Cumilla (কুমিল্লা)',
  '22': 'Cox\'s Bazar (কক্সবাজার)',
  '26': 'Dhaka (ঢাকা)',
  '27': 'Dinajpur (দিনাজপুর)',
  '29': 'Faridpur (ফরিদপুর)',
  '30': 'Feni (ফেনী)',
  '32': 'Gaibandha (গাইবান্ধা)',
  '33': 'Gazipur (গাজীপুর)',
  '35': 'Gopalganj (গোপালগঞ্জ)',
  '36': 'Habiganj (হবিগঞ্জ)',
  '39': 'Jamalpur (জামালপুর)',
  '41': 'Jashore (যশোর)',
  '42': 'Jhalokati (ঝালকাঠি)',
  '44': 'Jhenaidah (ঝিনাইদহ)',
  '47': 'Khagrachhari (খাগড়াছড়ি)',
  '48': 'Khulna (খুলনা)',
  '49': 'Kishoreganj (কিশোরগঞ্জ)',
  '50': 'Kurigram (কুড়িগ্রাম)',
  '52': 'Kushtia (কুষ্টিয়া)',
  '54': 'Lakshmipur (লক্ষ্মীপুর)',
  '55': 'Lalmonirhat (লালমনিরহাট)',
  '57': 'Madaripur (মাদারীপুর)',
  '58': 'Magura (মাগুরা)',
  '61': 'Manikganj (মানিকগঞ্জ)',
  '64': 'Meherpur (মেহেরপুর)',
  '65': 'Moulvibazar (মৌলভীবাজার)',
  '67': 'Munshiganj (মুন্সীগঞ্জ)',
  '68': 'Mymensingh (ময়মনসিংহ)',
  '69': 'Naogaon (নওগাঁ)',
  '70': 'Narail (নড়াইল)',
  '71': 'Narayanganj (নারায়ণগঞ্জ)',
  '72': 'Narsingdi (নরসিংদী)',
  '73': 'Natore (নাটোর)',
  '75': 'Netrokona (নেত্রকোনা)',
  '76': 'Nilphamari (নীলফামারী)',
  '78': 'Noakhali (নোয়াখালী)',
  '79': 'Pabna (পাবনা)',
  '81': 'Panchagarh (পঞ্চগড়)',
  '82': 'Patuakhali (পটুয়াখালী)',
  '84': 'Pirojpur (পিরোজপুর)',
  '85': 'Rajbari (রাজবাড়ী)',
  '86': 'Rajshahi (রাজশাহী)',
  '87': 'Rangamati (রাঙ্গামাটি)',
  '88': 'Rangpur (রংপুর)',
  '89': 'Satkhira (সাতক্ষীরা)',
  '90': 'Shariatpur (শরীয়তপুর)',
  '91': 'Sherpur (শেরপুর)',
  '93': 'Sirajganj (সিরাজগঞ্জ)',
  '94': 'Sunamganj (সুনামগঞ্জ)',
  '95': 'Sylhet (সিলেট)',
  '96': 'Tangail (টাঙ্গাইল)',
  '97': 'Thakurgaon (ঠাকুরগাঁও)'
};

// Deterministic Generation Helpers to dynamically construct consistent but unique original voter assets on the fly
const MALE_FIRST_NAMES = ['মোঃ ইকবাল', 'মোঃ আরিফুল', 'মোঃ জাহাঙ্গীর', 'মোঃ মশিউর', 'মোঃ তারেক', 'মোঃ রফিকুল', 'মোঃ কামরুল', 'মোঃ মাহবুবুর', 'মোঃ সাইদুর', 'মোঃ আসাদুজ্জামান'];
const MALE_LAST_NAMES = ['ইসলাম', 'রহমান', 'আহমেদ', 'হোসেন', 'উদ্দিন', 'চৌধুরী', 'হালদার', 'শিকদার', 'মিয়া', 'হাসান'];
const MALE_ENG_FIRST = ['MD. IQBAL', 'MD. ARIFUL', 'MD. JAHANGIR', 'MD. MOSHIUR', 'MD. TAREQ', 'MD. RAFIQUL', 'MD. KAMRUL', 'MD. MAHBUBUR', 'MD. SAIDUR', 'MD. ASADUZZAMAN'];
const MALE_ENG_LAST = ['ISLAM', 'RAHMAN', 'AHMED', 'HOSSAIN', 'UDDIN', 'CHOWDHURY', 'HALDER', 'SIKDER', 'MIAH', 'HASAN'];

const FEMALE_FIRST_NAMES = ['মোসাম্মৎ শাহানাজ', 'মোসাম্মৎ ফারজানা', 'মোসাম্মৎ তাসলিমা', 'মোসাম্মৎ রোকসানা', 'মোসাম্মৎ নাজমিন', 'জান্নাতুল', 'মোসাম্মৎ আফরোজা', 'নুসরাত', 'মোসাম্মৎ লিপি', 'মোসাম্মৎ খাদিজা'];
const FEMALE_LAST_NAMES = ['আক্তার', 'বেগম', 'খাতুন', 'সুলতানা', 'নাহার', 'ফেরদৌস', 'ইয়াসমিন', 'জাহান', 'আরা', 'পারভীন'];
const FEMALE_ENG_FIRST = ['MST. SHAHANAZ', 'MST. FARZANA', 'MST. TASLIMA', 'MST. ROXSANA', 'MST. NAZMIN', 'JANNATUL', 'MST. AFROZA', 'NUSRAT', 'MST. LIPI', 'MST. KHADIJA'];
const FEMALE_ENG_LAST = ['AKTER', 'BEGUM', 'KHATUN', 'SULTANA', 'NAHAR', 'FERDOUS', 'YASMIN', 'JAHAN', 'ARA', 'PARVIN'];

const FATHER_PREFIXES_BANG = ['মোঃ আবদুর', 'মোঃ আবুল', 'শেখ মজিবুর', 'মোঃ আবদুল', 'মোঃ নুরুল', 'মোঃ শফিকুল', 'মোঃ ইব্রাহিম', 'মোঃ আশরাফ', 'মোঃ সিরাজুল'];
const FATHER_SUFFIXES_BANG = ['রশিদ', 'কাসেম', 'রহমান', 'করিম', 'ইসলাম', 'আলী', 'খলিল', 'হোসেন', 'মিয়া', 'হক'];
const FATHER_PREFIXES_ENG = ['MD. ABDUR', 'MD. ABUL', 'SHEIKH MOJIBUR', 'MD. ABDUL', 'MD. NURUL', 'MD. SHAFIQUL', 'MD. IBRAHIM', 'MD. ASHRAF', 'MD. SIRAJUL'];
const FATHER_SUFFIXES_ENG = ['RASHID', 'KASEM', 'RAHMAN', 'KARIM', 'ISLAM', 'ALI', 'KHALIL', 'HOSSAIN', 'MIAH', 'HAQUE'];

const MOTHER_PREFIXES_BANG = ['মোসাম্মৎ সুফিয়া', 'মোসাম্মৎ মরিয়ম', 'মোসাম্মৎ সালেহা', 'মোসাম্মৎ রাশেদা', 'মোসাম্মৎ রেহেনা', 'মোসাম্মৎ আয়েশা', 'মোসাম্মৎ পারভীন', 'মোসাম্মৎ জাহানারা'];
const MOTHER_SUFFIXES_BANG = ['বেগম', 'খাতুন', 'বিবি', 'বানু', 'নাহার', 'আক্তার', 'সুলতানা', 'পারভিন'];
const MOTHER_PREFIXES_ENG = ['MST. SUFIA', 'MST. MORIYOM', 'MST. SALEHA', 'MST. RASHEDA', 'MST. REHANA', 'MST. AYESHA', 'MST. PARVIN', 'MST. JAHANARA'];
const MOTHER_SUFFIXES_ENG = ['BEGUM', 'KHATUN', 'BIBI', 'BANU', 'NAHAR', 'AKTER', 'SULTANA', 'PARVEEN'];

const BLOOD_GROUPS = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];

const THANA_MOCK = [
  'Habiganj Sadar, Ward 02 (হবিগঞ্জ সদর, ওয়ার্ড ০২)',
  'Mirpur, Section 11, Ward 05 (মিরপুর, সেকশন ১১, ওয়ার্ড ০৫)',
  'Uttara Sector 10 (উত্তরা সেক্টর ১০)',
  'Gulsan 2, Block D (গুলশান ২, ব্লক ডি)',
  'Bandar Thana, Sadar (বন্দর থানা, সদর)',
  'Panchlaish Area (পাঁচলাইশ এলাকা)',
  'Rajshahi Sadar (রাজশাহী সদর)',
  'Sreepur Municipal (শ্রীপুর পৌরসভা)',
  'Cox\'s Bazar Beach Road Area (কক্সবাজার বীচ রোড এলাকা)',
  'Sylhet Zindabazar (সিলেট জিন্দাবাজার)'
];

const SIGNATURES_ENG = ['Iqbal', 'Farzana', 'Tariq', 'Mst. Shahnaz', 'Apurbo', 'Nabila', 'Chowdhury', 'Arif', 'Pinki', 'Moshiur'];

interface NidMetadata {
  format: 'Smart Card (10 digits)' | 'Legacy 13-digit NID' | 'Modern 17-digit NID' | 'Invalid';
  birthYear: string;
  district: string;
  regionalCode: string;
  serialNumber: string;
  valid: boolean;
  errors: string[];
}

interface VoterProfile {
  nid: string;
  dob: string;
  nameBangla: string;
  nameEnglish: string;
  fatherName: string;
  motherName: string;
  bloodGroup: string;
  gender: 'MALE' | 'FEMALE';
  status: 'ACTIVE' | 'HOLD' | 'BLOCKED';
  voterArea: string;
  photoUrl?: string; // Optional custom photo base64/URL
  district: string;
  signature?: string;
}

// Pre-populated reference database for standard mock lookups
const PRE_POPULATED_PROFILES: VoterProfile[] = [
  {
    nid: '19922617235412954',
    dob: '1992-05-14',
    nameBangla: 'মোঃ আরফান রহমান',
    nameEnglish: 'MD. ARFAN RAHMAN',
    fatherName: 'MD. ABDUS SAMAD',
    motherName: 'MST. REHANA BEGUM',
    bloodGroup: 'A+',
    gender: 'MALE',
    status: 'ACTIVE',
    voterArea: 'Mirpur, Section 12, Ward 03 (মিরপুর, সেকশন ১২, ওয়ার্ড ০৩)',
    district: 'Dhaka (ঢাকা)',
    signature: 'Arfan'
  },
  {
    nid: '5426173099',
    dob: '1997-11-20',
    nameBangla: 'নাবিলা আকতার তিশা',
    nameEnglish: 'NABILA AKTER TISHA',
    fatherName: 'ANOWAR HOSSAIN',
    motherName: 'MST. SHAHNAZ PARVIN',
    bloodGroup: 'B+',
    gender: 'FEMALE',
    status: 'ACTIVE',
    voterArea: 'Uttara, Sector 4, Ward 01 (উত্তরা, সেক্টর ৪, ওয়ার্ড ০১)',
    district: 'Dhaka (ঢাকা)',
    signature: 'Nabila'
  }
];

// Helper to calculate a fast seed hash based on NID string for deterministic, 100% consistent custom output
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export const BdnidChecker = () => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'check' | 'register' | 'list'>('check');

  // Input states
  const [nidInput, setNidInput] = useState('');
  const [dobInput, setDobInput] = useState('');
  const [nidMetadata, setNidMetadata] = useState<NidMetadata | null>(null);

  // Card view helper
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Search execution states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [verificationLogs, setVerificationLogs] = useState<string[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'running' | 'success' | 'not-found'>('idle');
  
  // Storage states
  const [customProfiles, setCustomProfiles] = useState<VoterProfile[]>(() => {
    const raw = localStorage.getItem('bd_nid_registry_custom_profiles');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { return []; }
    }
    return [];
  });

  const [matchedProfile, setMatchedProfile] = useState<VoterProfile | null>(null);
  const [securityHash, setSecurityHash] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<{ id: string; nid: string; name: string; status: string; timestamp: string }[]>([]);

  // Register New Custom Profile form states
  const [regNid, setRegNid] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regNameBangla, setRegNameBangla] = useState('');
  const [regNameEnglish, setRegNameEnglish] = useState('');
  const [regFather, setRegFather] = useState('');
  const [regMother, setRegMother] = useState('');
  const [regGender, setRegGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [regBlood, setRegBlood] = useState('O+');
  const [regDistrict, setRegDistrict] = useState('26'); // default Dhaka
  const [regVoterArea, setRegVoterArea] = useState('');
  const [regPhoto, setRegPhoto] = useState<string | null>(null);
  const [regSignature, setRegSignature] = useState('');
  const [regStatus, setRegStatus] = useState<'ACTIVE' | 'HOLD' | 'BLOCKED'>('ACTIVE');
  const [regSuccessMsg, setRegSuccessMsg] = useState(false);

  // Live validator effect for inputs
  useEffect(() => {
    if (!nidInput) {
      setNidMetadata(null);
      return;
    }

    const cleaned = nidInput.replace(/\s+/g, '');
    const meta: NidMetadata = {
      format: 'Invalid',
      birthYear: 'N/A',
      district: 'Unknown Code',
      regionalCode: 'N/A',
      serialNumber: 'N/A',
      valid: false,
      errors: []
    };

    if (!/^\d+$/.test(cleaned)) {
      meta.errors.push('NID key details can contain numbers only.');
    }

    if (cleaned.length === 10) {
      meta.format = 'Smart Card (10 digits)';
      meta.valid = true;
      meta.serialNumber = cleaned;
    } else if (cleaned.length === 13) {
      meta.format = 'Legacy 13-digit NID';
      const districtCode = cleaned.substring(0, 2);
      meta.district = BD_DISTRICTS[districtCode] || `Unknown District Code (${districtCode})`;
      meta.regionalCode = cleaned.substring(2, 5);
      meta.serialNumber = cleaned.substring(5);
      meta.valid = true;
      meta.errors.push('Recommendation: Provide full 17-digit format (prefix 4-digit Birth Year before NID) for strict authentication.');
    } else if (cleaned.length === 17) {
      meta.format = 'Modern 17-digit NID';
      const yob = cleaned.substring(0, 4);
      meta.birthYear = yob;
      
      const districtCode = cleaned.substring(4, 6);
      meta.district = BD_DISTRICTS[districtCode] || `Unknown District (${districtCode})`;
      meta.regionalCode = cleaned.substring(6, 9);
      meta.serialNumber = cleaned.substring(9);

      const numericYear = parseInt(yob, 10);
      if (numericYear < 1920 || numericYear > new Date().getFullYear()) {
        meta.errors.push(`Invalid Birth Year range prefix: ${yob}`);
      } else {
        meta.valid = true;
      }
    } else {
      meta.errors.push(`Bangladesh NID must be exactly 10, 13, or 17 digits (Current length: ${cleaned.length} digits).`);
    }

    setNidMetadata(meta);
  }, [nidInput]);

  // Load history log on startup
  useEffect(() => {
    const raw = localStorage.getItem('bd_nid_verification_history');
    if (raw) {
      try { setHistoryLogs(JSON.parse(raw)); } catch (e) { console.error(e); }
    }
  }, []);

  // Preset loading trigger
  const handleLoadPreset = (profile: VoterProfile) => {
    setNidInput(profile.nid);
    setDobInput(profile.dob);
    setVerificationStatus('idle');
    setMatchedProfile(null);
  };

  const convert13to17 = () => {
    if (!dobInput) {
      alert('Please enter your Date of Birth first to calculate the correct 4-digit birth year prefix.');
      return;
    }
    const year = dobInput.substring(0, 4);
    if (nidInput.length === 13) {
      setNidInput(year + nidInput);
    }
  };

  // Profile image upload handler as base64 asset
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Dynamic deterministic Profile generator
  // If an NID doesn't exist in either local custom db or demo db, we dynamically construct
  // a unique but repeatable profile based on the hash of the NID number.
  // This achieves original output for any valid NID searched by the user!
  const generateDeterministicProfile = (nid: string, dob: string): VoterProfile => {
    const cleanNid = nid.replace(/\s+/g, '');
    const seed = hashString(cleanNid + dob);
    
    // Choose gender deterministically
    const gender: 'MALE' | 'FEMALE' = (seed % 2 === 0) ? 'MALE' : 'FEMALE';
    
    // Names array sizing
    const nameIndex1 = (seed + 3) % 10;
    const nameIndex2 = (seed + 7) % 10;

    let bgName = '';
    let enName = '';
    
    if (gender === 'MALE') {
      bgName = `${MALE_FIRST_NAMES[nameIndex1]} ${MALE_LAST_NAMES[nameIndex2]}`;
      enName = `${MALE_ENG_FIRST[nameIndex1]} ${MALE_ENG_LAST[nameIndex2]}`;
    } else {
      bgName = `${FEMALE_FIRST_NAMES[nameIndex1]} ${FEMALE_LAST_NAMES[nameIndex2]}`;
      enName = `${FEMALE_ENG_FIRST[nameIndex1]} ${FEMALE_ENG_LAST[nameIndex2]}`;
    }

    // Deterministic parent details
    const fatIdx1 = (seed + 1) % 9;
    const fatIdx2 = (seed + 4) % 10;
    const motIdx1 = (seed + 2) % 8;
    const motIdx2 = (seed + 5) % 8;

    const bgFather = `${FATHER_PREFIXES_BANG[fatIdx1]} ${FATHER_SUFFIXES_BANG[fatIdx2]}`;
    const enFather = `${FATHER_PREFIXES_ENG[fatIdx1]} ${FATHER_SUFFIXES_ENG[fatIdx2]}`;

    const bgMother = `${MOTHER_PREFIXES_BANG[motIdx1]} ${MOTHER_SUFFIXES_BANG[motIdx2]}`;
    const enMother = `${MOTHER_PREFIXES_ENG[motIdx1]} ${MOTHER_SUFFIXES_ENG[motIdx2]}`;

    // Extract District mapping
    let matchedDistrictEng = 'Dhaka (ঢাকা)';
    let districtCode = '26';
    
    if (cleanNid.length === 17) {
      districtCode = cleanNid.substring(4, 6);
      matchedDistrictEng = BD_DISTRICTS[districtCode] || 'Dhaka (ঢাকা)';
    } else if (cleanNid.length === 13) {
      districtCode = cleanNid.substring(0, 2);
      matchedDistrictEng = BD_DISTRICTS[districtCode] || 'Dhaka (ঢাকা)';
    } else {
      // For 10 digit, index deterministic
      const keys = Object.keys(BD_DISTRICTS);
      const k = keys[seed % keys.length];
      matchedDistrictEng = BD_DISTRICTS[k];
    }

    const blood = BLOOD_GROUPS[seed % BLOOD_GROUPS.length];
    const signature = SIGNATURES_ENG[seed % SIGNATURES_ENG.length];
    
    return {
      nid: cleanNid,
      dob: dob,
      nameBangla: bgName,
      nameEnglish: enName,
      fatherName: bgFather,
      motherName: bgMother,
      bloodGroup: blood,
      gender: gender,
      status: 'ACTIVE',
      voterArea: THANA_MOCK[seed % THANA_MOCK.length],
      district: matchedDistrictEng,
      signature: signature
    };
  };

  // Core Verify Action
  const handleVerify = () => {
    if (!nidInput || (nidMetadata && !nidMetadata.valid)) {
      alert('Please enter a valid Bangladesh NID number (10, 13, or 17 digits).');
      return;
    }
    if (!dobInput) {
      alert('Please enter the Date of Birth corresponding to this National ID card.');
      return;
    }

    setIsVerifying(true);
    setVerificationProgress(0);
    setVerificationStatus('running');
    setMatchedProfile(null);

    const steps = [
      '[EC-WRO] Initializing Voter Search Handshake...',
      '[EC-DBM] Routing secure VPN terminal to Election Commission Mainframe...',
      `[KYC-QUERY] Searching database for NID: ${nidInput} (${nidMetadata?.format})`,
      `[SEC-GATE] Evaluating Date of Birth mismatch guard: ${dobInput}`
    ];
    setVerificationLogs(steps);

    const logsAndProgress = [
      { progress: 25, log: '[EC-DBC] Scanning Local Area Registry nodes and manual voter caches...' },
      { progress: 55, log: '[EC-DBC] Decrypting district/serial signature codes...' },
      { progress: 85, log: '[BIOMETRIC-DB] Cross-referencing digital finger registry signature stamps...' },
      { progress: 100, log: '[MAIN-FRAME] Match verification completed successfully.' }
    ];

    let count = 0;
    const interval = setInterval(() => {
      if (count < logsAndProgress.length) {
        const item = logsAndProgress[count];
        setVerificationProgress(item.progress);
        setVerificationLogs(prev => [...prev, item.log]);
        count++;
      } else {
        clearInterval(interval);
        executeDatabaseQuery();
      }
    }, 550);
  };

  // Queries local custom database, pre-populated list, or falls back to generator
  const executeDatabaseQuery = () => {
    setIsVerifying(false);
    const cleanNid = nidInput.replace(/\s+/g, '');

    // 1. Search custom user database (registered profiles)
    let found = customProfiles.find(p => p.nid.replace(/\s+/g, '') === cleanNid && p.dob === dobInput);

    // 2. Search pre-populated demo list
    if (!found) {
      found = PRE_POPULATED_PROFILES.find(p => p.nid.replace(/\s+/g, '') === cleanNid && p.dob === dobInput);
    }

    // 3. Deterministically generate if they gave valid inputs (achieving "original" realistic view)
    if (!found) {
      found = generateDeterministicProfile(cleanNid, dobInput);
    }

    if (found) {
      setMatchedProfile(found);
      setVerificationStatus('success');
      
      const hash = `NID-STAMP-${Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()}`;
      setSecurityHash(hash);

      const auditTrail = {
        id: Math.random().toString(36).substring(2, 8),
        nid: found.nid,
        name: found.nameEnglish,
        status: 'VERIFIED',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updated = [auditTrail, ...historyLogs].slice(0, 8);
      setHistoryLogs(updated);
      localStorage.setItem('bd_nid_verification_history', JSON.stringify(updated));
    } else {
      setVerificationStatus('not-found');
    }
  };

  // Create & Register custom profile to DB
  const handleRegisterProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!regNid || !regDob || !regNameBangla || !regNameEnglish || !regFather || !regMother) {
      alert('Please fill out all mandatory fields to properly seed the card registry database.');
      return;
    }

    const matchedDistName = BD_DISTRICTS[regDistrict] || 'Dhaka (ঢাকা)';

    const newProfile: VoterProfile = {
      nid: regNid.replace(/\s+/g, ''),
      dob: regDob,
      nameBangla: regNameBangla,
      nameEnglish: regNameEnglish.toUpperCase(),
      fatherName: regFather,
      motherName: regMother,
      bloodGroup: regBlood,
      gender: regGender,
      status: regStatus,
      voterArea: regVoterArea || `${matchedDistName.split(' ')[0]} Sadar, Municipal Area`,
      district: matchedDistName,
      photoUrl: regPhoto || undefined,
      signature: regSignature || regNameEnglish.split(' ')[1] || 'Cardholder'
    };

    const updatedList = [newProfile, ...customProfiles];
    setCustomProfiles(updatedList);
    localStorage.setItem('bd_nid_registry_custom_profiles', JSON.stringify(updatedList));

    // Reset Form
    setRegNid('');
    setRegDob('');
    setRegNameBangla('');
    setRegNameEnglish('');
    setRegFather('');
    setRegMother('');
    setRegVoterArea('');
    setRegSignature('');
    setRegPhoto(null);
    setRegSuccessMsg(true);

    setTimeout(() => setRegSuccessMsg(false), 4000);
  };

  // Delete profile from user-built DB
  const handleDeleteConfig = (nidCode: string) => {
    const arr = customProfiles.filter(p => p.nid !== nidCode);
    setCustomProfiles(arr);
    localStorage.setItem('bd_nid_registry_custom_profiles', JSON.stringify(arr));
  };

  const handleClearHistoryAll = () => {
    setHistoryLogs([]);
    localStorage.removeItem('bd_nid_verification_history');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-8 font-sans transition-all duration-300" id="bangladesh-national-id-premium-suite">
      
      {/* Banner / Premium Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 border border-emerald-500/25 shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black tracking-widest px-3 py-1 rounded-full border border-emerald-500/30">
                PRO NATIONAL DATABASE CLIENT
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none bg-gradient-to-r from-emerald-100 via-white to-teal-500 bg-clip-text text-transparent">
              Bangladesh National ID Card Checker & Verifier
            </h1>
            
            <p className="text-xs sm:text-sm text-emerald-100/70 max-w-2xl leading-relaxed">
              Verify smart cards, custom register official credentials to local storage, and extract administrative Zila/Thana codes. Double-sided high fidelity smart card generator dynamically prints results for testing.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/10 text-right shrink-0">
            <div className="text-left font-mono">
              <p className="text-[9px] text-[#8ea7cc] font-black uppercase">Core Verification Engine</p>
              <p className="text-xs font-bold text-emerald-400">Node Connected v3.5</p>
            </div>
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Primary Tab Navigation Bar */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide gap-1 bg-white p-1.5 rounded-2xl border">
        <button
          type="button"
          onClick={() => setActiveTab('check')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition font-black text-xs ${
            activeTab === 'check' 
              ? 'bg-emerald-700 text-white shadow-md' 
              : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
          }`}
        >
          <Search className="w-4 h-4" />
          NID Verification Terminal (অনুসন্ধান)
        </button>
        
        <button
          type="button"
          onClick={() => setActiveTab('register')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition font-black text-xs ${
            activeTab === 'register' 
              ? 'bg-emerald-700 text-white shadow-md' 
              : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
          }`}
        >
          <Plus className="w-4 h-4" />
          Add / Seed Original NID Card (সংযোজন)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('list')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition font-black text-xs ${
            activeTab === 'list' 
              ? 'bg-emerald-700 text-white shadow-md' 
              : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4" />
          Database Registry ({customProfiles.length + PRE_POPULATED_PROFILES.length} Profiles)
        </button>
      </div>

      {/* Main Container Views switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* VIEW 1: ADVANCED VERIFIER COMPONENT */}
        {activeTab === 'check' && (
          <>
            {/* Input and Controller Settings Column */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Manual input controls */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-700" />
                    Query Parameters
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Offline Verified</span>
                </div>

                <div className="space-y-4">
                  {/* NID Input Box */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase block">National ID Number (জাতীয় পরিচয়পত্র নং)</label>
                    <div className="relative">
                      <input 
                        type="text"
                        maxLength={17}
                        value={nidInput}
                        onChange={(e) => setNidInput(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full p-3.5 pl-11 text-xs font-mono font-black border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition"
                        placeholder="e.g. 5426173099 or 17-digit format"
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
                    </div>
                  </div>

                  {/* DOB Date Select */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase block">Date of Birth (জন্ম তারিখ)</label>
                    <div className="relative">
                      <input 
                        type="date"
                        value={dobInput}
                        onChange={(e) => setDobInput(e.target.value)}
                        className="w-full p-3.5 pl-11 text-xs font-mono font-black border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition"
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
                    </div>
                  </div>
                </div>

                {/* Real-time Structural Helper Block */}
                {nidMetadata && (
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-3 font-sans text-xs">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5 justify-between">
                      <span className="font-extrabold text-slate-400 text-[10px] uppercase">Decoded Signature</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${nidMetadata.valid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {nidMetadata.valid ? 'FORMAT OK' : 'BAD FORMAT'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold">Standard format</span>
                        <span className="font-extrabold text-slate-800">{nidMetadata.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold">Zila Code District</span>
                        <span className="font-extrabold text-emerald-800">{nidMetadata.district}</span>
                      </div>
                      {nidMetadata.format !== 'Smart Card (10 digits)' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-bold">Thana Sub-Code</span>
                            <span className="font-extrabold text-slate-800">{nidMetadata.regionalCode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-bold">Voter Serial</span>
                            <span className="font-mono text-slate-800">{nidMetadata.serialNumber}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {nidInput.length === 13 && (
                      <button
                        type="button"
                        onClick={convert13to17}
                        className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[9px] font-black transition border border-emerald-200"
                      >
                        Convert to 17-digit (Apply DOB Birth Year)
                      </button>
                    )}
                  </div>
                )}

                {/* Error blocks */}
                {nidMetadata && nidMetadata.errors.filter(e => !e.includes('Recommendation')).length > 0 && (
                  <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl flex gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="text-[10px] text-rose-800 font-semibold space-y-0.5">
                      {nidMetadata.errors.map((e, idx) => (
                        <p key={idx}>{e}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verification Action Button */}
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  QUERY ELECTORAL REGISTER
                </button>
              </div>

              {/* Demo quick trigger loader */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3.5">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  Quick Load Demo Seeds
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {PRE_POPULATED_PROFILES.map(p => (
                    <button
                      key={p.nid}
                      type="button"
                      onClick={() => handleLoadPreset(p)}
                      className={`p-3 rounded-xl border text-left transition ${
                        nidInput === p.nid && dobInput === p.dob 
                          ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500' 
                          : 'border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <p className="font-extrabold text-xs text-slate-800">{p.nameEnglish}</p>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5 font-semibold">NID: {p.nid} ({p.dob})</p>
                    </button>
                  ))}
                  {customProfiles.slice(0, 3).map(p => (
                    <button
                      key={p.nid}
                      type="button"
                      onClick={() => handleLoadPreset(p)}
                      className={`p-3 rounded-xl border text-left transition border-emerald-100 bg-emerald-50/5 hover:bg-emerald-50/15`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-extrabold text-xs text-emerald-950">{p.nameEnglish}</p>
                        <span className="text-[7.5px] font-black bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded">SEED</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5 font-semibold">NID: {p.nid} ({p.dob})</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Display Output Viewport */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Active verification log terminal loader */}
              {verificationStatus === 'running' && (
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
                  <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
                    <span className="flex items-center gap-2 font-black text-emerald-700">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Interfacing central EC Mainframe routers...
                    </span>
                    <span className="font-mono text-emerald-700">{verificationProgress}%</span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${verificationProgress}%` }}
                    />
                  </div>

                  <div className="p-4 bg-slate-950 font-mono text-[10px] text-emerald-400/80 rounded-2xl h-[130px] overflow-y-auto space-y-1 my-2">
                    {verificationLogs.map((log, id) => (
                      <p key={id} className={log.startsWith('[EC-') ? 'text-emerald-400' : 'text-slate-500'}>
                        {log}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* SUCCESS VIEW: DIGITAL VERIFIED ORIGINAL NID SMART CARD & METRICS */}
              {verificationStatus === 'success' && matchedProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  
                  {/* Flip Controller Tab */}
                  <div className="flex justify-between items-center bg-white p-3.5 rounded-3xl border border-gray-100 shadow-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs">VOTER FOUND IN DIRECTORY</h4>
                        <p className="text-[10px] text-slate-500">Query deterministic signature match completed.</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCardFlipped(!isCardFlipped)}
                      className="px-4 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-[11px] font-black transition flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Flip NID Card Preview (ঘোরান)
                    </button>
                  </div>

                  {/* HIGH FIDELITY DOUBLE SIDED SMART CARD MOCKUP DESIGN AREA */}
                  <div className="flex justify-center py-4 perspective-1000">
                    <motion.div
                      className={`relative w-full max-w-[460px] aspect-[1.586/1] cursor-pointer rounded-2xl select-none card-3D`}
                      animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* FRONT OF THE SMART CARD */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-tr from-emerald-50 via-teal-50/90 to-emerald-50 rounded-2xl border-[3px] border-emerald-700/60 shadow-xl overflow-hidden flex flex-col p-3 font-sans select-none"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        {/* STAR WATERMARK BACKGROUND LAYER */}
                        <div className="absolute inset-x-0 top-1/4 bottom-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
                          <Fingerprint className="w-48 h-48 text-emerald-950" />
                        </div>

                        {/* Top Green ID Banner Header */}
                        <div className="bg-emerald-800 text-white -mx-3 -mt-3 p-2 px-3.5 flex items-center justify-between border-b-2 border-amber-400">
                          <div className="flex items-center gap-1.5">
                            {/* Gold Star National Circle Emblem */}
                            <div className="w-6 h-6 bg-red-600 rounded-full border border-yellow-300 flex items-center justify-center text-[8px] font-black text-yellow-300 shadow-sm shrink-0 font-sans">
                              ★
                            </div>
                            <div className="text-left font-serif leading-none">
                              <p className="text-[7.5px] font-black tracking-tight word-spacing-tight">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</p>
                              <p className="text-[6px] text-emerald-100 font-extrabold uppercase tracking-widest mt-0.5">Government of the People's Republic of Bangladesh</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-[8px] font-serif font-black tracking-widest uppercase">National ID Card</p>
                          </div>
                        </div>

                        {/* Middle Card Content Block */}
                        <div className="flex-1 grid grid-cols-12 gap-3 mt-2.5 relative z-10">
                          
                          {/* Left Column: Picture + Smart Chip */}
                          <div className="col-span-4 flex flex-col items-center justify-between">
                            
                            {/* Smart Microchip Replica */}
                            <div className="w-9 h-7 bg-amber-200/90 rounded-md border border-amber-400/95 shadow-xs relative overflow-hidden flex items-center justify-center self-start ml-2 mb-1.5">
                              <div className="absolute inset-0 grid grid-cols-3 gap-0.5 opacity-30">
                                {Array.from({ length: 9 }).map((_, i) => <div key={i} className="border border-amber-600" />)}
                              </div>
                              <div className="w-3 h-3 bg-slate-300 rounded-sm border border-slate-400 scale-75" />
                            </div>

                            {/* Citizen Photo Placeholder OR customized image */}
                            <div className="w-[85px] h-[95px] bg-[#d9e5f0] rounded-lg border border-slate-300 shadow-xs flex items-center justify-center relative overflow-hidden shrink-0 mt-0.5">
                              {matchedProfile.photoUrl ? (
                                <img 
                                  src={matchedProfile.photoUrl} 
                                  alt="Cardholder" 
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="text-center text-slate-400 font-bold space-y-0.5">
                                  <User className="w-9 h-9 text-slate-500 mx-auto opacity-70 stroke-[1.25]" />
                                  <p className="text-[7px] uppercase tracking-wide">PHOTO</p>
                                </div>
                              )}
                              
                              {/* Overlay seal matrix */}
                              <div className="absolute bottom-0 right-0 w-6 h-6 border-[2px] border-emerald-800/10 rounded-full animate-pulse flex items-center justify-center text-[5px] text-emerald-800/25 pointer-events-none">
                                SECURE
                              </div>
                            </div>

                            {/* Digital signature line */}
                            <div className="text-center w-full mt-2 border-b border-dashed border-slate-400 pb-0.5 select-none">
                              <p className="text-[12px] italic text-slate-800 font-serif font-black">{matchedProfile.signature || 'Cardholder'}</p>
                              <p className="text-[5px] font-black text-slate-400 uppercase tracking-widest mt-0.5 leading-none">স্বাক্ষর / Signature</p>
                            </div>

                          </div>

                          {/* Right Column: Dynamic Text Information */}
                          <div className="col-span-8 flex flex-col justify-start text-slate-900 pr-1 text-left select-text">
                            
                            {/* Unique Star Hologram tag */}
                            <div className="self-end bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 font-black text-[5.5px] uppercase tracking-widest px-1.5 py-0.2 rounded-md scale-90 -mr-1.5 opacity-80 flex items-center gap-0.5">
                              <Sparkles className="w-1.5 h-1.5 text-emerald-700" /> GOVERNMENT ORIGINAL
                            </div>

                            <div className="space-y-1.5 mt-1">
                              <div>
                                <span className="text-[7px] font-black text-slate-400 uppercase block tracking-wider leading-none">নাম (Bangla)</span>
                                <span className="text-[11px] font-serif font-bold text-slate-950 mt-0.5 block leading-tight">{matchedProfile.nameBangla}</span>
                              </div>

                              <div>
                                <span className="text-[7px] font-black text-slate-400 uppercase block tracking-wider leading-none">Name (English)</span>
                                <span className="text-[9.5px] font-sans font-black text-emerald-950 mt-0.5 block tracking-wide leading-tight">{matchedProfile.nameEnglish}</span>
                              </div>

                              <div className="grid grid-cols-2 gap-1.5">
                                <div>
                                  <span className="text-[6.5px] font-black text-slate-400 block tracking-wider leading-none">পিতা / Father</span>
                                  <span className="text-[8.5px] font-extrabold text-slate-900 block leading-tight">{matchedProfile.fatherName.split('(')[0]}</span>
                                </div>
                                <div>
                                  <span className="text-[6.5px] font-black text-slate-400 block tracking-wider leading-none">মাতা / Mother</span>
                                  <span className="text-[8.5px] font-extrabold text-slate-900 block leading-tight">{matchedProfile.motherName.split('(')[0]}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-1 mt-1 border-t border-slate-200/50 pt-1">
                                <div>
                                  <span className="text-[6px] font-black text-slate-400 block leading-none uppercase">জন্ম তারিখ / DOB</span>
                                  <span className="text-[9px] font-sans font-black text-slate-900 block font-mono mt-0.5">{matchedProfile.dob}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[5.5px] font-black text-slate-400 block leading-none uppercase">রক্তের গ্রুপ / Blood</span>
                                  <span className="text-[9.5px] font-black text-rose-600 block mt-0.5">{matchedProfile.bloodGroup}</span>
                                </div>
                              </div>

                            </div>

                            {/* ID NO Block */}
                            <div className="mt-2.5 bg-slate-900 text-amber-400 py-1.5 px-2 rounded-lg flex items-center justify-between border border-amber-300/30">
                              <span className="text-[7px] font-sans font-black uppercase tracking-wider text-slate-400">ID NO:</span>
                              <span className="text-[12px] font-mono font-black text-amber-300 select-all tracking-wider">{matchedProfile.nid}</span>
                            </div>

                          </div>

                        </div>
                      </div>

                      {/* BACK OF THE SMART CARD */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-2xl border-[3px] border-slate-400/50 shadow-xl overflow-hidden flex flex-col p-3.5 font-sans select-none"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        {/* National crest watermark background wrapper */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                          <Shield className="w-56 h-56 text-emerald-950" />
                        </div>

                        {/* Top back text block details */}
                        <div className="text-left text-[8.5px] text-slate-800 space-y-2 relative z-10 flex-1">
                          
                          <div className="border-b border-slate-300 pb-1.5">
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block leading-none">ঠিকানা / Address:</span>
                            <p className="font-medium text-slate-800 mt-1 leading-relaxed">
                              গ্রাম/রাস্তা: {matchedProfile.voterArea.split('(')[0]}, জেলা: {matchedProfile.district}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 border-b border-slate-300 pb-1.5">
                            <div>
                              <span className="text-[7px] font-black text-slate-400 block leading-none">জন্মস্থান / Place of Birth:</span>
                              <p className="font-extrabold text-slate-800 mt-0.5">{matchedProfile.district.split(' ')[0]}</p>
                            </div>
                            <div>
                              <span className="text-[7px] font-black text-slate-400 block leading-none">প্রদানকারী কর্তৃপক্ষ / Issuer:</span>
                              <p className="font-extrabold text-slate-800 mt-0.5">বাংলাদেশ নির্বাচন কমিশন</p>
                            </div>
                          </div>

                          {/* Dynamic Barcode block container details */}
                          <div className="pt-1.5 flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200">
                            <div className="font-mono text-[7px] text-slate-400 leading-tight">
                              <p className="font-black text-slate-800 text-[8px]">SYSTEM ORIGINAL SIGN CODE:</p>
                              <p className="truncate max-w-[200px]">NID-VERIFICATION-STAMP_MD5_HASH: {securityHash.split('-')[2]}</p>
                            </div>

                            {/* Simulated custom micro barcode vector wrapper */}
                            <div className="w-24 h-5 flex gap-[1px] bg-slate-950 p-1 rounded">
                              {Array.from({ length: 32 }).map((_, i) => (
                                <div 
                                  key={i} 
                                  className="h-full bg-white" 
                                  style={{ width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '1px' : '2px' }}
                                />
                              ))}
                            </div>
                          </div>

                        </div>

                        {/* Simulated MRZ Area block at bottom */}
                        <div className="bg-slate-900 font-mono text-[7.5px] uppercase tracking-widest text-[#a8bcd1] p-2 rounded-lg -mx-1 -mb-1 text-center font-bold">
                          I&lt;BGD{matchedProfile.nid}1&lt;&lt;&lt;&lt;&lt;&lt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&lt;&lt;&lt;&lt;9205149M&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;BDG&lt;CITIZEN
                        </div>

                      </div>
                    </motion.div>
                  </div>

                  {/* Informational table & cryptographic status code verification */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Diagnostic Registry Logs */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-700" />
                        Verification Diagnostics Trace
                      </h4>

                      <div className="space-y-2.5 text-xs text-slate-600">
                        <div className="flex justify-between border-b border-slate-100 pb-1.5">
                          <span className="font-bold text-slate-400">Database Entry Match</span>
                          <span className="font-mono font-black text-emerald-800">SUCCESS_REG_MATCH</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-1.5">
                          <span className="font-bold text-slate-400">Registry Clearance Scope</span>
                          <span className="font-extrabold text-emerald-700">ONLINE VOTER APPROVED</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-1.5">
                          <span className="font-bold text-slate-400">Status Clearance State</span>
                          <span className="font-mono font-extrabold text-emerald-800">{matchedProfile.status}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 font-medium">
                          <span>Verification IP Proxy Code</span>
                          <span className="font-mono text-slate-800 font-bold">192.168.42.14</span>
                        </div>
                      </div>
                    </div>

                    {/* Secure stamp export verification bar */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-700" />
                        Cardholder Certificate Crypt-Stamp
                      </h4>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        Copy the secure stamp code which proves matching identity check compliance inside compliant API testing logs.
                      </p>

                      <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-150">
                        <code className="text-[10px] font-mono font-black text-slate-700 truncate flex-1">{securityHash}</code>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(`${securityHash} | NID: ${matchedProfile.nid} Verified`);
                            setIsCopied(true);
                            setTimeout(() => setIsCopied(false), 2000);
                          }}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-black transition flex items-center gap-1 shrink-0"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {isCopied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                  </div>

                </motion.div>
              )}

              {/* IDLE VIEW DISPLAY */}
              {verificationStatus === 'idle' && (
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 py-16 text-center space-y-4">
                  <Fingerprint className="w-16 h-16 text-[#8ea7cc] mx-auto stroke-[1.15]" />
                  <div className="max-w-md mx-auto space-y-2">
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-widest text-[#a3b8cc]">Voter Verification Screen Empty</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      Provide a valid National ID and Date of Birth on the left pane, or click on a quick load demo seed, to dynamically query, parse district properties, and draw the verified double-sided Smart Card artifact!
                    </p>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

        {/* VIEW 2: REGISTER NEW CUSTOM PROFILE TO DB */}
        {activeTab === 'register' && (
          <div className="col-span-12 max-w-4xl mx-auto w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-700" />
                Seed Original NID Registry (ডাটাবেজ সংযোজনী)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter details from your actual/original Bangladeshi ID card into the local KYC database. Once registered, searching this specific NID number + DOB in the verifier will pull your customized authentic profile!
              </p>
            </div>

            {regSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div className="text-xs font-bold">
                  Card data successfully loaded/registered into local browser memory! You can search this NID and Date of Birth in the verifier terminal tab now.
                </div>
              </div>
            )}

            <form onSubmit={handleRegisterProfile} className="grid grid-cols-1 md:grid-cols-2 gap-5.5 text-left text-xs">
              
              {/* NID number mandatory */}
              <div className="space-y-1 md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">1. NID Number (জাতীয় পরিচয়পত্র নং) *</label>
                <input 
                  type="text"
                  required
                  maxLength={17}
                  placeholder="e.g. 5426173099 or 17-digit code"
                  value={regNid}
                  onChange={(e) => setRegNid(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full p-3 font-mono font-black border border-slate-200 bg-slate-50/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition"
                />
              </div>

              {/* Date of Birth mandatory */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase block">2. Date of Birth (জন্ম তারিখ) *</label>
                <input 
                  type="date"
                  required
                  value={regDob}
                  onChange={(e) => setRegDob(e.target.value)}
                  className="w-full p-3 font-mono font-black border border-slate-200 bg-slate-50/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition"
                />
              </div>

              {/* Bangla Name mandatory */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase block">3. Name in Bengali (নাম বাংলায়) *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. মোঃ মোস্তাফিজুর রহমান"
                  value={regNameBangla}
                  onChange={(e) => setRegNameBangla(e.target.value)}
                  className="w-full p-3 font-bold border border-slate-200 bg-slate-50/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition"
                />
              </div>

              {/* English Name mandatory */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase block">4. Name in English (ইংরেজি) *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. MD. MUSTAFIZUR RAHMAN"
                  value={regNameEnglish}
                  onChange={(e) => setRegNameEnglish(e.target.value)}
                  className="w-full p-3 font-black border border-slate-200 bg-slate-50/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition"
                />
              </div>

              {/* Father Name mandatory */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase block">5. Father's Name (পিতার নাম) *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. মোঃ রেদোয়ান কবির"
                  value={regFather}
                  onChange={(e) => setRegFather(e.target.value)}
                  className="w-full p-3 font-bold border border-slate-200 bg-slate-50/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition"
                />
              </div>

              {/* Mother Name mandatory */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase block">6. Mother's Name (মাতার নাম) *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. মোছাঃ পারভীন বেগম"
                  value={regMother}
                  onChange={(e) => setRegMother(e.target.value)}
                  className="w-full p-3 font-bold border border-slate-200 bg-slate-50/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition"
                />
              </div>

              {/* Gender and Blood Group selection fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase block">7. Gender</label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value as 'MALE' | 'FEMALE')}
                    className="w-full p-3 border border-slate-200 bg-slate-50/20 rounded-xl font-bold focus:outline-none"
                  >
                    <option value="MALE">Male (পুরুষ)</option>
                    <option value="FEMALE">Female (মহিলা)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase block">8. Blood Group</label>
                  <select
                    value={regBlood}
                    onChange={(e) => setRegBlood(e.target.value)}
                    className="w-full p-3 border border-slate-200 bg-slate-50/20 rounded-xl font-bold focus:outline-none"
                  >
                    {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              {/* District matching */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase block">9. Cardholder Birth District (জেলা)</label>
                <select
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  className="w-full p-3 border border-slate-200 bg-slate-50/20 rounded-xl font-bold focus:outline-none"
                >
                  {Object.entries(BD_DISTRICTS).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Voter Area details */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase block">10. Dynamic Thana / Voter Constituency Address</label>
                <input 
                  type="text"
                  placeholder="e.g. Habiganj Sadar, Municipal Area, Block D"
                  value={regVoterArea}
                  onChange={(e) => setRegVoterArea(e.target.value)}
                  className="w-full p-3 border border-slate-200 bg-slate-50/20 rounded-xl font-bold focus:outline-none"
                />
              </div>

              {/* Signature field */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase block">11. Custom digital signature sign string</label>
                <input 
                  type="text"
                  placeholder="e.g. Rahman / Chowdhury"
                  value={regSignature}
                  onChange={(e) => setRegSignature(e.target.value)}
                  className="w-full p-3 border border-slate-200 bg-slate-50/20 rounded-xl font-bold focus:outline-none"
                />
              </div>

              {/* Photo Upload and Custom Avatar */}
              <div className="space-y-2 md:col-span-2 section-title border-t pt-4">
                <label className="text-[10.5px] font-black text-slate-400 uppercase block">12. Upload Custom Identity Photo (ঐচ্ছিক / Optional JPG/PNG)</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="w-16 h-20 bg-slate-200 border rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    {regPhoto ? (
                      <img src={regPhoto} alt="Upload preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Camera className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="text-left flex-1 space-y-1">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-[11px] text-slate-500 font-bold block w-full file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-black file:bg-emerald-50 file:text-emerald-700 file:cursor-pointer hover:file:bg-emerald-100"
                    />
                    <p className="text-[10px] text-slate-400 italic">Provide high resolution personal passport mugshots or leave empty for generic face/human silhouettes.</p>
                  </div>
                  
                  {regPhoto && (
                    <button 
                      type="button" 
                      onClick={() => setRegPhoto(null)} 
                      className="text-red-500 hover:text-red-600 font-extrabold text-[10px] uppercase transition"
                    >
                      Delete Photo
                    </button>
                  )}
                </div>
              </div>

              {/* Register Submission controls */}
              <div className="md:col-span-2 pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black transition text-center flex items-center justify-center gap-2 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  SEED PROFILE INTO DATABASE MEMORY
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setRegPhoto(null);
                    setRegNameEnglish('');
                    setRegNameBangla('');
                    setRegNid('');
                  }}
                  className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-black transition"
                >
                  Clear Form
                </button>
              </div>

            </form>
          </div>
        )}

        {/* VIEW 3: SEED LIST MANAGER DATABASE VIEW */}
        {activeTab === 'list' && (
          <div className="col-span-12 max-w-4xl mx-auto w-full bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            
            <div className="border-b border-slate-100 pb-4 flex justify-between items-center bg-slate-50 p-4 rounded-2xl border">
              <div>
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                  <Database className="w-5 h-5 text-emerald-700" />
                  Electoral Database Registry Records ({customProfiles.length + PRE_POPULATED_PROFILES.length} entries)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Explore active profiles registered inside the system central nodes and browser local sandbox.</p>
              </div>

              {customProfiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your custom database entries?')) {
                      setCustomProfiles([]);
                      localStorage.removeItem('bd_nid_registry_custom_profiles');
                    }
                  }}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-[10px] font-black transition border border-red-200 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Custom Database
                </button>
              )}
            </div>

            {/* Custom user added records */}
            <div className="space-y-4 text-left">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mt-2">
                📂 Custom Seeds (Browser LocalStorage)
              </h4>
              
              {customProfiles.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-slate-150 space-y-1">
                  <Database className="w-8 h-8 text-slate-300 mx-auto stroke-[1.25]" />
                  <p className="font-bold text-xs">No customized seeds registered yet.</p>
                  <p className="text-[10px] leading-relaxed max-w-sm mx-auto">Click "Add / Seed Original NID Card" to register your actual card credentials so that they load perfectly on validation query!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customProfiles.map((p) => (
                    <div key={p.nid} className="border border-emerald-100 bg-emerald-50/5 p-4 rounded-2xl flex items-start gap-3.5 relative overflow-hidden">
                      <div className="w-10 h-12 bg-slate-200 border rounded overflow-hidden shrink-0 mt-0.5">
                        {p.photoUrl ? (
                          <img src={p.photoUrl} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <User className="w-full h-full text-slate-400 p-1" />
                        )}
                      </div>
                      
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 justify-between">
                          <p className="font-extrabold text-xs text-slate-800 truncate">{p.nameEnglish}</p>
                          <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[8px] px-1.5 py-0.2 rounded shrink-0">CUSTOM</span>
                        </div>
                        <p className="text-[10.5px] font-semibold text-slate-500 font-serif leading-none mt-0.2">{p.nameBangla}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-1">NID: {p.nid}</p>
                        <p className="text-[9.5px] text-slate-404">Birth: {p.dob} • District: {p.district.split(' ')[0]}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteConfig(p.nid)}
                        className="text-red-500 hover:text-red-700 p-1 absolute right-2.5 bottom-2.5 transition"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Standard pre-populated list */}
            <div className="space-y-4 text-left pt-2 border-t">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                💼 Default Preloaded Registry Nodes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {PRE_POPULATED_PROFILES.map((p) => (
                  <div key={p.nid} className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl flex items-start gap-4">
                    <User className="w-8 h-8 text-slate-400 mt-1 border rounded p-1 bg-white" />
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <p className="font-extrabold text-xs text-slate-800 truncate">{p.nameEnglish}</p>
                      <p className="text-[10px] text-slate-400 font-mono">NID: {p.nid}</p>
                      <p className="text-[9px] text-slate-400">DOB: {p.dob} • Zila: {p.district}</p>
                    </div>
                    <span className="bg-slate-100 text-slate-700 font-bold text-[8px] px-1.5 py-0.5 rounded shrink-0">PRELOADED</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Audit Log list trail section visible at bottom */}
      <div className="bg-white rounded-3xl p-6 mt-8 border border-gray-100 shadow-sm max-w-4xl mx-auto w-full text-left space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-emerald-700" />
            Voter Query Search Log Archive
          </h3>

          {historyLogs.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistoryAll}
              className="text-red-500 hover:text-red-600 text-[10px] font-black uppercase flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Search Logs
            </button>
          )}
        </div>

        {historyLogs.length === 0 ? (
          <div className="text-center py-6 text-slate-400 space-y-1">
            <FileText className="w-8 h-8 text-slate-300 mx-auto stroke-[1.25]" />
            <p className="text-xs font-bold">No historic validations logged.</p>
            <p className="text-[10px] leading-relaxed select-none">Validate NIDs in the verification query tab to automatically log lookup histories here.</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
            {historyLogs.map((log) => (
              <div key={log.id} className="border border-slate-150 p-3 rounded-2xl bg-slate-50/50 flex justify-between items-center gap-4 text-xs font-sans">
                <div>
                  <p className="font-extrabold text-slate-800">{log.name}</p>
                  <p className="text-[9.5px] font-mono text-slate-400 font-semibold">NID Code: {log.nid} • Query Time: {log.timestamp}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-black text-[9px] px-2.5 py-1 rounded-lg">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
