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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-4 shadow-xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            AI Resume Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your PDF resume and get instant AI-powered skill gap analysis
          </p>
          <div className="mt-4 flex justify-center gap-4 text-sm text-gray-500">
            {['PDF Upload', 'AI Analysis', 'Instant Results'].map((item, i) => (
              <span key={i} className="flex items-center">
                <svg className={`w-5 h-5 mr-1 ${i === 0 ? 'text-red-500' : i === 1 ? 'text-purple-500' : 'text-blue-500'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Job Role */}
            <div>
              <label htmlFor="jobRole" className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Select Target Job Role
              </label>
              <select id="jobRole" value={selectedJobRole} onChange={(e) => setSelectedJobRole(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500 focus:ring-opacity-30 focus:border-purple-500 transition-all duration-200 text-gray-700 font-medium bg-gray-50 hover:bg-white">
                {jobRoles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>

            {/* Mode Toggle */}
            <div>
              <div className="flex items-center mb-4">
                <span className="text-lg font-semibold text-gray-800 mr-4">Resume Input</span>
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button type="button" onClick={() => { setMode('pdf'); setError(''); }}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === 'pdf' ? 'bg-white text-purple-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    PDF Upload
                  </button>
                  <button type="button" onClick={() => { setMode('text'); setError(''); }}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === 'text' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>
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
                      ? 'border-purple-500 bg-purple-50 scale-[1.01]'
                      : pdfFile
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50'
                  }`}
                >
                  <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files[0])} />

                  {pdfFile ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center">
                        <div className="bg-green-100 rounded-full p-3">
                          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-green-700">{pdfFile.name}</p>
                      <p className="text-sm text-green-600">{(pdfFile.size / 1024).toFixed(1)} KB · PDF</p>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setPdfFile(null); }}
                        className="mt-2 text-sm text-red-500 hover:text-red-700 underline">
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <div className={`rounded-full p-4 ${dragOver ? 'bg-purple-100' : 'bg-gray-100'}`}>
                          <svg className={`w-12 h-12 ${dragOver ? 'text-purple-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-700">
                          {dragOver ? 'Drop your PDF here' : 'Drag & drop your PDF resume'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">or <span className="text-purple-600 font-medium">click to browse</span></p>
                      </div>
                      <p className="text-xs text-gray-400">PDF files only · Max 10MB</p>
                    </div>
                  )}
                </div>
              )}

              {/* Text Paste Mode */}
              {mode === 'text' && (
                <div>
                  <textarea rows="14" value={resumeText} onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your complete resume text here... Include your experience, skills, education, and achievements."
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:ring-opacity-30 focus:border-blue-500 transition-all duration-200 resize-none text-gray-700 bg-gray-50 hover:bg-white" />
                  <p className="mt-2 text-sm text-gray-500">💡 Include all relevant skills, technologies, and experiences for best results</p>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-lg flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              className={`w-full py-4 px-8 rounded-xl text-white font-bold text-lg shadow-xl transform transition-all duration-200 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-[1.02] active:scale-95 hover:shadow-2xl'
              }`}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {mode === 'pdf' ? 'Extracting PDF & Analyzing...' : 'Analyzing with AI...'}
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {mode === 'pdf' ? 'Upload PDF & Analyze' : 'Analyze Resume with AI'}
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            { color: 'red', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', title: 'PDF Upload', desc: 'Upload your resume as a PDF file' },
            { color: 'purple', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', title: 'AI Insights', desc: 'Professional analysis by Gemini AI' },
            { color: 'blue', icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Instant Results', desc: 'Get skill gap feedback in seconds' },
          ].map(({ color, icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className={`bg-${color}-100 rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                <svg className={`w-6 h-6 text-${color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">Powered by Google Gemini AI · ResumeIQ</p>
      </div>
    </div>
  );
};

export default ResumeUploadPage;

