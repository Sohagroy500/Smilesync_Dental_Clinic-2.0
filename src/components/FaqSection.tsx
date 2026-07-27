import React, { useState } from 'react';
import { CLINIC_FAQS } from '../data/dentalData';
import { HelpCircle, ChevronDown, Sparkles, Search } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string>(CLINIC_FAQS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = CLINIC_FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-sky-300">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          Got Questions? We Have Answers
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Frequently Asked <span className="text-blue-600 dark:text-sky-400">Questions</span>
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Find instant clear answers about our treatments, pricing, insurance acceptance, and clinic safety protocols.
        </p>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-6" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., insurance, whitening)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-2xl transition-all duration-200 overflow-hidden border ${
                isOpen
                  ? 'bg-white dark:bg-slate-900 border-blue-500/50 dark:border-blue-500/50 shadow-lg shadow-blue-500/5'
                  : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => setOpenId(isOpen ? '' : faq.id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-base sm:text-lg focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-lg">
                    {faq.category}
                  </span>
                  <span>{faq.question}</span>
                </div>
                <div className={`w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
};
