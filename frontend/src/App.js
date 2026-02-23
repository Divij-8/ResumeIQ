import React, { useState } from 'react';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ResumeUploadPage from './components/ResumeUploadPage';
import ResultDashboard from './components/ResultDashboard';

// pages: 'home' | 'login' | 'signup' | 'analyze' | 'result'
function App() {
  const [page, setPage] = useState('home');
  const [analysisResult, setAnalysisResult] = useState(null);

  const navigate = (p) => { setPage(p); window.scrollTo(0, 0); };

  if (page === 'login') {
    return (
      <LoginPage
        onLogin={() => navigate('analyze')}
        onSignUp={() => navigate('signup')}
        onBack={() => navigate('home')}
      />
    );
  }

  if (page === 'signup') {
    return (
      <SignUpPage
        onSignUp={() => navigate('analyze')}
        onLogin={() => navigate('login')}
        onBack={() => navigate('home')}
      />
    );
  }

  if (page === 'analyze') {
    return (
      <ResumeUploadPage
        onAnalysisComplete={(result) => { setAnalysisResult(result); navigate('result'); }}
      />
    );
  }

  if (page === 'result' && analysisResult) {
    return (
      <ResultDashboard
        result={analysisResult}
        onReset={() => { setAnalysisResult(null); navigate('analyze'); }}
      />
    );
  }

  return (
    <HomePage
      onGetStarted={() => navigate('analyze')}
      onLogin={() => navigate('login')}
      onSignUp={() => navigate('signup')}
    />
  );
}

export default App;
