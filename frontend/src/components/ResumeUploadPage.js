import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

const ResumeUploadPage = ({ onAnalysisComplete }) => {
  const [mode, setMode] = useState('pdf'); // 'pdf' | 'text'
  const [resumeText, setResumeText] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [jobRoles, setJobRoles] = useState([]);
  const [selectedJobRole, setSelectedJobRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchJobRoles();
  }, []);

  const fetchJobRoles = async () => {
    try {
      const response = await api.get('/api/jobroles');
      setJobRoles(response.data);
      if (response.data.length > 0) {
        setSelectedJobRole(response.data[0].id);
      }
    } catch (err) {
      setError('Failed to fetch job roles. Please ensure the backend is running.');
      console.error('Error fetching job roles:', err);
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported. Please upload a .pdf file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      return;
    }
    setError('');
    setPdfFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedJobRole) { setError('Please select a job role'); return; }

    if (mode === 'pdf') {
      if (!pdfFile) { setError('Please upload a PDF file'); return; }
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('jobRoleId', selectedJobRole);
        const response = await api.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        onAnalysisComplete(response.data);
      } catch (err) {
        const msg = err.response?.data?.error || 'Failed to analyze PDF. Please try again.';
        setError(msg);
        console.error('Error analyzing PDF:', err);
      } finally {
        setLoading(false);
      }
    } else {
      if (!resumeText.trim()) { setError('Please enter your resume text'); return; }
      setLoading(true);
      try {
        const response = await api.post('/api/analyze', { resumeText, jobRoleId: selectedJobRole });
        onAnalysisComplete(response.data);
      } catch (err) {
        setError('Failed to analyze resume. Please try again.');
        console.error('Error analyzing resume:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500" />

      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-xl shadow-violet-900/40 mb-5">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Resume<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">IQ</span>
          </h1>
          <p className="text-gray-400 text-base max-w-md mx-auto">
            Upload your resume and get an instant AI-powered skill gap analysis for your target role
          </p>
          <div className="mt-5 flex justify-center gap-6 text-xs text-gray-500">
            {[
              { label: 'PDF Upload', color: 'text-rose-400' },
              { label: 'ResumeIQ AI Analysis', color: 'text-violet-400' },
              { label: 'Instant Results', color: 'text-blue-400' },
            ].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1.5">
                <svg className={`w-4 h-4 ${color}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-2xl shadow-black/30">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Job Role */}
            <div>
              <label htmlFor="jobRole" className="flex items-center text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                <svg className="w-4 h-4 text-violet-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Target Job Role
              </label>
              <select
                id="jobRole"
                value={selectedJobRole}
                onChange={(e) => setSelectedJobRole(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200 hover:border-white/20 appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '18px' }}
              >
                {jobRoles.map((role) => (
                  <option key={role.id} value={role.id} style={{ background: '#1a1a2e', color: 'white' }}>{role.name}</option>
                ))}
              </select>
            </div>

            {/* Mode Toggle */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Resume Input</span>
                <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => { setMode('pdf'); setError(''); }}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === 'pdf' ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    PDF Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('text'); setError(''); }}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === 'text' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Paste Text
                  </button>
                </div>
              </div>

              {/* PDF Upload Zone */}
              {mode === 'pdf' && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 ${
                    dragOver
                      ? 'border-violet-500 bg-violet-500/10 scale-[1.01]'
                      : pdfFile
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : 'border-white/15 bg-white/[0.02] hover:border-violet-500/40 hover:bg-violet-500/5'
                  }`}
                >
                  <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files[0])} />

                  {pdfFile ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center">
                        <div className="bg-emerald-500/20 rounded-full p-3">
                          <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-base font-semibold text-emerald-400">{pdfFile.name}</p>
                      <p className="text-sm text-emerald-500/70">{(pdfFile.size / 1024).toFixed(1)} KB · PDF</p>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setPdfFile(null); }}
                        className="mt-2 text-sm text-rose-400 hover:text-rose-300 underline">
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <div className={`rounded-full p-4 ${dragOver ? 'bg-violet-500/20' : 'bg-white/5'}`}>
                          <svg className={`w-12 h-12 ${dragOver ? 'text-violet-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-200">
                          {dragOver ? 'Drop your PDF here' : 'Drag & drop your PDF resume'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">or <span className="text-violet-400 font-medium">click to browse</span></p>
                      </div>
                      <p className="text-xs text-gray-600">PDF files only · Max 10MB</p>
                    </div>
                  )}
                </div>
              )}

              {/* Text Paste Mode */}
              {mode === 'text' && (
                <div>
                  <textarea
                    rows="14"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your complete resume text here... Include your experience, skills, education, and achievements."
                    className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none font-mono text-sm"
                  />
                  <p className="mt-2 text-xs text-gray-600">💡 Include all relevant skills, technologies, and experiences for best results</p>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-5 py-4 rounded-xl flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-8 rounded-xl text-white font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-xl shadow-violet-900/30 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {mode === 'pdf' ? 'Extracting & Analyzing...' : 'Analyzing with AI...'}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {mode === 'pdf' ? 'Upload PDF & Analyze' : 'Analyze Resume with AI'}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Cards */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { color: 'rose', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', title: 'PDF Upload', desc: 'Upload your resume as a PDF file' },
            { color: 'violet', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', title: 'AI Insights', desc: 'Professional analysis by ResumeIQ AI' },
            { color: 'blue', icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Instant Results', desc: 'Get skill gap feedback in seconds' },
          ].map(({ color, icon, title, desc }) => (
            <div key={title} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-200">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                color === 'rose' ? 'bg-rose-500/15' : color === 'violet' ? 'bg-violet-500/15' : 'bg-blue-500/15'
              }`}>
                <svg className={`w-5 h-5 ${
                  color === 'rose' ? 'text-rose-400' : color === 'violet' ? 'text-violet-400' : 'text-blue-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
              </div>
              <h3 className="font-bold text-gray-200 text-sm mb-1">{title}</h3>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">Powered by ResumeIQ AI · ResumeIQ</p>
      </div>
    </div>
  );
};

export default ResumeUploadPage;

