import React, { useState } from 'react';
import { CLINIC_BLOG_POSTS } from '../data/dentalData';
import { BlogPost } from '../types';
import { BookOpen, Clock, User, ArrowRight, X, Calendar } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section id="blog" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-sky-300">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          Oral Health & Wellness Insights
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Dental Care <span className="text-blue-600 dark:text-sky-400">Articles & Guides</span>
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Expert tips, patient guides, and clinical advice written directly by our board-certified dental specialists.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {CLINIC_BLOG_POSTS.map((post) => (
          <div
            key={post.id}
            className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-800 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Article Image Header */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md">
                  {post.category}
                </span>
              </div>

              {/* Article Body */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-500" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 font-normal">
                  {post.summary}
                </p>
              </div>
            </div>

            {/* Read More Footer */}
            <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-4">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[160px]">
                By {post.author}
              </span>

              <button
                onClick={() => setSelectedPost(post)}
                className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:text-blue-700 flex items-center gap-1.5 transition-colors group-hover:translate-x-1"
              >
                <span>Read More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-10 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-sky-400">
                {selectedPost.category}
              </span>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {selectedPost.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium border-y border-slate-100 dark:border-slate-800 py-3">
              <span>Author: <strong className="text-slate-900 dark:text-white">{selectedPost.author}</strong></span>
              <span>•</span>
              <span>Published: {selectedPost.date}</span>
              <span>•</span>
              <span>{selectedPost.readTime}</span>
            </div>

            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-72 object-cover rounded-2xl"
            />

            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="font-semibold text-slate-900 dark:text-white text-base">
                {selectedPost.summary}
              </p>
              <p>
                Maintaining optimal dental health requires a combination of clinical precision and disciplined home hygiene. At SmileSync, our clinical team emphasizes preventive care above all else. Regular professional checkups allow us to identify early micro-calcifications or enamel vulnerabilities before they develop into major tooth issues.
              </p>
              <p>
                Whether you have recently undergone laser whitening, Invisalign aligner therapy, or porcelain veneer placement, taking proactive daily steps—such as non-abrasive brushing, flossing, and minimizing acidic beverages—ensures long-lasting aesthetic and structural brilliance.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
