import image_ad8edfc3316a9245cb431a68f1f71432dd018492 from 'figma:asset/ad8edfc3316a9245cb431a68f1f71432dd018492.png'
import image_e445675206871cec79cef549e2b20441d5384b86 from 'figma:asset/e445675206871cec79cef549e2b20441d5384b86.png'
import React, { useState, useRef, useEffect } from 'react';
import { 
  Folder, FileCode, Upload, Search, LayoutGrid, List, Trash2, Eye, Cpu, 
  CheckCircle, X, Menu, Download, Maximize2, Minimize2, Home, ArrowRight, 
  Shield, Check, Tag, Layers, Gamepad2, AppWindow, ChevronDown, ChevronRight, 
  Wand2, Sparkles, Cloud, Loader2, AlertCircle, Terminal, Grid3X3, Activity, 
  Code, RefreshCw, GitMerge, Square, CheckSquare,
  Box, PlayCircle, FileJson, Image as ImageIcon, Zap, Globe, FolderOpen, Languages,
  Lock, Palette, Music, PenTool
} from 'lucide-react';
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from 'motion/react';

// --- HELPER: ROBUST GENERATE PREVIEW (v5.2) ---
const generatePreview = (file) => {
  if (!file || !file.content) return '';
  if (file.type === 'html') return file.content;

  if (file.type === 'react') {
    let componentName = 'App'; 
    let cleanCode = file.content;

    // 1. Safe Cleanup
    cleanCode = cleanCode.replace(/<\/script>/g, '<\\/script>');
    cleanCode = cleanCode.replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '');
    cleanCode = cleanCode.replace(/import\s+['"].*?['"];?/g, '');

    // 2. Identify Entry Point
    const exportDefaultFunc = cleanCode.match(/export\s+default\s+function\s+(\w+)/);
    const exportDefaultClass = cleanCode.match(/export\s+default\s+class\s+(\w+)/);
    const exportDefaultId = cleanCode.match(/export\s+default\s+(\w+)/);
    const funcMatch = cleanCode.match(/function\s+(\w+)/);
    const constMatch = cleanCode.match(/const\s+(\w+)\s*=\s*(\(|function)/);

    if (exportDefaultFunc) componentName = exportDefaultFunc[1];
    else if (exportDefaultClass) componentName = exportDefaultClass[1];
    else if (exportDefaultId) componentName = exportDefaultId[1];
    else if (funcMatch) componentName = funcMatch[1];
    else if (constMatch) componentName = constMatch[1];

    // 3. Remove Exports (But leave definitions intact)
    cleanCode = cleanCode.replace(/export\s+default\s+/g, '');
    cleanCode = cleanCode.replace(/export\s+/g, '');
    cleanCode = cleanCode.replace(/module\.exports\s*=\s*/g, '');

    // 4. Snippet Wrap Check
    if (!componentName || (!cleanCode.includes('function') && !cleanCode.includes('const'))) {
       cleanCode = `const SnippetWrapper = () => { return (<>${cleanCode}</>); };`;
       componentName = 'SnippetWrapper';
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body { margin: 0; padding: 24px; font-family: 'Segoe UI', sans-serif; background-color: #020617; color: #e2e8f0; }
            #root { height: 100%; }
            #debug-console { 
                margin-top: 20px; 
                padding: 10px; 
                background: #0f172a; 
                border-top: 1px solid #1e293b; 
                font-family: monospace; 
                font-size: 11px; 
                color: #64748b;
                display: none; 
            }
            .log-error { color: #f87171; display: block; margin-bottom: 4px; }
            .log-info { color: #94a3b8; display: block; margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <div id="debug-console"><strong>Debug Console:</strong><br></div>
        <script>
            function logToUi(msg, type) {
                const c = document.getElementById('debug-console');
                c.style.display = 'block';
                const s = document.createElement('span');
                s.className = type === 'error' ? 'log-error' : 'log-info';
                s.textContent = '> ' + msg;
                c.appendChild(s);
            }
            window.onerror = function(msg, url, line) {
                logToUi("Global Error: " + msg + " (Line: " + line + ")", 'error');
                return false;
            };
            console.error = (msg) => logToUi(msg, 'error');
            console.log = (msg) => logToUi(msg, 'info');
        </script>
        <script type="text/babel" data-presets="env,react">
          window.React = React;
          window.ReactDOM = ReactDOM;
          window.useState = React.useState;
          window.useEffect = React.useEffect;
          window.useRef = React.useRef;
          window.useMemo = React.useMemo;
          window.useCallback = React.useCallback;
          
          try {
            ${cleanCode}
          } catch(e) {
            console.error("Syntax Error: " + e.message);
          }

          setTimeout(() => {
             const targetName = '${componentName}';
             let Target;
             
             if (window[targetName]) Target = window[targetName];
             if (!Target) { try { Target = eval(targetName); } catch(e) {} }

             if (Target) {
                 try {
                    const root = ReactDOM.createRoot(document.getElementById('root'));
                    root.render(React.createElement(Target));
                 } catch(e) {
                    console.error("Render Error: " + e.message);
                 }
             } else {
                 console.error("Component '" + targetName + "' not found. Check function names.");
             }
          }, 50);
        </script>
      </body>
      </html>
    `;
  }
  return '';
};

// --- ENHANCED ANALYSIS ENGINE (Content-Aware) ---
const analyzeContent = (content, filename) => {
  const lower = content.toLowerCase();
  
  // 1. Determine Type
  let type = "html";
  if (filename.endsWith('.jsx') || filename.endsWith('.tsx') || (filename.endsWith('.js') && content.includes('import React'))) {
    type = 'react';
  }

  // 2. Intelligent Fingerprints
  const fingerprints = [
    // --- CREATIVE APPS ---
    { 
      name: "Digital Sketchbook", 
      main: "Apps", sub: "Creative", 
      desc: "A canvas drawing tool. Click and drag to draw lines, change brush colors, and create digital art.", 
      match: (txt) => (txt.includes('canvas') && txt.includes('getcontext')) && (txt.includes('draw') || txt.includes('stroke') || txt.includes('path')) && (txt.includes('mouse') || txt.includes('touch'))
    },
    {
      name: "Music Player",
      main: "Apps", sub: "Media",
      desc: "Audio playback interface. Play, pause, and skip tracks with volume control.",
      match: (txt) => (txt.includes('audio') || txt.includes('mp3')) && (txt.includes('play') && txt.includes('pause') && txt.includes('volume'))
    },
    {
      name: "Note Taker",
      main: "Apps", sub: "Productivity",
      desc: "Text editor for personal notes. Type to save thoughts, often persists to local storage.",
      match: (txt) => (txt.includes('textarea') || txt.includes('contenteditable')) && (txt.includes('note') || txt.includes('save')) && txt.includes('value')
    },

    // --- GAMES ---
    { 
      name: "Tic Tac Toe", 
      main: "Games", sub: "Puzzle", 
      desc: "Classic 3x3 strategy game. Players take turns marking X and O to get three in a row.", 
      match: (txt) => (txt.includes('winner') && txt.includes('squares')) || txt.includes('tictactoe') 
    },
    { 
      name: "Snake Arcade", 
      main: "Games", sub: "Arcade", 
      desc: "Retro snake game. Navigate the snake to eat food and grow longer without hitting walls.", 
      match: (txt) => txt.includes('snake') && (txt.includes('food') || txt.includes('apple')) && txt.includes('direction') 
    },
    { 
      name: "Tetris Block", 
      main: "Games", sub: "Arcade", 
      desc: "Tile-matching puzzle. Rotate falling blocks to clear horizontal lines.", 
      match: (txt) => (txt.includes('tetromino') || txt.includes('tetris')) && txt.includes('grid') 
    },
    
    // --- UTILITIES ---
    { 
      name: "Task Manager", 
      main: "Apps", sub: "Tools", 
      desc: "Productivity list. Add items, check them off, and filter by completion status.", 
      match: (txt) => txt.includes('todo') && (txt.includes('add') || txt.includes('task')) && txt.includes('completed') 
    },
    { 
      name: "Calculator", 
      main: "Apps", sub: "Tools", 
      desc: "Math tool. Perform arithmetic operations like addition, subtraction, and multiplication.", 
      match: (txt) => (txt.includes('calculator') || (txt.includes('add') && txt.includes('subtract') && txt.includes('multiply'))) && txt.includes('display') 
    },
    { 
      name: "Auth Portal", 
      main: "Apps", sub: "Security", 
      desc: "Login/Signup interface. Enter email and password credentials for authentication.", 
      match: (txt) => (txt.includes('password') && txt.includes('email') && txt.includes('submit')) || txt.includes('login') 
    },
    { 
      name: "Integrated System", 
      main: "Apps", sub: "Suite", 
      desc: "A custom merged application combining multiple modules into one dashboard.", 
      match: (txt) => txt.includes('MergedApp') 
    }
  ];

  let result = { 
    name: null, 
    mainCategory: "Apps", 
    subCategory: "Misc", 
    description: "Generic code file.", 
    tags: [type], 
    confidence: 'low', 
    isRenamed: false 
  };

  const match = fingerprints.find(fp => fp.match(lower));
  
  if (match) {
    result = { 
      ...result, 
      name: match.name, 
      mainCategory: match.main, 
      subCategory: match.sub, 
      description: match.desc, 
      confidence: 'high', 
      isRenamed: true, 
      tags: [...result.tags, 'auto-detected'] 
    };
  } else {
     // Fallback: Clean filename if no content match found
     let rawName = filename.replace(/\.(html|jsx|tsx|js)$/, '');
     const funcMatch = content.match(/function\s+(\w+)/);
     if (funcMatch) rawName = funcMatch[1];
     
     let cleanName = rawName
        .replace(/([A-Z])/g, ' $1')
        .replace(/[-_]/g, ' ')
        .replace(/\d+$/, '')
        .trim();
     
     result.name = cleanName.charAt(0).toUpperCase() + cleanName.slice(1) || "Untitled Component";
     result.description = `A generic ${type === 'react' ? 'React' : 'HTML'} file named "${result.name}".`;
     
     if (lower.includes('game') || lower.includes('canvas')) {
         result.mainCategory = "Games";
         result.subCategory = "Casual";
     } else if (lower.includes('chart') || lower.includes('data')) {
         result.subCategory = "Data";
     }
  }
  
  return { ...result, type };
};

// --- MOCK DATA FOR FRONTEND MODE ---
const MOCK_FILES = [
  {
    id: 'mock-1',
    originalName: 'tictactoe.jsx',
    name: 'Tic Tac Toe',
    description: 'Classic 3x3 strategy game. Players take turns marking X and O to get three in a row.',
    type: 'react',
    mainCategory: 'Games',
    subCategory: 'Puzzle',
    content: `
import React, { useState } from 'react';

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (calculateWinner(board) || board[i]) return;
    const nextBoard = board.slice();
    nextBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(board);
  const status = winner ? 'Winner: ' + winner : 'Next player: ' + (xIsNext ? 'X' : 'O');

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-black text-white min-h-[300px] rounded-lg border border-slate-800">
      <div className="mb-4 text-xl font-bold">{status}</div>
      <div className="grid grid-cols-3 gap-2">
        {board.map((square, i) => (
          <button
            key={i}
            className="w-16 h-16 bg-slate-800 hover:bg-slate-700 text-2xl font-bold rounded flex items-center justify-center transition-colors"
            onClick={() => handleClick(i)}
          >
            {square}
          </button>
        ))}
      </div>
      <button 
        onClick={() => setBoard(Array(9).fill(null))}
        className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-sm font-medium transition-colors"
      >
        Reset Game
      </button>
    </div>
  );
}
    `,
    uploadDate: new Date().toISOString(),
    aiTags: ['react', 'auto-detected'],
    isRenamed: true,
    confidence: 'high'
  },
  {
    id: 'mock-2',
    originalName: 'todo.jsx',
    name: 'Task Manager',
    description: 'Productivity list. Add items, check them off, and filter by completion status.',
    type: 'react',
    mainCategory: 'Apps',
    subCategory: 'Tools',
    content: `
import React, { useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
    setInput('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-black rounded-lg shadow-lg text-slate-100 border border-slate-800">
      <h2 className="text-2xl font-bold mb-4 text-emerald-400">Task Manager</h2>
      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 bg-black border border-slate-700 rounded focus:outline-none focus:border-emerald-500"
        />
        <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded font-medium">Add</button>
      </form>
      <ul className="space-y-2">
        {todos.length === 0 && <li className="text-slate-500 text-center italic">No tasks yet. Add one above!</li>}
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded group">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="w-5 h-5 accent-emerald-500 cursor-pointer"
            />
            <span className={\`flex-1 \${todo.completed ? 'line-through text-slate-500' : ''}\`}>{todo.text}</span>
            <button 
              onClick={() => deleteTodo(todo.id)}
              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
    `,
    uploadDate: new Date(Date.now() - 86400000).toISOString(),
    aiTags: ['react', 'auto-detected'],
    isRenamed: true,
    confidence: 'high'
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [files, setFiles] = useState(MOCK_FILES);
  const [user, setUser] = useState({ uid: 'mock-user', isAnonymous: true });
  const [activeFilter, setActiveFilter] = useState({ type: 'all' });
  const [expandedFolders, setExpandedFolders] = useState({ 'Games': true, 'Apps': true });
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Selection & Compose
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [dragActive, setDragActive] = useState(false);
  const dragCounter = useRef(0);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const fileInputRef = useRef(null);

  // Mock initial load
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
        // Files already loaded from mock
    }, 500);
  }, []);

  const handleSignIn = () => {
    setUser({ uid: 'mock-user', isAnonymous: true });
    setCurrentView('dashboard');
    toast.success("Signed in anonymously");
  };

  const getSubcategories = (mainCat) => {
    const cats = new Set(files.filter(f => f.mainCategory === mainCat).map(f => f.subCategory));
    return Array.from(cats).sort();
  };

  const filteredFiles = files.filter(f => {
    const search = searchQuery.toLowerCase();
    const matchesSearch = f.name.toLowerCase().includes(search) || (f.description && f.description.toLowerCase().includes(search));
    if (activeFilter.type === 'main') return f.mainCategory === activeFilter.value && matchesSearch;
    if (activeFilter.type === 'sub') return f.mainCategory === activeFilter.parent && f.subCategory === activeFilter.value && matchesSearch;
    return matchesSearch;
  });

  const toggleFolder = (name) => setExpandedFolders(prev => ({ ...prev, [name]: !prev[name] }));

  // --- ACTIONS ---
  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); dragCounter.current++; if (e.dataTransfer.items?.length) setDragActive(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); dragCounter.current--; if (dragCounter.current === 0) setDragActive(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => { 
    e.preventDefault(); e.stopPropagation(); setDragActive(false); dragCounter.current = 0; 
    if (e.dataTransfer.files?.length) {
        if(currentView === 'home' && user) setCurrentView('dashboard');
        processFiles(e.dataTransfer.files);
    }
  };

  const processFiles = async (fileList) => {
    if (!user) return toast.error("Auth required.");
    setIsUploading(true);
    setStatusMessage("Analyzing Content...");
    
    const newFiles = [];
    for (const f of Array.from(fileList)) {
        if (!f.name.match(/\.(html|jsx|tsx|js)$/)) continue;
        const text = await f.text();
        const analysis = analyzeContent(text, f.name);
        newFiles.push({
            id: 'file-' + Date.now() + Math.random().toString(36).substr(2, 9),
            originalName: f.name,
            name: analysis.name, description: analysis.description, type: analysis.type,
            mainCategory: analysis.mainCategory, subCategory: analysis.subCategory,
            content: text, uploadDate: new Date().toISOString(), aiTags: analysis.tags,
            isRenamed: analysis.isRenamed, confidence: analysis.confidence
        });
    }
    
    setTimeout(() => {
        setFiles(prev => [...prev, ...newFiles]);
        setIsUploading(false);
        toast.success(`Imported ${newFiles.length} files successfully`);
    }, 1000);
  };

  const handleCompose = async () => {
    if (selectedIds.size < 2) return toast.error("Select at least 2 files.");
    setIsUploading(true);
    setStatusMessage("Integrating...");

    const selectedFiles = files.filter(f => selectedIds.has(f.id));
    
    const mergedComponents = selectedFiles.map((f, index) => {
        let safeName = f.name.replace(/[^a-zA-Z0-9]/g, '');
        safeName = safeName.charAt(0).toUpperCase() + safeName.slice(1) || 'Comp';
        safeName = `${safeName}_${index + 1}`; 
        
        let code = f.content;

        if (f.type === 'html' || f.originalName.endsWith('.html')) {
            const escapedContent = JSON.stringify(f.content);
            code = `const ${safeName} = () => (<div className="w-full h-96 border border-slate-700 rounded-lg overflow-hidden bg-white relative"><iframe srcDoc={${escapedContent}} title="${safeName}" className="w-full h-full border-none"/></div>);`;
        } else {
            code = code.replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, ''); 
            const funcMatch = code.match(/function\s+(\w+)/);
            const constMatch = code.match(/const\s+(\w+)\s*=\s*\(/);
            let originalName = 'App';
            if (funcMatch) originalName = funcMatch[1];
            else if (constMatch) originalName = constMatch[1];
            const nameRegex = new RegExp(`\\b${originalName}\\b`, 'g');
            code = code.replace(nameRegex, safeName);
            code = code.replace(/export\s+default\s+/g, '');
            code = code.replace(/export\s+/g, '');
        }
        return { name: safeName, code };
    });

    const composedCode = `
import React, { useState, useEffect, useRef } from 'react';

// --- MODULES ---
${mergedComponents.map(c => `// Module: ${c.name}\n${c.code}`).join('\n\n')}

// --- COMPOSITION ---
export default function MergedApp() {
  return (
    <div className="min-h-screen bg-slate-900 p-8 font-sans text-slate-200">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold text-white">Integrated System</h1>
        <p className="text-slate-400">Composition of ${selectedIds.size} active modules.</p>
      </header>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        ${mergedComponents.map(c => `
        <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex flex-col shadow-xl">
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 text-xs font-bold uppercase text-emerald-500 tracking-wider">
               Module: ${c.name}
            </div>
            <div className="p-6 flex-1 bg-slate-950 text-slate-300">
               <${c.name} />
            </div>
        </div>
        `).join('\n')}
      </div>
    </div>
  );
}
    `;

    const newFile = {
        id: 'composed-' + Date.now(),
        originalName: `composed_${Date.now()}.jsx`,
        name: `Integrated System ${new Date().toLocaleTimeString()}`,
        description: `Auto-generated composition containing: ${selectedFiles.map(f => f.name).join(', ')}.`,
        type: 'react', mainCategory: 'Apps', subCategory: 'Suite',
        content: composedCode, uploadDate: new Date().toISOString(),
        aiTags: ['react', 'composed'], isRenamed: true, confidence: 'high'
    };

    setTimeout(() => {
        setFiles(prev => [newFile, ...prev]);
        setIsUploading(false);
        setIsSelectionMode(false);
        setSelectedIds(new Set());
        toast.success("Composition created successfully");
    }, 1000);
  };

  const handleDelete = async (id) => {
    if (!user) return;
    setFiles(prev => prev.filter(f => f.id !== id));
    if (selectedFile?.id === id) { setSelectedFile(null); setIsPreviewExpanded(false); }
    toast.success("File deleted");
  };

  const handleFileClick = (file) => {
    if (isSelectionMode) {
        setSelectedIds(prev => {const n = new Set(prev); n.has(file.id) ? n.delete(file.id) : n.add(file.id); return n;});
    } else {
        setSelectedFile(file);
        setIsPreviewExpanded(false);
        setIsRenaming(false);
    }
  };

  const saveRename = async () => {
    if (selectedFile && renameValue.trim() && user) {
        setFiles(prev => prev.map(f => f.id === selectedFile.id ? { ...f, name: renameValue.trim() } : f));
        setSelectedFile(prev => ({ ...prev, name: renameValue.trim() }));
        setIsRenaming(false);
        toast.success("File renamed");
    }
  };

  const revertName = async () => {
    if (selectedFile && user) {
        const originalName = selectedFile.originalName || 'Untitled';
        setFiles(prev => prev.map(f => f.id === selectedFile.id ? { ...f, name: originalName } : f));
        setSelectedFile(prev => ({ ...prev, name: originalName }));
        setIsRenaming(false);
        toast.success("Reverted to original filename");
    }
  };

  // --- RENDER ---
  return (
    <div 
        className="flex h-screen w-full bg-black text-slate-200 overflow-hidden font-sans"
        onDragEnter={handleDragEnter} 
        onDragLeave={handleDragLeave} 
        onDragOver={handleDragOver} 
        onDrop={handleDrop}
    >
      <Toaster position="top-center" theme="dark" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Agdasima:wght@400;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap');
      `}</style>

      {/* DRAG OVERLAY */}
      <AnimatePresence>
      {dragActive && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-emerald-500/20 backdrop-blur-sm border-4 border-emerald-500 border-dashed flex items-center justify-center"
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-black p-8 rounded-2xl shadow-2xl flex flex-col items-center border border-slate-800"
            >
                <Upload size={64} className="text-emerald-400 mb-4 animate-bounce" />
                <h2 className="text-3xl font-bold text-white font-[Orbitron]">Drop to Analyze</h2>
                <p className="text-emerald-400 mt-2">React components & HTML files supported</p>
            </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* LOADING OVERLAY */}
      <AnimatePresence>
      {isUploading && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-black/80 backdrop-blur flex items-center justify-center"
        >
            <div className="bg-black p-8 rounded-xl border border-slate-800 shadow-2xl flex flex-col items-center max-w-sm text-center">
                <Loader2 size={48} className="text-emerald-500 animate-spin mb-4" />
                <h3 className="text-xl font-bold text-white mb-2 font-[Orbitron]">{statusMessage}</h3>
                <p className="text-slate-400 text-sm">Our AI is processing your code structure...</p>
            </div>
        </motion.div>
      )}
      </AnimatePresence>

      {currentView === 'home' ? (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col relative bg-black"
        >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay bg-[#00000000]"></div>
            
            <header className="p-8 z-10 flex justify-between items-center bg-[#000000]">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden bg-[#000000]">
                        <img src={image_e445675206871cec79cef549e2b20441d5384b86} className="w-6 h-6 object-contain" alt="Logo" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white font-[Orbitron]">CodeCanvas <span className="text-emerald-500">AI</span></span>
                </div>
                <button onClick={handleSignIn} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-medium transition-all border border-slate-700 hover:border-slate-600">
                    Access Dashboard
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-8 z-10 text-center max-w-4xl mx-auto bg-[#000000] rounded-3xl border border-slate-800/50 shadow-2xl">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8 bg-[#4b00bc1a]"
                >
                    <img src={image_ad8edfc3316a9245cb431a68f1f71432dd018492} className="w-3.5 h-3.5 object-contain" alt="Sparkles" />
                    <span className="text-[#0043d4] font-bold">Now with Intelligent Composition</span>
                </motion.div>
                
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight font-[Orbitron]"
                >
                    Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">App Factory</span>
                </motion.h1>
                
                <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed"
                >
                    Upload React components and HTML snippets. Organize, preview, and combine them into full applications instantly.
                </motion.p>

                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <button 
                        onClick={() => document.getElementById('file-upload').click()}
                        className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-105 flex items-center justify-center gap-3 font-[Orbitron]"
                    >
                        <Upload size={20} />
                        Upload Code File
                    </button>
                    <button 
                         onClick={handleSignIn}
                        className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-3 text-center font-bold text-[#040ab7] text-[20px] font-[Orbitron]"
                    >
                        Open Dashboard
                        <ArrowRight size={20} />
                    </button>
                </motion.div>
                <input 
                    type="file" 
                    id="file-upload"
                    multiple 
                    className="hidden" 
                    onChange={(e) => {
                        if (e.target.files.length) {
                            handleSignIn();
                            processFiles(e.target.files);
                        }
                    }} 
                />
            </main>
            
            <footer className="p-8 z-10 text-center text-sm text-[#1744d8] font-[Orbitron]">
                &copy; {new Date().getFullYear()} CodeCanvas AI. Secure & Local.
            </footer>
        </motion.div>
      ) : (
        /* DASHBOARD VIEW */
        <div className="flex w-full h-full">
            {/* SIDEBAR */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-black border-r border-slate-800 flex flex-col overflow-hidden shrink-0`}>
                <div className="p-4 flex items-center gap-3 border-b border-slate-800 h-16 shrink-0">
                    <div className="size-8 rounded flex items-center justify-center shadow-lg shadow-emerald-500/20 bg-[#0d3024]">
                        <img src={image_e445675206871cec79cef549e2b20441d5384b86} className="w-5 h-5 object-contain" alt="Logo" />
                    </div>
                    <span className="font-bold text-white tracking-tight font-[Agdasima] text-xl">CodeCanvas</span>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                    <button 
                        onClick={() => { setActiveFilter({ type: 'all' }); setIsSelectionMode(false); setSelectedFile(null); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter.type === 'all' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
                    >
                        <LayoutGrid size={18} />
                        All Artifacts
                    </button>
                    
                    <div className="pt-4 pb-2 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                        <span>Library</span>
                        <Layers size={12} />
                    </div>

                    {/* CATEGORIES */}
                    {['Games', 'Apps'].map(cat => (
                        <div key={cat} className="space-y-1">
                            <button 
                                onClick={() => toggleFolder(cat)}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800/50 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    {cat === 'Games' ? <Gamepad2 size={18} className="text-purple-400" /> : <AppWindow size={18} className="text-blue-400" />}
                                    {cat}
                                </div>
                                {expandedFolders[cat] ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                            </button>
                            
                            {expandedFolders[cat] && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="ml-9 space-y-1 border-l border-slate-800 pl-2 overflow-hidden"
                                >
                                    {getSubcategories(cat).map(sub => (
                                        <button
                                            key={sub}
                                            onClick={() => { setActiveFilter({ type: 'sub', parent: cat, value: sub }); setIsSelectionMode(false); }}
                                            className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${activeFilter.type === 'sub' && activeFilter.value === sub ? 'text-emerald-400 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            {sub}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-800 bg-black">
                     <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                        <Home size={12} />
                        Back to Home
                     </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col min-w-0 bg-black relative">
                {/* TOP BAR */}
                <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 bg-black shrink-0 z-20">
                    <div className="flex items-center gap-4 flex-1">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">
                            <Menu size={20} />
                        </button>
                        <div className="relative flex-1 max-w-md hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search artifacts..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 text-slate-200 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                         {isSelectionMode ? (
                            <div className="flex items-center gap-2 mr-4 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                                <span className="text-sm font-bold text-emerald-400">{selectedIds.size} Selected</span>
                                <button onClick={handleCompose} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-3 py-1 text-xs font-bold rounded shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all">
                                    <GitMerge size={14} /> Combine
                                </button>
                                <button onClick={() => { setIsSelectionMode(false); setSelectedIds(new Set()); }} className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded">
                                    <X size={14} />
                                </button>
                            </div>
                         ) : (
                            <button 
                                onClick={() => setIsSelectionMode(true)}
                                className="px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <CheckCircle size={16} /> Select
                            </button>
                         )}

                        <div className="h-6 w-px bg-slate-800 mx-2"></div>

                        <div className="flex bg-black p-1 rounded-lg border border-slate-800">
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <List size={16} />
                            </button>
                        </div>
                        
                        <button 
                            onClick={() => document.getElementById('file-upload-dash').click()}
                            className="ml-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-emerald-500/10 transition-colors flex items-center gap-2"
                        >
                            <Upload size={16} />
                            <span className="hidden sm:inline">Import</span>
                        </button>
                        <input type="file" id="file-upload-dash" multiple className="hidden" onChange={(e) => processFiles(e.target.files)} />
                    </div>
                </header>

                {/* FILE GRID/LIST */}
                <div className="flex-1 overflow-y-auto p-6">
                    {filteredFiles.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <div className="size-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6">
                                <Search size={32} className="opacity-50" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-300 mb-2 font-[Orbitron]">No artifacts found</h3>
                            <p className="max-w-xs text-center mb-8">Try adjusting your search filters or import new code files.</p>
                            <button 
                                onClick={() => document.getElementById('file-upload-dash').click()}
                                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 font-medium"
                            >
                                <Upload size={16} /> Upload Files
                            </button>
                        </div>
                    ) : (
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredFiles.map(file => (
                                    <motion.div 
                                        key={file.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={() => handleFileClick(file)}
                                        className={`group relative bg-black border ${selectedFile?.id === file.id || selectedIds.has(file.id) ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-slate-800 hover:border-slate-700'} rounded-xl overflow-hidden transition-all hover:shadow-xl hover:shadow-black/20 cursor-pointer flex flex-col h-48`}
                                    >
                                        <div className="absolute top-3 left-3 z-10 flex gap-2">
                                            {isSelectionMode && (
                                                <div className={`size-5 rounded border flex items-center justify-center transition-colors ${selectedIds.has(file.id) ? 'bg-emerald-500 border-emerald-500 text-slate-900' : 'bg-slate-950/50 border-slate-600'}`}>
                                                    {selectedIds.has(file.id) && <Check size={12} strokeWidth={4} />}
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}
                                                className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg backdrop-blur-sm transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        {/* PREVIEW THUMBNAIL AREA */}
                                        <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-black to-slate-800"></div>
                                            {file.type === 'react' ? (
                                                <Code size={48} className="text-slate-700 group-hover:text-emerald-500/50 transition-colors relative z-0" />
                                            ) : (
                                                <Globe size={48} className="text-slate-700 group-hover:text-blue-500/50 transition-colors relative z-0" />
                                            )}
                                            
                                            {/* Labels */}
                                            <div className="absolute bottom-2 left-2 flex gap-1">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 uppercase tracking-wider">{file.type}</span>
                                                {file.aiTags.includes('auto-detected') && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                                                        <Sparkles size={8} /> AI
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-4 bg-black border-t border-slate-800">
                                            <h4 className="font-bold text-slate-200 truncate pr-4 text-sm font-[Orbitron]">{file.name}</h4>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-xs text-slate-500">{file.subCategory}</span>
                                                <span className="text-[10px] text-slate-600">{new Date(file.uploadDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-black border border-slate-800 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-black text-slate-500 font-medium border-b border-slate-800">
                                        <tr>
                                            <th className="px-4 py-3 w-10"></th>
                                            <th className="px-4 py-3">Name</th>
                                            <th className="px-4 py-3">Type</th>
                                            <th className="px-4 py-3">Category</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {filteredFiles.map(file => (
                                            <tr 
                                                key={file.id}
                                                onClick={() => handleFileClick(file)}
                                                className={`group hover:bg-slate-800/50 transition-colors cursor-pointer ${selectedFile?.id === file.id ? 'bg-slate-800/80' : ''}`}
                                            >
                                                <td className="px-4 py-3">
                                                    {isSelectionMode ? (
                                                       <div className={`size-4 rounded border flex items-center justify-center ${selectedIds.has(file.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                                                            {selectedIds.has(file.id) && <Check size={10} className="text-slate-900" strokeWidth={4} />}
                                                       </div>
                                                    ) : (
                                                        file.type === 'react' ? <Code size={16} className="text-emerald-500" /> : <Globe size={16} className="text-blue-500" />
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-slate-200">{file.name}</td>
                                                <td className="px-4 py-3 text-slate-400 capitalize">{file.type}</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs border border-slate-700">
                                                        {file.mainCategory} / {file.subCategory}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500">{new Date(file.uploadDate).toLocaleDateString()}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}
                                                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                </div>
            </main>

            {/* PREVIEW PANEL */}
            <AnimatePresence>
            {selectedFile && (
                <motion.div 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`${isPreviewExpanded ? 'w-[800px] absolute right-0 inset-y-0 z-30 shadow-2xl' : 'w-96 border-l border-slate-800'} bg-black flex flex-col transition-all duration-300 shrink-0 shadow-xl`}
                >
                    <div className="h-16 border-b border-slate-800 flex items-center justify-between px-4 bg-black shrink-0">
                         <div className="flex items-center gap-2 overflow-hidden">
                             <span className="font-bold text-slate-200 truncate max-w-[200px] font-[Orbitron]">{selectedFile.name}</span>
                             {selectedFile.isRenamed && (
                                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded uppercase">AI Named</span>
                             )}
                         </div>
                         <div className="flex items-center gap-1">
                             <button 
                                onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                             >
                                 {isPreviewExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                             </button>
                             <button 
                                onClick={() => setSelectedFile(null)}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                             >
                                 <X size={16} />
                             </button>
                         </div>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-black relative">
                        {/* IFRAME PREVIEW */}
                        <div className="w-full h-full flex flex-col">
                            <div className="bg-black border-b border-slate-800 px-4 py-2 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Eye size={12} /> Live Preview
                                </span>
                                <div className="flex gap-2">
                                    <div className="size-2 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                    <div className="size-2 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                    <div className="size-2 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                </div>
                            </div>
                            <div className="flex-1 bg-white relative">
                                <iframe 
                                    srcDoc={generatePreview(selectedFile)}
                                    title="preview"
                                    className="w-full h-full border-none"
                                    sandbox="allow-scripts"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-800 bg-black">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wide font-[Orbitron]">Properties</h3>
                            <button 
                                onClick={() => { setIsRenaming(!isRenaming); setRenameValue(selectedFile.name); }}
                                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                            >
                                {isRenaming ? 'Cancel' : 'Edit Name'}
                            </button>
                        </div>

                        {isRenaming ? (
                            <div className="mb-4 space-y-2 bg-black p-3 rounded-lg border border-slate-700">
                                <input 
                                    ref={fileInputRef}
                                    value={renameValue}
                                    onChange={(e) => setRenameValue(e.target.value)}
                                    className="w-full bg-black border border-slate-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    autoFocus
                                />
                                <div className="flex gap-2 justify-end">
                                    <button onClick={revertName} className="text-xs text-slate-400 hover:text-white px-2 py-1">Revert</button>
                                    <button onClick={saveRename} className="text-xs bg-emerald-600 text-white px-3 py-1 rounded font-bold hover:bg-emerald-500">Save</button>
                                </div>
                            </div>
                        ) : null}

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Description</label>
                                <p className="text-sm text-slate-300 leading-relaxed bg-black p-3 rounded-lg border border-slate-800">
                                    {selectedFile.description || "No description available."}
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">Category</label>
                                    <div className="text-sm text-slate-300 flex items-center gap-2">
                                        <Tag size={12} className="text-emerald-500" />
                                        {selectedFile.mainCategory}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">Subcategory</label>
                                    <div className="text-sm text-slate-300">{selectedFile.subCategory}</div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-slate-500 block mb-1">AI Confidence</label>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${selectedFile.confidence === 'high' ? 'bg-emerald-500 w-[95%]' : selectedFile.confidence === 'medium' ? 'bg-yellow-500 w-[60%]' : 'bg-red-500 w-[30%]'}`}
                                    ></div>
                                </div>
                            </div>
                            
                            <button className="w-full py-2.5 bg-black hover:bg-slate-900 text-white text-sm font-bold rounded-lg border border-slate-700 hover:border-slate-600 transition-colors flex items-center justify-center gap-2 group font-[Orbitron]">
                                <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> Download Source
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
      )}
    </div>
  );
}
