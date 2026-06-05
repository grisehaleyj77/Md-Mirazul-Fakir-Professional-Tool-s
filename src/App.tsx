import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Settings, 
  FileText, 
  Languages, 
  Image as ImageIcon, 
  FileCode, 
  Layers, 
  QrCode, 
  Search, 
  Zap, 
  Tag,
  FileSpreadsheet, 
  FileType, 
  Type,
  ShieldAlert,
  Youtube,
  Video,
  Music,
  LayoutGrid,
  MapPin,
  ChevronLeft,
  ChevronRight,
  FileUp,
  FileDown,
  Monitor,
  Facebook,
  Clock,
  Book,
  Hash,
  Mic,
  Volume2,
  User,
  Camera,
  Rotate3d,
  BarChart2,
  BarChart3,
  Radio,
  Flame,
  Gamepad2,
  Calendar as CalendarIcon,
  Palette,
  Shield,
  Binary,
  Globe,
  Map as MapIcon,
  Maximize2,
  Link2,
  Barcode as BarcodeIcon,
  MessageSquare,
  RefreshCw,
  SpellCheck,
  Code,
  Sparkles,
  AlignLeft,
  Server,
  FileEdit,
  ArrowLeftRight,
  Split,
  Sliders,
  UserCheck,
  DollarSign,
  Key,
  Minimize,
  Link,
  Navigation,
  CreditCard,
  Contact,
  Edit3,
  Wifi,
  Fingerprint,
  Smartphone,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Tools
import { PDFMerge } from './components/tools/PDFMerge';
import { PDFCompress } from './components/tools/PDFCompress';
import { PDFTextEditor } from './components/tools/PDFTextEditor';
import { PDFToExcel } from './components/tools/PDFToExcel';
import { ExcelToPDF } from './components/tools/ExcelToPDF';
import { CopyrightRemoverAI } from './components/tools/CopyrightRemoverAI';
import { VideoCopyrightRemover } from './components/tools/VideoCopyrightRemover';
import { EnglishToBengaliDictionary } from './components/tools/EnglishToBengaliDictionary';
import { PDFPageNumbering } from './components/tools/PDFPageNumbering';
import { WordEditor } from './components/tools/WordEditor';
import { ExcelEditor } from './components/tools/ExcelEditor';
import { OCRTool } from './components/tools/OCRTool';
import { QRSuite } from './components/tools/QRSuite';
import { QRScanner } from './components/tools/QRScanner';
import { ImageBeautifier } from './components/tools/ImageBeautifier';
import { WatermarkRemover } from './components/tools/WatermarkRemover';
import { PictureMagicLayers } from './components/tools/PictureMagicLayers';
import { Calculator } from './components/tools/Calculator';
import { HEICConverter } from './components/tools/HEICConverter';
import { ScanToPDF } from './components/tools/ScanToPDF';
import { BackgroundRemover } from './components/tools/BackgroundRemover';
import { PhotoEditor } from './components/tools/PhotoEditor';
import { STTAI } from './components/tools/STTAI';
import { TTSAI } from './components/tools/TTSAI';
import { Translator } from './components/tools/Translator';
import { PDFToWord } from './components/tools/PDFToWord';
import { WordToPDF } from './components/tools/WordToPDF';
import { VideoEditor } from './components/tools/VideoEditor';
import { VideoToAudio } from './components/tools/VideoToAudio';
import { AudioEditor } from './components/tools/AudioEditor';
import { BanglaCalendar } from './components/tools/BanglaCalendar';
import { TrendingPhotoStyle } from './components/tools/TrendingPhotoStyle';
import { MusicStudioPro } from './components/tools/MusicStudioPro';
import { Subscription } from './components/Subscription';
import { Profile } from './components/Profile';
import { ScreenshotEditor } from './components/tools/ScreenshotEditor';
import { HashtagGenerator } from './components/tools/HashtagGenerator';
import { YouTubeSEOTool } from './components/tools/YouTubeSEOTool';
import { YouTubeResearchTool } from './components/tools/YouTubeResearchTool';
import { YouTubeTagTool } from './components/tools/YouTubeTagTool';
import { YouTubeTranscript } from './components/tools/YouTubeTranscript';
import { YouTubeIDCardMaker } from './components/tools/YouTubeIDCardMaker';
import { WebsiteScreenshotTaker } from './components/tools/WebsiteScreenshotTaker';
import { VisitingCardMaker } from './components/tools/VisitingCardMaker';
import { StudentIDCardMaker } from './components/tools/StudentIDCardMaker';
import { GoogleIDCardMaker } from './components/tools/GoogleIDCardMaker';
import { BDSmartNIDMaker } from './components/tools/BDSmartNIDMaker';
import { BdnidChecker } from './components/tools/BdnidChecker';
import { FacebookIDCardMaker } from './components/tools/FacebookIDCardMaker';
import { SignatureGenerator } from './components/tools/SignatureGenerator';
import { FacebookPhotoSizeGenerator } from './components/tools/FacebookPhotoSizeGenerator';
import { InternetSpeedChecker } from './components/tools/InternetSpeedChecker';
import { FingerprintScanner } from './components/tools/FingerprintScanner';
import { WebsiteToApkConverter } from './components/tools/WebsiteToApkConverter';
import { GmailNameCreator } from './components/tools/GmailNameCreator';
import { PictureToPrompt } from './components/tools/PictureToPrompt';
import { SocialAudit } from './components/tools/SocialAudit';
import { SocialMediaTrendingTool } from './components/tools/SocialMediaTrendingTool';
// import { PictureTo360 } from './components/tools/PictureTo360';
import { AgeCalculator } from './components/tools/AgeCalculator';
import { NumberToWordTool } from './components/tools/NumberToWordTool';
import { ImageToPdfTool } from './components/tools/ImageToPdfTool';
import { ImageToWordTool } from './components/tools/ImageToWordTool';
import { ImageToWordPro } from './components/tools/ImageToWordPro';
import { WordCounterTool } from './components/tools/WordCounterTool';
import { TextToWord } from './components/tools/TextToWord';
import { JSONFormatter } from './components/tools/JSONFormatter';
import { Base64Tool } from './components/tools/Base64Tool';
import { PasswordGenerator } from './components/tools/PasswordGenerator';
import { ColorConverter } from './components/tools/ColorConverter';
import { HTMLEntityTool } from './components/tools/HTMLEntityTool';
import { ImageResizer } from './components/tools/ImageResizer';
import { URLTool } from './components/tools/URLTool';
import { BarcodeGenerator } from './components/tools/BarcodeGenerator';
import { WhatsAppTool } from './components/tools/WhatsAppTool';
import { ImageConverter } from './components/tools/ImageConverter';
import { LinkShortener } from './components/tools/LinkShortener';
import { ScientificCalculator } from './components/tools/ScientificCalculator';
import { WorldMapTool } from './components/tools/WorldMapTool';
import { Bangladesh3DMap } from './components/tools/Bangladesh3DMap';
import { GrammarChecker } from './components/tools/GrammarChecker';
import { ArticleRewriter } from './components/tools/ArticleRewriter';
import { AIWriter } from './components/tools/AIWriter';
import { BackwardsTextGenerator } from './components/tools/BackwardsTextGenerator';
import { TextToHashtagsConverter } from './components/tools/TextToHashtagsConverter';
import { TextCompare } from './components/tools/TextCompare';
import { TextToSlugConverter } from './components/tools/TextToSlugConverter';
import { AIVirtualTryOn } from './components/tools/AIVirtualTryOn';
import { BangladeshTrendingTopics } from './components/tools/BangladeshTrendingTopics';

