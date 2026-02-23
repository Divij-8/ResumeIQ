import React from 'react';

// Lightweight markdown → JSX renderer (no deps needed)
const renderMarkdown = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  const parseInline = (str) => {
    const parts = [];
    let remaining = str;
    let key = 0;
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)/s);
      const italicMatch = remaining.match(/^(.*?)_(.+?)_(.*)/s);
      const codeMatch = remaining.match(/^(.*?)`(.+?)`(.*)/s);
      if (boldMatch && (!italicMatch || boldMatch[1].length <= italicMatch[1].length) && (!codeMatch || boldMatch[1].length <= codeMatch[1].length)) {
        if (boldMatch[1]) parts.push(<span key={key++}>{boldMatch[1]}</span>);
        parts.push(<strong key={key++} className="font-semibold text-white">{boldMatch[2]}</strong>);
        remaining = boldMatch[3];
      } else if (italicMatch && (!codeMatch || italicMatch[1].length <= codeMatch[1].length)) {
        if (italicMatch[1]) parts.push(<span key={key++}>{italicMatch[1]}</span>);
        parts.push(<em key={key++} className="italic text-purple-200">{italicMatch[2]}</em>);
        remaining = italicMatch[3];
      } else if (codeMatch) {
        if (codeMatch[1]) parts.push(<span key={key++}>{codeMatch[1]}</span>);
        parts.push(<code key={key++} className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-yellow-200">{codeMatch[2]}</code>);
        remaining = codeMatch[3];
      } else {
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }
    }
    return parts;
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) { elements.push(<div key={i} className="h-3" />); i++; continue; }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-base font-bold text-yellow-300 uppercase tracking-widest mt-5 mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />
          {trimmed.slice(4)}
        </h3>
      );
      i++; continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-lg font-bold text-white mt-6 mb-3 border-b border-white/20 pb-1">
          {trimmed.slice(3)}
        </h2>
      );
      i++; continue;
    }
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-xl font-extrabold text-white mt-4 mb-3">{trimmed.slice(2)}</h1>
      );
      i++; continue;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = [];
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        items.push(
          <li key={i} className="flex items-start gap-2 text-white/90 text-sm leading-relaxed">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-300 flex-shrink-0" />
            <span>{parseInline(lines[i].trim().slice(2))}</span>
          </li>
        );
        i++;
      }
      elements.push(<ul key={`ul-${i}`} className="space-y-1.5 my-2 ml-1">{items}</ul>);
      continue;
    }

    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      const num = parseInt(numberedMatch[1]);
      const items = [];
      let j = i;
      while (j < lines.length && lines[j].trim().match(/^\d+\.\s+/)) {
        const m = lines[j].trim().match(/^(\d+)\.\s+(.*)/);
        items.push(
          <li key={j} className="flex items-start gap-3 text-white/90 text-sm leading-relaxed">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-purple-200">
              {parseInt(lines[j].trim().match(/^(\d+)/)[1])}
            </span>
            <span className="pt-0.5">{parseInline(m[2])}</span>
          </li>
        );
        j++;
      }
      elements.push(<ol key={`ol-${i}`} className="space-y-2 my-3 ml-1">{items}</ol>);
      i = j;
      continue;
    }

    if (trimmed === '---' || trimmed === '***') {
      elements.push(<hr key={i} className="border-white/20 my-4" />);
      i++; continue;
    }

    elements.push(
      <p key={i} className="text-white/85 text-sm leading-relaxed">{parseInline(trimmed)}</p>
    );
    i++;
  }

  return elements;
};

const ScoreRing = ({ score }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  const label = score >= 70 ? 'Strong Match' : score >= 40 ? 'Good Match' : 'Needs Work';
  const emoji = score >= 70 ? '🎉' : score >= 40 ? '👍' : '💪';

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="180" className="-rotate-90">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="14" />
        <circle
          cx="90" cy="90" r={radius} fill="none"
          stroke={color} strokeWidth="14"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="relative" style={{ marginTop: '-118px', marginBottom: '38px' }}>
        <div className="text-center">
          <div className="text-5xl font-black text-gray-900">{Math.round(score)}%</div>
          <div className="text-xs text-gray-500 mt-0.5 font-medium uppercase tracking-widest">Match Score</div>
        </div>
      </div>
      <span className="text-xl font-bold text-gray-800">{emoji} {label}</span>
    </div>
  );
};



