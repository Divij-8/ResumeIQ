import React, { useState } from 'react';
import ResumeUploadPage from './components/ResumeUploadPage';
import ResultDashboard from './components/ResultDashboard';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="App">
      {analysisResult ? (
        <ResultDashboard result={analysisResult} onReset={handleReset} />
      ) : (
        <ResumeUploadPage onAnalysisComplete={handleAnalysisComplete} />
      )}
    </div>
  );
}

export default App;