// Custom Text Tools imports
import { 
  LoremIpsumGenerator, 
  CaseConverter, 
  RemoveLineBreaks, 
  TextRepeater, 
  TextSorter, 
  CommaSeparator, 
  NumberToWordConverter, 
  WordToNumberConverter, 
  TextToTagsConverter 
} from './components/tools/CustomTextTools';

// Custom YouTube Tools imports
import {
  YouTubeTagExtractor,
  YouTubeTagGenerator,
  YouTubeHashtagExtractor,
  YouTubeHashtagGenerator,
  YouTubeTitleExtractor,
  YouTubeTitleGenerator,
  YouTubeTitleLengthChecker,
  YouTubeDescriptionExtractor,
  YouTubeDescriptionGenerator,
  YouTubeEmbedCodeGenerator,
  YouTubeChannelIDExtractor,
  YouTubeVideoStatistics,
  YouTubeChannelStatistics,
  YouTubeRegionRestrictionChecker,
  YouTubeChannelLogoDownloader,
  YouTubeChannelBannerDownloader,
  YouTubeChannelFinder,
  YouTubeThumbnailDownloader,
  YouTubeTimestampLinkGenerator,
  YouTubeSubscribeLinkGenerator,
  YouTubeMoneyCalculator,
  YouTubeVideoCountChecker,
  YouTubeVideoTitleCapitalizer,
  YouTubeCommentPicker,
  YouTubeViewsRatioCalculator,
  YouTubeChannelAgeChecker
} from './components/tools/CustomYTools';

// Custom SEO Tools imports
import {
  WebsiteRankingChecker,
  KeywordsSuggestionTool,
  KeywordDensityChecker,
  GoogleCacheChecker,
  GoogleIndexChecker,
  MetaTagGenerator,
  MetaTagAnalyzer,
  OpenGraphChecker,
  OpenGraphGenerator,
  TwitterCardGenerator,
  UTMBuilder,
  DomainToIPConverter,
  DomainAgeChecker,
  WhoisDomainLookup,
  HostingChecker,
  DNSRecordsChecker,
  WhatIsMyIPAddress,
  IPAddressLookup
} from './components/tools/CustomSEOTools';

// Custom Dev & Utility Tools imports
import {
  PasswordGenerator as AdvancedPasswordGenerator,
  TextToQRCode,
  ImageResizer as AdvancedImageResizer,
  ImageCompressor,
  URLEncodeDecoder,
  CSSMinifier,
  JSMinifier,
  CryptographicHasherMD
} from './components/tools/CustomDevTools';

