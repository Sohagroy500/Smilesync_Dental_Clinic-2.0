import React, { useState } from 'react';
import { Code, Copy, Check, Download, Folder, FileCode, Terminal, Sparkles } from 'lucide-react';
import JSZip from 'jszip';
import { ADK_STARTER_FILES } from '../data/adkTemplateFiles';
import { AdkFile } from '../types';

export const AdkCodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AdkFile>(ADK_STARTER_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("adk_2.0_dental_agent_template");

      ADK_STARTER_FILES.forEach(file => {
        folder?.file(file.path, file.content);
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "smilesync_adk2.0_graph_starter_template.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate zip:", err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl shadow-blue-900/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-700">
              ADK 2.0 Graph Workflow API Starter Kit
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Python ADK 2.0 Starter Template Directory
          </h2>
          <p className="text-xs text-slate-500">
            Inspect or download the production-ready Python project folder implementing function nodes (<code className="font-mono text-teal-700 font-bold">FAQs_Answer</code>, <code className="font-mono text-sky-700 font-bold">book_appoint</code>, <code className="font-mono text-amber-700 font-bold">send_mail</code> with <code className="font-mono font-bold">RequestInput</code>).
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>{isZipping ? 'Generating Zip Archive...' : 'Download ADK 2.0 Starter Zip'}</span>
        </button>
      </div>

      {/* Main Code Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
        
        {/* Left File Tree Sidebar (4 cols) */}
        <div className="lg:col-span-4 p-4 border-r border-slate-800 bg-slate-900/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider pb-2 border-b border-slate-800">
            <Folder className="w-4 h-4" />
            <span>adk_starter_template/</span>
          </div>

          <div className="space-y-1">
            {ADK_STARTER_FILES.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between ${
                  selectedFile.path === file.path
                    ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span className="truncate">{file.path}</span>
                </div>
                <span className="text-[10px] uppercase text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                  {file.language}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-bold text-slate-300">File Description:</p>
            <p className="leading-relaxed text-slate-400">{selectedFile.description}</p>
          </div>
        </div>

        {/* Right Code Editor View (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-[560px]">
          
          {/* Top Bar */}
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
              <Code className="w-4 h-4 text-cyan-400" />
              <span>{selectedFile.path}</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Syntax Code Container */}
          <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 leading-relaxed bg-slate-950 selection:bg-cyan-900 selection:text-white">
            <pre className="whitespace-pre">
              {selectedFile.content}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};