const ResultDashboard = ({ result, onReset }) => {
  const { matchScore, matchedSkills, missingSkills, aiAnalysis } = result;

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500" />

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Analysis</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">Powered by ResumeIQ AI · Results ready</p>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-gray-300 hover:text-white transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New Analysis
          </button>
        </div>

        {/* Score + quick stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Score Card */}
          <div className="md:col-span-1 bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl shadow-black/30">
            <ScoreRing score={matchScore} />
          </div>

          {/* Stats */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/10 border border-emerald-500/30 rounded-2xl p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Matched Skills</span>
              </div>
              <div className="text-4xl font-black text-white">{matchedSkills?.length || 0}</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {matchedSkills?.slice(0, 4).map((s, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">{s}</span>
                ))}
                {(matchedSkills?.length || 0) > 4 && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">+{matchedSkills.length - 4} more</span>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-500/20 to-red-600/10 border border-rose-500/30 rounded-2xl p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Skill Gaps</span>
              </div>
              <div className="text-4xl font-black text-white">{missingSkills?.length || 0}</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {missingSkills?.length === 0
                  ? <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">All skills matched 🎉</span>
                  : missingSkills?.slice(0, 4).map((s, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">{s}</span>
                  ))}
                {(missingSkills?.length || 0) > 4 && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">+{missingSkills.length - 4} more</span>
                )}
              </div>
            </div>

            {/* Skills breakdown bar */}
            <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Coverage Breakdown</span>
                <span className="text-xs text-gray-500">{matchedSkills?.length || 0} of {(matchedSkills?.length || 0) + (missingSkills?.length || 0)} skills</span>
              </div>
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-400 transition-all duration-700"
                  style={{ width: `${matchScore}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span className="text-emerald-400">● Matched ({matchedSkills?.length || 0})</span>
                <span className="text-rose-400">● Missing ({missingSkills?.length || 0})</span>
              </div>
            </div>
          </div>
        </div>

        {/* All Skills Full Detail */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              All Matched Skills
            </h3>
            {matchedSkills?.length > 0
              ? <div className="flex flex-wrap gap-2">
                  {matchedSkills.map((s, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-sm font-medium">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {s}
                    </span>
                  ))}
                </div>
              : <p className="text-gray-500 text-sm italic">No skills matched</p>}
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Skills to Develop
            </h3>
            {missingSkills?.length > 0
              ? <div className="flex flex-wrap gap-2">
                  {missingSkills.map((s, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm font-medium">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                      {s}
                    </span>
                  ))}
                </div>
              : <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <span>🎉</span> You matched every required skill!
                </div>}
          </div>
        </div>

        {/* AI Analysis — always shown */}
        <div id="ai-full-report" className="rounded-2xl overflow-hidden border border-violet-500/30 shadow-2xl shadow-violet-900/20">
          {/* Header bar */}
          <div className="bg-gradient-to-r from-violet-600/80 to-blue-600/80 backdrop-blur-sm px-6 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white">ResumeIQ AI Analysis</h2>
              <p className="text-xs text-violet-200">Generated by ResumeIQ AI · Full Report</p>
            </div>
          </div>
          {/* Content */}
          <div className="bg-gradient-to-br from-[#1a1030] to-[#0d1428] px-6 py-5">
            {aiAnalysis ? (
              <div className="prose prose-invert max-w-none space-y-1">
                {renderMarkdown(aiAnalysis)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-base mb-1">AI Summary Unavailable</p>
                  <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                    The Gemini API key is missing or invalid. Add a valid key to{' '}
                    <code className="text-violet-300 bg-white/10 px-1.5 py-0.5 rounded text-xs">application.properties</code>{' '}
                    and restart the backend to enable AI summaries.
                  </p>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Get a free Gemini API key →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer action */}
        <button
          onClick={onReset}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-base shadow-xl shadow-violet-900/30 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Analyze Another Resume
        </button>
      </div>
    </div>
  );
};

export default ResultDashboard;