const TOOL_CONFIG = [
  // SECTION 1: Document Solutions (DOC)
  { id: 'pdf-merge', name: 'PDF Merge', description: 'Combine multiple PDF documents into one single file.', category: 'DOC', icon: FileUp, color: 'bg-red-600', component: PDFMerge },
  { id: 'pdf-compress', name: 'PDF Compress', description: 'Compress and reduce the file size of your PDF files.', category: 'DOC', icon: FileDown, color: 'bg-orange-600', component: PDFCompress },
  { id: 'pdf-editor', name: 'PDF Editor', description: 'Edit and manage text content inside your PDF files.', category: 'DOC', icon: FileEdit, color: 'bg-blue-600', component: PDFTextEditor },
  { id: 'pdf-to-excel', name: 'PDF to Excel Converter', description: 'Extract tables and databases from PDF as spreadsheet.', category: 'DOC', icon: FileSpreadsheet, color: 'bg-green-600', component: PDFToExcel },
  { id: 'excel-to-pdf', name: 'Excel to PDF Creator', description: 'Output spreadsheet matrices to pristine PDF files.', category: 'DOC', icon: FileSpreadsheet, color: 'bg-emerald-600', component: ExcelToPDF },
  { id: 'pdf-numbering', name: 'PDF Page Numbering', description: 'Auto-stamp sequential pagination onto PDF files.', category: 'DOC', icon: FileType, color: 'bg-teal-600', component: PDFPageNumbering },
  { id: 'word-editor', name: 'Word Editor Pro', description: 'Professional rich text processor and docx canvas.', category: 'DOC', icon: FileText, color: 'bg-blue-700', component: WordEditor },
  { id: 'excel-editor', name: 'Excel Editor Pro', description: 'Interactive spreadsheet grid with live formulas, charts, styles and exports.', category: 'DOC', icon: FileSpreadsheet, color: 'bg-emerald-600', component: ExcelEditor },
  { id: 'word-to-pdf', name: 'Word to PDF Converter', description: 'Transform .docx layouts directly into standard PDFs.', category: 'DOC', icon: FileDown, color: 'bg-red-600', component: WordToPDF },
  { id: 'pdf-to-word', name: 'PDF to Word Converter', description: 'Re-serialize PDF contents into docx word blocks.', category: 'DOC', icon: FileUp, color: 'bg-sky-600', component: PDFToWord },
  { id: 'img-to-pdf', name: 'Image to PDF Maker', description: 'Convert camera photos or screenshots into pages of PDF.', category: 'DOC', icon: ImageIcon, color: 'bg-[#a21caf]', component: ImageToPdfTool },
  { id: 'scan-pdf', name: 'Camera Scan to PDF', description: 'Map captured image streams into complete multi-page PDF.', category: 'DOC', icon: Camera, color: 'bg-violet-600', component: ScanToPDF },
  { id: 'img-to-word', name: 'Image to Word Basic', description: 'Generate docx pages from flat images directly.', category: 'DOC', icon: FileText, color: 'bg-[#7c3aed]', component: ImageToWordTool },
  { id: 'word-counter', name: 'Word Counter Tool', description: 'Review lengths, paragraph densities, and reading durations.', category: 'DOC', icon: AlignLeft, color: 'bg-emerald-600', component: WordCounterTool },
  { id: 'text-to-word', name: 'Text to Word Exporter', description: 'Write clear typography content and output as clean .docx.', category: 'DOC', icon: FileType, color: 'bg-indigo-600', component: TextToWord },

  // SECTION 2: Media & Creators Tools (MEDIA)
  { id: 'ai-virtual-try-on', name: 'AI Virtual Try-On', description: 'Try on clothing garments virtually on a live model template or uploaded portrait shot using interactive layouts or Gemini AI blending.', category: 'AI', icon: Sparkles, color: 'bg-blue-600', component: AIVirtualTryOn },
  { id: 'ai-writer', name: 'Article Writer Tool', description: 'Generate exhaustive 5000+ words articles with professional SEO entities and corresponding matching pictures on 1-click.', category: 'AI', icon: Sparkles, color: 'bg-emerald-600', component: AIWriter },
  { id: 'copyright-remover', name: 'Copyright Sanitizer', description: 'Remove metadata, tags, and licensing stamps from images.', category: 'AI', icon: Sparkles, color: 'bg-purple-600', component: CopyrightRemoverAI },
  { id: 'video-copyright-remover', name: 'Video Copyright Sanitizer', description: 'Scan and clean copyrighted properties in media feeds.', category: 'AI', icon: Video, color: 'bg-indigo-600', component: VideoCopyrightRemover },
  { id: 'ocr-tool', name: 'OCR Text Extractor', description: 'Extract text from scanned layouts using offline OCR.', category: 'AI', icon: Search, color: 'bg-yellow-600', component: OCRTool },
  { id: 'img-to-word-pro', name: 'Image to Word Compiler Pro', description: 'High precision offline document transcription and compilation.', category: 'AI', icon: Sparkles, color: 'bg-indigo-700', component: ImageToWordPro },
  { id: 'stt-ai', name: 'Speech to Text Converter', description: 'Translate speech and spoken audio files to written logs.', category: 'AI', icon: Mic, color: 'bg-rose-600', component: STTAI },
  { id: 'tts-ai', name: 'Text to Speech Engine', description: 'Listen to realistic high-fidelity copy reading lines.', category: 'AI', icon: Volume2, color: 'bg-violet-700', component: TTSAI },
  { id: 'video-editor', name: 'Video Trim & Slice', description: 'Pristine editor canvas to splice and adjust mp4s.', category: 'AI', icon: Video, color: 'bg-pink-600', component: VideoEditor },
  { id: 'video-to-audio', name: 'Video to MP3 Converter', description: 'Extract high fidelity audio signals to mp3.', category: 'AI', icon: Music, color: 'bg-[#d97706]', component: VideoToAudio },
  { id: 'audio-editor', name: 'Audio Editor Studio', description: 'Splice soundboards and merge tracks smoothly.', category: 'AI', icon: Music, color: 'bg-teal-600', component: AudioEditor },
  { id: 'music-studio', name: 'Music Studio Pro', description: 'Mix virtual instrument feeds on custom soundboards.', category: 'AI', icon: Music, color: 'bg-[#4f46e5]', component: MusicStudioPro },
  { id: 'hashtag-generator', name: 'Hashtag Generator', description: 'Get popular viral social tags automatically.', category: 'AI', icon: Hash, color: 'bg-[#e11d48]', component: HashtagGenerator },
  { id: 'text-to-hashtags', name: 'Text to Hashtags Converter', description: 'Transform normal sentences, captions, and paragraphs into trending, optimized social tags.', category: 'AI', icon: Hash, color: 'bg-cyan-600', component: TextToHashtagsConverter },
  { id: 'yt-seo', name: 'YouTube SEO Master', description: 'Analyze tag CTR layouts and meta performance.', category: 'AI', icon: Youtube, color: 'bg-red-600', component: YouTubeSEOTool },
  { id: 'yt-research', name: 'YouTube Research Hub', description: 'Find metrics and target niches for trending content.', category: 'AI', icon: Search, color: 'bg-[#b91c1c]', component: YouTubeResearchTool },
  { id: 'yt-tag-tool', name: 'YouTube Tag Extractor Pro', description: 'Extract rankings, tags and descriptions from video feeds.', category: 'AI', icon: Tag, color: 'bg-[#ef4444]', component: YouTubeTagTool },
  { id: 'yt-transcript', name: 'YouTube Transcript Reader', description: 'Download human-friendly timeline transcripts from videos.', category: 'AI', icon: AlignLeft, color: 'bg-[#991b1b]', component: YouTubeTranscript },
  { id: 'social-audit', name: 'Social Profile Auditor', description: 'Evaluate channel profiles for engagement leaks.', category: 'AI', icon: Monitor, color: 'bg-blue-800', component: SocialAudit },
  { id: 'social-trends', name: 'Social Media Trends', description: 'Highlight viral terms across search platforms.', category: 'AI', icon: Flame, color: 'bg-amber-600', component: SocialMediaTrendingTool },
  { id: 'bd-trending-topics', name: 'Live Bangladesh Trends', description: 'Monitor live trending topics, hot stories, and viral news in Bangladesh with real-time AI and Google search grounding.', category: 'AI', icon: Flame, color: 'bg-emerald-600', component: BangladeshTrendingTopics },
  { id: 'photo-stylist', name: 'Trending Photo Stylist', description: 'Add dynamic overlays, grains, and vintage templates.', category: 'AI', icon: Palette, color: 'bg-sky-500', component: TrendingPhotoStyle },
  { id: 'bg-remover', name: 'Background Studio Remover', description: 'Delineate and remove backdrops under layers.', category: 'AI', icon: Sparkles, color: 'bg-[#7c3aed]', component: BackgroundRemover },
  { id: 'watermark-remover', name: 'Watermark Clean Remover', description: 'Retouch stamps and purge background overlays.', category: 'AI', icon: Layers, color: 'bg-cyan-700', component: WatermarkRemover },
  { id: 'pic-magic-layers', name: 'Picture Magic Layers', description: 'Dynamic layered image builder and filter studio.', category: 'AI', icon: Layers, color: 'bg-[#db2777]', component: PictureMagicLayers },
  { id: 'img-beautifier', name: 'Image Beautifier Pro', description: 'One-click contrast, clarity and lighting filters.', category: 'AI', icon: Palette, color: 'bg-fuchsia-600', component: ImageBeautifier },
  { id: 'screenshot-editor', name: 'Screenshot Annotation', description: 'Sketch text and marks inside screenshot layouts.', category: 'AI', icon: Monitor, color: 'bg-[#475569]', component: ScreenshotEditor },
  { id: 'photo-editor', name: 'Photo Workspace Pro', description: 'Unleash overlays, text, templates, and crops.', category: 'AI', icon: Palette, color: 'bg-[#2563eb]', component: PhotoEditor },
 
  // SECTION 3: Utilities (UTIL)
  { id: 'age-calc', name: 'Age Calculator', description: 'Chronological lookup of dates, days and times.', category: 'UTIL', icon: Clock, color: 'bg-[#047857]', component: AgeCalculator },
  { id: 'std-calculator', name: 'Standard Calculator', description: 'Rapid clean layout mathematical operations.', category: 'UTIL', icon: LayoutGrid, color: 'bg-slate-700', component: Calculator },
  { id: 'sci-calc', name: 'Scientific Calculator', description: 'Advanced calculations, equations, and mathematical sets.', category: 'UTIL', icon: LayoutGrid, color: 'bg-blue-800', component: ScientificCalculator },
  { id: 'qr-suite', name: 'Custom QR Generator', description: 'Generate beautifully stylized corporate QR codes.', category: 'UTIL', icon: QrCode, color: 'bg-cyan-600', component: QRSuite },
  { id: 'qr-scanner', name: 'Webcam QR Scanner', description: 'Scan QR codes from files or physical webcam feeds.', category: 'UTIL', icon: QrCode, color: 'bg-emerald-600', component: QRScanner },
  { id: 'whatsapp-tool', name: 'WhatsApp Direct Link', description: 'Generate clickable messaging links with templates.', category: 'UTIL', icon: MessageSquare, color: 'bg-[#22c55e]', component: WhatsAppTool },
  { id: 'barcode-gen', name: 'Prismatic Barcode Forge', description: 'Generate active standard barcode codes like UPC or Code 128.', category: 'UTIL', icon: BarcodeIcon, color: 'bg-[#18181b]', component: BarcodeGenerator },
  { id: 'num-to-word', name: 'Number to Word Pro', description: 'Output commercial receipts or calculations to words.', category: 'UTIL', icon: Type, color: 'bg-[#0d9488]', component: NumberToWordTool },
  { id: 'heic-converter', name: 'HEIC to JPG Converter', description: 'Convert Apple format pictures back to raw standard JPG.', category: 'UTIL', icon: RefreshCw, color: 'bg-slate-600', component: HEICConverter },
  { id: 'img-converter', name: 'Image Format Converter', description: 'Map structures among standard and vector image archives.', category: 'UTIL', icon: ImageIcon, color: 'bg-[#ea580c]', component: ImageConverter },
  { id: 'img-resizer', name: 'Image Resizer Studio', description: 'Transform sizes & pixel bounds under ratio locks.', category: 'UTIL', icon: Maximize2, color: 'bg-[#3b82f6]', component: ImageResizer },
  { id: 'link-short', name: 'Smart Link Shortener', description: 'Transform heavy links to short codes with QR supports.', category: 'UTIL', icon: Link2, color: 'bg-[#db2777]', component: LinkShortener },
  { id: 'world-map', name: 'World Globe Explorer', description: 'Study border metrics and locations directly on globe canvas.', category: 'UTIL', icon: Globe, color: 'bg-indigo-900', component: WorldMapTool },
  { id: 'bd-3d-map', name: 'Bangladesh 3D GIS', description: 'Stately topological division exploration map in 3D.', category: 'UTIL', icon: MapIcon, color: 'bg-emerald-700', component: Bangladesh3DMap },

  // SECITON 3B: Offline YouTube tools
  { id: 'yt-tag-extractor-custom', name: 'YouTube Tag Extractor', description: 'Isolate keyphrase tags and identifiers from description copy blocks.', category: 'UTIL', icon: Tag, color: 'bg-red-600', component: YouTubeTagExtractor },
  { id: 'yt-tag-generator-custom', name: 'YouTube Tag Generator', description: 'Generate offline SEO-optimized tags and secondary search phrases.', category: 'UTIL', icon: Sparkles, color: 'bg-red-700', component: YouTubeTagGenerator },
  { id: 'yt-hashtag-extractor-custom', name: 'YouTube Hashtag Extractor', description: 'Extract all hashtag instances from multi-line text descriptions.', category: 'UTIL', icon: Hash, color: 'bg-red-600', component: YouTubeHashtagExtractor },
  { id: 'yt-hashtag-gen-custom', name: 'YouTube Hashtag Generator', description: 'Instantly build popular hashtag variations for your subject idea.', category: 'UTIL', icon: Hash, color: 'bg-red-700', component: YouTubeHashtagGenerator },
  { id: 'yt-title-extractor-custom', name: 'YouTube Title Extractor', description: 'Purge metadata streams to target the primary video title frame.', category: 'UTIL', icon: FileText, color: 'bg-red-600', component: YouTubeTitleExtractor },
  { id: 'yt-title-gen-custom', name: 'YouTube Title Generator', description: 'Create high CTR click-worthy video title formulas offline.', category: 'UTIL', icon: Sparkles, color: 'bg-red-700', component: YouTubeTitleGenerator },
  { id: 'yt-title-length-checker-custom', name: 'YouTube Title Length Checker', description: 'Measure character limits and receive visual CTR evaluations.', category: 'UTIL', icon: Sliders, color: 'bg-red-600', component: YouTubeTitleLengthChecker },
  { id: 'yt-desc-extractor-custom', name: 'YouTube Description Extractor', description: 'Separate descriptions, timestamps and copy from links or metadata.', category: 'UTIL', icon: FileText, color: 'bg-red-600', component: YouTubeDescriptionExtractor },
  { id: 'yt-desc-generator-custom', name: 'YouTube Description Generator', description: 'Build structured, high-conversion, professional video descriptions.', category: 'UTIL', icon: FileText, color: 'bg-red-700', component: YouTubeDescriptionGenerator },
  { id: 'yt-embed-generator-custom', name: 'YouTube Embed Code Generator', description: 'Forge responsive HTML iframe copy-paste block matching custom sizes.', category: 'UTIL', icon: Code, color: 'bg-red-600', component: YouTubeEmbedCodeGenerator },
  { id: 'yt-channel-id-extractor-custom', name: 'YouTube Channel ID Extractor', description: 'Resolve UCID channel formats from names and URLs offline.', category: 'UTIL', icon: UserCheck, color: 'bg-red-600', component: YouTubeChannelIDExtractor },
  { id: 'yt-video-stats-custom', name: 'YouTube Video Stats Estimator', description: 'Predict average CTR, like ratio, and retention metrics locally.', category: 'UTIL', icon: BarChart2, color: 'bg-red-700', component: YouTubeVideoStatistics },
  { id: 'yt-channel-stats-custom', name: 'YouTube Channel Analytics', description: 'Locally analyze revenue ranges and engagement loyalty scoring.', category: 'UTIL', icon: BarChart3, color: 'bg-red-600', component: YouTubeChannelStatistics },
  { id: 'yt-region-checker-custom', name: 'YouTube Region Restriction Auditor', description: 'Check contents categories compliance against geographic geo-blocking.', category: 'UTIL', icon: Globe, color: 'bg-red-600', component: YouTubeRegionRestrictionChecker },
  { id: 'yt-logo-downloader-custom', name: 'YouTube Channel Logo Maker', description: 'Construct visual vector placeholder profile logos offline.', category: 'UTIL', icon: ImageIcon, color: 'bg-red-600', component: YouTubeChannelLogoDownloader },
  { id: 'yt-banner-downloader-custom', name: 'YouTube Banner Wallpaper Hub', description: 'Resolve abstract backdrop banner cover templates for your style.', category: 'UTIL', icon: ImageIcon, color: 'bg-red-700', component: YouTubeChannelBannerDownloader },
  { id: 'yt-channel-finder-custom', name: 'YouTube Channel Finder', description: 'Find benchmark references, trends, and inspiration sources.', category: 'UTIL', icon: Search, color: 'bg-red-600', component: YouTubeChannelFinder },
  { id: 'yt-thumbnail-downloader-custom', name: 'YouTube Thumbnail Grabber', description: 'Retrieve direct high-resolution video thumbnail image URLs.', category: 'UTIL', icon: ImageIcon, color: 'bg-red-700', component: YouTubeThumbnailDownloader },
  { id: 'yt-timestamp-generator-custom', name: 'YouTube Timestamp Link Builder', description: 'Build direct coordinate links pinpointing physical second targets.', category: 'UTIL', icon: Link, color: 'bg-red-600', component: YouTubeTimestampLinkGenerator },
  { id: 'yt-subscribe-link-custom', name: 'YouTube Subscriber Link Forge', description: 'Build direct links triggering confirmation dialog windows.', category: 'UTIL', icon: Link, color: 'bg-red-700', component: YouTubeSubscribeLinkGenerator },
  { id: 'yt-money-calculator-custom', name: 'YouTube Revenue Calculator', description: 'Estimate monthly and yearly ad earnings based on custom RPM.', category: 'UTIL', icon: DollarSign, color: 'bg-red-600', component: YouTubeMoneyCalculator },
  { id: 'yt-video-count-custom', name: 'YouTube Video Upload Velocity', description: 'Analyze uploads required to target subscriber goals over time.', category: 'UTIL', icon: Sliders, color: 'bg-red-700', component: YouTubeVideoCountChecker },
  { id: 'yt-title-capitalizer-custom', name: 'YouTube Title AP Case Capitalizer', description: 'Convert titles to grammatically pristine AP Title Case style guidelines.', category: 'UTIL', icon: Type, color: 'bg-red-600', component: YouTubeVideoTitleCapitalizer },
  { id: 'yt-comment-picker-custom', name: 'YouTube Giveaway Comment Picker', description: 'Select random comment winners from a list block offline.', category: 'UTIL', icon: Sliders, color: 'bg-red-700', component: YouTubeCommentPicker },
  { id: 'yt-views-ratio-custom', name: 'YouTube Views to Engagement Ratio', description: 'Determine audience interaction scores from simple parameters.', category: 'UTIL', icon: BarChart2, color: 'bg-red-600', component: YouTubeViewsRatioCalculator },
  { id: 'yt-channel-age-custom', name: 'YouTube Channel Age Estimator', description: 'Estimate registration anniversaries and history parameters locally.', category: 'UTIL', icon: CalendarIcon, color: 'bg-red-600', component: YouTubeChannelAgeChecker },
  { id: 'yt-id-card-maker', name: 'YouTube Creator ID Card Maker', description: 'Design custom YouTube Creator ID passes, milestones badge certifications, and barcodes offline.', category: 'UTIL', icon: Youtube, color: 'bg-red-700', component: YouTubeIDCardMaker },
  { id: 'website-screenshot-taker', name: 'Website Screenshot Taker', description: 'Generate high-resolution device screenshot mockups of any website.', category: 'UTIL', icon: Globe, color: 'bg-teal-600', component: WebsiteScreenshotTaker },
  { id: 'visiting-card-maker', name: 'Visiting Card Maker Pro', description: 'Design exquisite vertical or horizontal business card layouts, select accent colors, compile vCard QR links, and export production print-ready maps offline.', category: 'UTIL', icon: CreditCard, color: 'bg-indigo-600', component: VisitingCardMaker },
  { id: 'student-id-card-maker', name: 'Student ID Card Maker', description: 'Design standardized student ID passes, configure custom blood groups, academic sessions, verified barcode seals, and export high-DPI assets offline.', category: 'UTIL', icon: Contact, color: 'bg-blue-600', component: StudentIDCardMaker },
  { id: 'google-id-card-maker', name: 'Google ID Card Maker', description: 'Design standardized corporate Google ID passes, configure custom employee titles, office locations, and barcode signatures offline.', category: 'UTIL', icon: Contact, color: 'bg-emerald-600', component: GoogleIDCardMaker },
  { id: 'bd-smart-nid-maker', name: 'Fake BD Smart NID Card Maker', description: 'Design simulated Bangladeshi Smart National Identity (NID) cards, configure custom Bengali and English registries, biometric microchips, barcode lines, and download high-DPI maps offline.', category: 'UTIL', icon: Contact, color: 'bg-green-700', component: BDSmartNIDMaker },
  { id: 'bd-nid-checker', name: 'Bangladesh National ID Checker', description: 'Validate Bangladeshi NID card formats (10/13/17-digits), extract demographic district metadata, and query simulated voter registry database nodes.', category: 'UTIL', icon: Shield, color: 'bg-emerald-700', component: BdnidChecker },
  { id: 'facebook-id-card-maker', name: 'Facebook ID Card Maker', description: 'Design stylized Facebook Creator credentials, Meta ID passes, custom profile rings, verified blue badges, and download high-DPI assets offline.', category: 'UTIL', icon: Facebook, color: 'bg-blue-600', component: FacebookIDCardMaker },
  { id: 'facebook-photo-resizer', name: 'Facebook Photo Template Generator', description: 'Resize images to standard Facebook profiles, cover images, community groups, story templates, and ad designs with real-time responsive safe margin guidelines.', category: 'UTIL', icon: Facebook, color: 'bg-indigo-600', component: FacebookPhotoSizeGenerator },
  { id: 'signature-generator', name: 'E-Signature Pad & Generator', description: 'Design signatures and digital hand-signs. Supports natural drawing pens, signature cursive style presets, customized approval seals, and transparent PNG/JPEG export offline.', category: 'UTIL', icon: Edit3, color: 'bg-teal-600', component: SignatureGenerator },
  { id: 'internet-speed-checker', name: 'Internet Speed Test Suite', description: 'Test your broadband internet download and upload speed bandwidth, latency ping, and jitter stability in real-time with visual speedometer gauges.', category: 'UTIL', icon: Wifi, color: 'bg-teal-700', component: InternetSpeedChecker },
  { id: 'fingerprint-scanner', name: 'Biometric Fingerprint Scanner & Key', description: 'Simulate biometric fingerprint scans, display minutiae core ridges, and synthesize secure AES-256 cryptographic security keys offline.', category: 'UTIL', icon: Fingerprint, color: 'bg-emerald-600', component: FingerprintScanner },
  { id: 'website-to-apk-converter', name: 'Website to Android App Converter', description: 'Convert websites, portfolios, or shops into Android apps (APK). Customize brand colors, launch icons, splash indicators, and download full Kotlin studio source files.', category: 'UTIL', icon: Smartphone, color: 'bg-indigo-600', component: WebsiteToApkConverter },
  { id: 'gmail-name-creator', name: 'Gmail Name Creator Pro', description: 'Generate professional, unique, and brand-aligned Gmail email addresses using Gemini AI or local rule-based combinators.', category: 'UTIL', icon: Mail, color: 'bg-[#ef4444]', component: GmailNameCreator },
  { id: 'picture-to-prompt', name: 'Picture to Prompt Suite', description: 'Reverse-engineer any image into highly optimized prompts. Extract rich subjects, lighting parameters, exact color keys, fine tags, and variant compositions.', category: 'UTIL', icon: ImageIcon, color: 'bg-[#6366f1]', component: PictureToPrompt },

  // SECTION 3C: Offline SEO & Domain Tools
  { id: 'seo-rank-checker-custom', name: 'Website Ranking Auditor', description: 'Retrieve estimated domain ranks and backlinks metrics locally.', category: 'UTIL', icon: Globe, color: 'bg-slate-700', component: WebsiteRankingChecker },
  { id: 'seo-keyword-suggest-custom', name: 'Keywords Suggestion Tool', description: 'Determine related semantic modifiers and variations.', category: 'UTIL', icon: Key, color: 'bg-slate-700', component: KeywordsSuggestionTool },
  { id: 'seo-density-checker-custom', name: 'Keyword Density Auditor', description: 'Identify word densities and syllable repeats in copy streams.', category: 'UTIL', icon: FileText, color: 'bg-slate-700', component: KeywordDensityChecker },
  { id: 'seo-cache-checker-custom', name: 'Google Cache Searcher', description: 'Format direct lookup web links targeting historical mirrors.', category: 'UTIL', icon: Search, color: 'bg-slate-700', component: GoogleCacheChecker },
  { id: 'seo-index-checker-custom', name: 'Google Site Indexer link', description: 'Format precise search links querying site: index count records.', category: 'UTIL', icon: Search, color: 'bg-slate-700', component: GoogleIndexChecker },
  { id: 'seo-meta-generator-custom', name: 'Meta Tag HTML Builder', description: 'Compile perfectly formed SEO title and desc meta tags.', category: 'UTIL', icon: Code, color: 'bg-slate-700', component: MetaTagGenerator },
  { id: 'seo-meta-analyzer-custom', name: 'Meta Tag Head Auditor', description: 'Analyze HTML header snippets for compliance deficiencies.', category: 'UTIL', icon: Code, color: 'bg-slate-700', component: MetaTagAnalyzer },
  { id: 'seo-og-checker-custom', name: 'Open Graph Element Auditor', description: 'Analyze social preview og: elements and cover tags.', category: 'UTIL', icon: Globe, color: 'bg-slate-700', component: OpenGraphChecker },
  { id: 'seo-og-generator-custom', name: 'Open Graph Tag Compiler', description: 'Format Facebook and modern social media card tags.', category: 'UTIL', icon: Code, color: 'bg-slate-700', component: OpenGraphGenerator },
  { id: 'seo-twitter-card-custom', name: 'Twitter Cards Meta Compiler', description: 'Generate custom summary tags optimized for Twitter.', category: 'UTIL', icon: Code, color: 'bg-slate-700', component: TwitterCardGenerator },
  { id: 'seo-utm-builder-custom', name: 'UTM Campaign URL Builder', description: 'Easily append tracking parameter tags to promotional links.', category: 'UTIL', icon: Navigation, color: 'bg-slate-700', component: UTMBuilder },
  { id: 'seo-domain-to-ip-custom', name: 'Domain name to IP Resolver', description: 'Resolve public domains to A IPv4 records offline.', category: 'UTIL', icon: Server, color: 'bg-slate-700', component: DomainToIPConverter },
  { id: 'seo-domain-age-custom', name: 'Domain Age Calculator', description: 'Estimate domain creation dates and registrar origins.', category: 'UTIL', icon: Globe, color: 'bg-slate-700', component: DomainAgeChecker },
  { id: 'seo-whois-lookup-custom', name: 'WHOIS Record Parser', description: 'Retrieve administrative registrar ownership files locally.', category: 'UTIL', icon: Server, color: 'bg-slate-700', component: WhoisDomainLookup },
  { id: 'seo-hosting-checker-custom', name: 'Host Server Provider Auditor', description: 'Locate hosting networks and server CDNs under IP checks.', category: 'UTIL', icon: Server, color: 'bg-slate-700', component: HostingChecker },
  { id: 'seo-dns-record-custom', name: 'DNS Records Audit Board', description: 'Inspect simulated MX, AAAA, and CNAME records locally.', category: 'UTIL', icon: Globe, color: 'bg-slate-700', component: DNSRecordsChecker },
  { id: 'seo-my-ip-custom', name: 'What Is My IP Locator', description: 'Retrieve mock coordinate and provider detail markers of current gateway.', category: 'UTIL', icon: Navigation, color: 'bg-slate-700', component: WhatIsMyIPAddress },
  { id: 'seo-ip-lookup-custom', name: 'IP Geolocation Coordinates Finder', description: 'Find timezone and geological boundaries matching custom IPs.', category: 'UTIL', icon: MapPin, color: 'bg-slate-700', component: IPAddressLookup },
 
  // SECTION 4: Language & Learn (LANG)
  { id: 'lang-translator', name: 'Multi-lingual Phrasebook & Translator', description: 'Fluently map texts across common global vocals.', category: 'LANG', icon: Languages, color: 'bg-indigo-600', component: Translator },
  { id: 'en-bn-dict', name: 'English-Bengali Dictionary', description: 'Detailed search for words, definitions, and syllables.', category: 'LANG', icon: Book, color: 'bg-[#5b21b6]', component: EnglishToBengaliDictionary },
  { id: 'bn-calendar', name: 'Bangla Calendar', description: 'Traditional Bengali seasons and dates lookup.', category: 'LANG', icon: CalendarIcon, color: 'bg-[#d97706]', component: BanglaCalendar },
  { id: 'grammar-checker', name: 'Grammar & Spell Checker', description: 'Review styling typos, passive voices and layout grammar errors.', category: 'LANG', icon: SpellCheck, color: 'bg-[#6d28d9]', component: GrammarChecker },
  { id: 'article-rewriter', name: 'Article Rephrase Rewriter', description: 'Rewrite, paraphrase or format articles with professional tone profile.', category: 'AI', icon: FileEdit, color: 'bg-blue-600', component: ArticleRewriter },

  // SECITON 4B: Custom Text Tools in LANG
  { id: 'lorem-ipsum-gen', name: 'Lorem Ipsum Generator', description: 'Construct sample neutral text blocks with target paragraph counts.', category: 'LANG', icon: FileText, color: 'bg-indigo-600', component: LoremIpsumGenerator },
  { id: 'num-to-word-converter', name: 'Number to Word Translator', description: 'Translate numerical numbers into written, spoken language sequences.', category: 'LANG', icon: Type, color: 'bg-indigo-600', component: NumberToWordConverter },
  { id: 'word-to-num-converter', name: 'Word to Number Translator', description: 'Re-serialize written phrase numbers back to standard integers.', category: 'LANG', icon: Type, color: 'bg-indigo-600', component: WordToNumberConverter },

  // SECTION 5: Developer Tools (CODE)
  { id: 'json-formatter', name: 'JSON Formatter Studio', description: 'Perfect markup formatter & parser validation.', category: 'CODE', icon: Code, color: 'bg-indigo-600', component: JSONFormatter },
  { id: 'base64-tool', name: 'Base64 Encoder/Decoder', description: 'Format file blobs & plain strings to secure Base64.', category: 'CODE', icon: Binary, color: 'bg-[#0284c7]', component: Base64Tool },
  { id: 'pass-gen', name: 'Safe Password Forge', description: 'Create highly-secure passwords utilizing custom algorithms.', category: 'CODE', icon: Shield, color: 'bg-[#e11d48]', component: PasswordGenerator },
  { id: 'color-converter', name: 'Color Suite Converter', description: 'Format and map color codes among HEX, RGB, and HSL.', category: 'CODE', icon: Palette, color: 'bg-[#db2777]', component: ColorConverter },
  { id: 'html-entities', name: 'HTML Entity Tool', description: 'Escape custom typography layout lines to safe HTML nodes.', category: 'CODE', icon: Code, color: 'bg-amber-600', component: HTMLEntityTool },
  { id: 'url-tool', name: 'URL Encoder / Decoder', description: 'Fully compliant URL codec encoder and query builder.', category: 'CODE', icon: Link2, color: 'bg-slate-600', component: URLTool },
  { id: 'backwards-text', name: 'Backwards Text Generator', description: 'Transform text orientation, letters sequence and flip text upside down.', category: 'CODE', icon: ArrowLeftRight, color: 'bg-blue-600', component: BackwardsTextGenerator },
  { id: 'text-compare', name: 'Text Compare Suite', description: 'Visual interactive side-by-side other differences highlighting.', category: 'CODE', icon: Split, color: 'bg-rose-600', component: TextCompare },
  { id: 'text-to-slug', name: 'Text to Slug Converter', description: 'Transform titles, urls, and filenames into clean SEO-friendly slugs.', category: 'CODE', icon: Link2, color: 'bg-emerald-600', component: TextToSlugConverter },

  // SECTION 5B: Custom Offline Text & Dev Utilities inside CODE
  { id: 'case-converter-gen', name: 'Case Converter', description: 'Convert letters among UPPER, lower, Sentence, Title, and camelCase structures.', category: 'CODE', icon: Type, color: 'bg-indigo-600', component: CaseConverter },
  { id: 'remove-line-breaks', name: 'Remove Line Breaks', description: 'Sanitize multiple text rows and spacing lines into single unified string runs.', category: 'CODE', icon: AlignLeft, color: 'bg-[#0284c7]', component: RemoveLineBreaks },
  { id: 'text-repeater-gen', name: 'Text Repeater', description: 'Loop input copy segments sequentially based on custom delimiters.', category: 'CODE', icon: RefreshCw, color: 'bg-blue-600', component: TextRepeater },
  { id: 'text-sorter-gen', name: 'Text Sorter & Ordering', description: 'Sort list keywords alphabetically or backward cleanly.', category: 'CODE', icon: Sliders, color: 'bg-teal-600', component: TextSorter },
  { id: 'comma-separator-gen', name: 'Comma Separator Formatter', description: 'Inject or format list values with elegant comma divisions.', category: 'CODE', icon: Split, color: 'bg-rose-600', component: CommaSeparator },
  { id: 'text-to-tags-converter', name: 'Text to Tags Converter', description: 'Extract and format phrases into tag items natively.', category: 'CODE', icon: Tag, color: 'bg-amber-600', component: TextToTagsConverter },
  { id: 'dev-pass-gen-custom', name: 'Advanced Password Generator', description: 'Compile secure robust passkey sequences with custom symbol sets.', category: 'CODE', icon: Key, color: 'bg-slate-800', component: AdvancedPasswordGenerator },
  { id: 'dev-qr-generator-custom', name: 'Text to QR Code', description: 'Construct raster QR barcodes for sharing offline.', category: 'CODE', icon: QrCode, color: 'bg-slate-800', component: TextToQRCode },
  { id: 'dev-img-resizer-custom', name: 'Advanced Image Resizer', description: 'Set custom height and length and scale files under canvas views.', category: 'CODE', icon: Maximize2, color: 'bg-slate-800', component: AdvancedImageResizer },
  { id: 'dev-img-compressor-custom', name: 'Advanced Image Compressor', description: 'Loop compress ratio quality parameters to reduce layout size.', category: 'CODE', icon: Minimize, color: 'bg-slate-800', component: ImageCompressor },
  { id: 'dev-url-codec-custom', name: 'URL Encoder / Decoder Pro', description: 'Encode or decode special character variables from target URLs.', category: 'CODE', icon: Link2, color: 'bg-slate-800', component: URLEncodeDecoder },
  { id: 'dev-css-minify-custom', name: 'CSS Stylesheets Minifier', description: 'Strip comments, spacing, and brackets padding from stylesheets.', category: 'CODE', icon: Code, color: 'bg-slate-800', component: CSSMinifier },
  { id: 'dev-js-minify-custom', name: 'JavaScript Code Minifier', description: 'Strip comments, lines, and console log lines from scripts.', category: 'CODE', icon: Code, color: 'bg-slate-800', component: JSMinifier },
  { id: 'dev-hasher-custom', name: 'Cryptographic Hasher', description: 'Digest secure high-performance SHA-256 and SHA-1 checksum hex strings locally.', category: 'CODE', icon: Hash, color: 'bg-slate-800', component: CryptographicHasherMD }
];

