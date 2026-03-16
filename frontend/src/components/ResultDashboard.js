import React from 'react';

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
  const { matchScore, matchedSkills, missingSkills } = result;

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
            <p className="text-sm text-gray-400 mt-1">Results ready</p>
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