import { FloatingContact } from './components/FloatingContact';

export default function App() {
  const [activeTool, setActiveToolState] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState('tools');
  const lastScrollY = useRef(0);

  const setActiveTool = (toolId: string | null) => {
    if (toolId !== null) {
      lastScrollY.current = window.scrollY || document.documentElement.scrollTop;
    }
    setActiveToolState(toolId);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredTools = TOOL_CONFIG.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderActiveTool = () => {
    const tool = TOOL_CONFIG.find(t => t.id === activeTool);
    if (!tool) return null;
    const ToolComponent = tool.component as any;
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="min-h-screen pb-32"
      >
        <div className="p-6 md:p-10">
          <button 
            onClick={() => setActiveTool(null)}
            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--app-blue)] font-bold mb-8 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          
          <div className="mb-12">
            <h2 className="text-3xl font-black mb-2">{tool.name}</h2>
            <p className="text-[var(--text-muted)] font-medium">{tool.description}</p>
          </div>
          
          <ToolComponent toolId={tool.id} />
          
          <footer className="mt-20 pb-10 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Developer by <span className="text-blue-600">Md Mirazul Fakir</span>
            </p>
          </footer>
        </div>
      </motion.div>
    );
  };

  const [userStatus, setUserStatus] = useState(() => {
    try {
      const saved = localStorage.getItem('mirazul_tools_user_status');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name ?? 'User',
          plan: parsed.plan ?? 'Starter',
          requestsUsed: parsed.requestsUsed ?? 12,
          isPro: parsed.isPro ?? false,
          toolsUsedCount: TOOL_CONFIG.length,
          timeSaved: parsed.timeSaved ?? '120h'
        };
      }
    } catch (_) {}
    return {
      name: 'User',
      plan: 'Starter',
      requestsUsed: 12,
      isPro: false,
      toolsUsedCount: TOOL_CONFIG.length,
      timeSaved: '120h'
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('mirazul_tools_user_status', JSON.stringify(userStatus));
    } catch (_) {}
  }, [userStatus]);

  useEffect(() => {
    if (activeTool) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    } else {
      if (activeNav === 'tools') {
        const restoreY = lastScrollY.current;
        setTimeout(() => {
          window.scrollTo({ top: restoreY });
          document.documentElement.scrollTo({ top: restoreY });
          document.body.scrollTo({ top: restoreY });
        }, 50);
      } else {
        window.scrollTo(0, 0);
        document.documentElement.scrollTo(0, 0);
        document.body.scrollTo(0, 0);
      }
    }
  }, [activeTool, activeNav]);

  const renderDashboard = () => {
    if (activeNav === 'plus') {
      return (
        <motion.div
          key="plus"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="p-6 md:p-8"
        >
          <Subscription userStatus={userStatus} onUpgrade={(plan: string) => setUserStatus(prev => ({ ...prev, plan, isPro: plan !== 'Starter' }))} />
        </motion.div>
      );
    }

    if (activeNav === 'profile') {
      return (
        <motion.div
          key="profile"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="p-6 md:p-8"
        >
          <Profile userStatus={userStatus} onUpdateName={(name: string) => setUserStatus(prev => ({ ...prev, name }))} toolsCount={TOOL_CONFIG.length} />
        </motion.div>
      );
    }

    return (
      <motion.main 
        key="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-6 md:p-8 space-y-10 flex-1 pb-32"
      >
        {/* Greeting */}
        <section className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-[var(--text-main)]">
            Hello, <span className="italic text-blue-600">{userStatus.name.split(' ')[0]}</span>
          </h2>
          <p className="text-lg font-medium text-[var(--text-muted)]">
            Which tool do you need today?
          </p>
        </section>

        {/* Categories */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">DOCUMENT SOLUTIONS</h3>
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-[11px] font-black text-white shadow-xl shadow-blue-600/20">
              {TOOL_CONFIG.filter(t => t.category === 'DOC').length}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {filteredTools.filter(t => t.category === 'DOC').map((tool) => (
              <button 
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="tool-card group active:scale-95 touch-manipulation"
              >
                <div className={`icon-circle ${tool.color}`}>
                  <tool.icon className="w-9 h-9" />
                </div>
                <span className="font-bold text-sm tracking-tight text-[var(--text-main)]">
                  {tool.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* AI Tools Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">AI & MEDIA</h3>
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-[11px] font-black text-white shadow-xl shadow-indigo-600/20">
              {TOOL_CONFIG.filter(t => t.category === 'AI').length}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {filteredTools.filter(t => t.category === 'AI').map((tool) => (
              <button 
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="tool-card group active:scale-95 touch-manipulation"
              >
                <div className={`icon-circle ${tool.color}`}>
                  <tool.icon className="w-9 h-9" />
                </div>
                <span className="font-bold text-sm tracking-tight text-[var(--text-main)]">
                  {tool.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Utilities Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">UTILITIES</h3>
            <div className="w-7 h-7 bg-cyan-600 rounded-lg flex items-center justify-center text-[11px] font-black text-white shadow-xl shadow-cyan-600/20">
              {TOOL_CONFIG.filter(t => t.category === 'UTIL').length}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {filteredTools.filter(t => t.category === 'UTIL').map((tool) => (
              <button 
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="tool-card group active:scale-95 touch-manipulation"
              >
                <div className={`icon-circle ${tool.color}`}>
                  <tool.icon className="w-9 h-9" />
                </div>
                <span className="font-bold text-sm tracking-tight text-[var(--text-main)]">
                  {tool.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Language & Dictionary Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">LANGUAGE & LEARN</h3>
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-[11px] font-black text-white shadow-xl shadow-indigo-600/20">
              {TOOL_CONFIG.filter(t => t.category === 'LANG').length}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {filteredTools.filter(t => t.category === 'LANG').map((tool) => (
              <button 
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="tool-card group active:scale-95 touch-manipulation"
              >
                <div className={`icon-circle ${tool.color}`}>
                  <tool.icon className="w-9 h-9" />
                </div>
                <span className="font-bold text-sm tracking-tight text-[var(--text-main)]">
                  {tool.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Coding Tools Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.25em]">DEVELOPER TOOLS</h3>
            <div className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center text-[11px] font-black text-white shadow-xl shadow-slate-800/20">
              {TOOL_CONFIG.filter(t => t.category === 'CODE').length}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {filteredTools.filter(t => t.category === 'CODE').map((tool) => (
              <button 
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="tool-card group active:scale-95 touch-manipulation"
              >
                <div className={`icon-circle ${tool.color}`}>
                  <tool.icon className="w-9 h-9" />
                </div>
                <span className="font-bold text-sm tracking-tight text-[var(--text-main)]">
                  {tool.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        <footer className="pt-10 pb-4 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Developer by <span className="text-blue-600">Md Mirazul Fakir</span>
          </p>
        </footer>
      </motion.main>
    );
  };

  return (
    <div className="max-w-screen-md mx-auto min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Header */}
      <header className="p-6 md:p-8 flex items-center justify-between sticky top-0 bg-[var(--app-bg)]/80 backdrop-blur-md z-50">
        <AnimatePresence mode="wait">
          {!isSearching && activeNav !== 'search' ? (
            <motion.div 
              key="logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <Box className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-black leading-none tracking-tight">MMF Tools</h1>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">UNIVERSAL KIT</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="search-input"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 mr-4"
            >
              <input 
                autoFocus
                type="text"
                placeholder="Search for a tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-slate-100 dark:bg-white/5 rounded-2xl px-6 font-bold text-sm outline-none focus:ring-2 ring-blue-500/20"
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => {
            if (activeNav === 'search') {
              setActiveNav('tools');
              setSearchQuery('');
              setIsSearching(false);
            } else {
              setIsSearching(!isSearching);
              if (isSearching) setSearchQuery('');
            }
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isSearching || activeNav === 'search' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200'}`}
        >
          {isSearching || activeNav === 'search' ? <ChevronRight className="w-6 h-6" /> : <Search className="w-6 h-6" />}
        </button>
      </header>

      <AnimatePresence mode="wait">
        {activeTool ? (
          renderActiveTool()
        ) : (
          renderDashboard()
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-screen-md px-6 pb-8 z-[100]">
        <div className="bg-[var(--nav-bg)] backdrop-blur-2xl rounded-[32px] border border-white/20 dark:border-white/5 shadow-2xl flex items-center justify-around py-4 px-2">
          {[
            { id: 'tools', label: 'TOOLS', icon: LayoutGrid },
            { id: 'search', label: 'SEARCH', icon: Search },
            { id: 'plus', label: 'PLUS', icon: Zap },
            { id: 'profile', label: 'PROFILE', icon: User },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                setActiveTool(null);
                if (item.id === 'search') {
                  setIsSearching(true);
                } else {
                  setIsSearching(false);
                }
              }}
              className="flex flex-col items-center gap-1 min-w-[70px] relative transition-all active:scale-90"
            >
              <div className={`absolute -top-1 w-1.5 h-1.5 rounded-full bg-blue-600 transition-all ${activeNav === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
              <item.icon className={`w-6 h-6 transition-all ${activeNav === item.id ? 'text-blue-600 scale-110' : 'text-slate-400'}`} />
              <span className={`text-[9px] font-black tracking-widest transition-all ${activeNav === item.id ? 'text-blue-600' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
      <FloatingContact />
    </div>
  );
}
