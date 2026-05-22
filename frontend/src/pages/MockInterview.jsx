import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  MessageSquare, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle,
  Timer,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const MockInterview = () => {
  // Phase state: 'setup' | 'active' | 'evaluating' | 'report'
  const [phase, setPhase] = useState('setup');
  const [roundType, setRoundType] = useState('Technical'); // Technical, HR, Aptitude
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  const timerRef = useRef(null);

  // Audio/Voice speech synthesis states
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const recognitionRef = useRef(null);

  // Loader & Report states
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  // Initialize Web Speech API for transcription
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (e) => {
        let transcriptText = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          transcriptText += e.results[i][0].transcript;
        }
        setCurrentAnswer(transcriptText);
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error', e);
        setIsTranscribing(false);
      };

      rec.onend = () => {
        setIsTranscribing(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Timer loop
  useEffect(() => {
    if (phase === 'active') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Auto submit answer and go next on timeout
            handleNextQuestion();
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [phase, currentIdx]);

  // Read question out loud if Voice is enabled
  useEffect(() => {
    if (phase === 'active' && questions.length > 0 && voiceEnabled) {
      speakText(questions[currentIdx]);
    }
  }, [phase, currentIdx, questions, voiceEnabled]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/ai/interview/start', { type: roundType });
      if (data.success) {
        setQuestions(data.questions);
        setAnswers({});
        setCurrentIdx(0);
        setCurrentAnswer('');
        setTimeLeft(120);
        setPhase('active');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (voiceEnabled) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleToggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech-to-Text is not supported by your browser. Please type your answer.');
      return;
    }

    if (isTranscribing) {
      recognitionRef.current.stop();
      setIsTranscribing(false);
    } else {
      recognitionRef.current.start();
      setIsTranscribing(true);
    }
  };

  const handleNextQuestion = () => {
    // Save current answer
    setAnswers(prev => ({
      ...prev,
      [currentIdx]: currentAnswer
    }));

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setCurrentAnswer('');
      setTimeLeft(120);
      if (isTranscribing && recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      // Evaluate interview
      handleEvaluateInterview();
    }
  };

  const handleEvaluateInterview = async () => {
    setPhase('evaluating');
    if (isTranscribing && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // Structure transcript: [{ question, answer }]
    const transcript = questions.map((q, idx) => ({
      question: q,
      answer: idx === currentIdx ? currentAnswer : (answers[idx] || 'No response provided.')
    }));

    try {
      const { data } = await axios.post('/api/ai/interview/evaluate', {
        type: roundType,
        duration: questions.length * 120 - timeLeft,
        transcript
      });

      if (data.success) {
        setReport(data.evaluation);
        setPhase('report');
        
        // Push user analytics update in the background
        axios.get('/api/auth/profile');
      }
    } catch (err) {
      console.error(err);
      setPhase('setup');
      alert('Failed to evaluate mock session. Please try again.');
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">AI Mock Interview Simulator</h1>
        <p className="text-xs text-slate-400 mt-1">Hone your speaking pacing and tech accuracy under stress-test timers.</p>
      </div>

      {/* PHASE 1: SETUP */}
      {phase === 'setup' && (
        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-4xl animate-bounce inline-block">🎙️</span>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Initialize Mock Evaluation</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Select your target assessment block. Questions will adjust dynamically.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Technical', 'HR', 'Aptitude'].map((type) => (
              <button
                key={type}
                onClick={() => setRoundType(type)}
                className={`p-5 rounded-2xl border text-center transition-all ${
                  roundType === type
                    ? 'border-primary-600 bg-primary-600/5 text-primary-650 dark:text-primary-400 font-bold'
                    : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-600 dark:text-slate-400 font-medium'
                }`}
              >
                <h4 className="text-sm">{type} Round</h4>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {type === 'Technical' && 'Core CS, Coding, & Sys Design'}
                  {type === 'HR' && 'Behavioral & Leadership'}
                  {type === 'Aptitude' && 'Logical reasoning & math'}
                </span>
              </button>
            ))}
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
              <AlertCircle size={14} className="text-primary-500" /> Chamber Instructions:
            </h4>
            <ul className="list-disc pl-4 text-[11px] text-slate-500 space-y-1">
              <li>You have <strong>2:00 minutes</strong> to complete each question response.</li>
              <li>Toggle Speech Synthesis on to listen to voice questions.</li>
              <li>Make sure your microphone is enabled for live speech transcribing.</li>
            </ul>
          </div>

          <button
            onClick={handleStartInterview}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-primary-600 to-indigo-650 text-white font-bold rounded-2xl shadow-lg transition-all hover:scale-[0.99] disabled:opacity-50 text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Play size={16} fill="currentColor" />
                <span>Begin Assessment</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* PHASE 2: ACTIVE SESSION */}
      {phase === 'active' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Avatar / Controls */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm text-center space-y-4 flex flex-col items-center">
              {/* Animated Avatar circle */}
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white glow-primary">
                <span className="text-4xl animate-pulse">🤖</span>
                {isTranscribing && (
                  <span className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-ping opacity-60"></span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">AI Interviewer</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-bold tracking-widest">
                  {isTranscribing ? 'Listening...' : 'Waiting for answer'}
                </p>
              </div>

              {/* Status Indicators */}
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleToggleVoice}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    voiceEnabled 
                      ? 'border-primary-600 bg-primary-600/5 text-primary-650 dark:text-primary-400' 
                      : 'border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  <span>{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
                </button>
                <div className="flex items-center gap-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 text-xs font-bold">
                  <Timer size={14} className="text-red-500" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Question / Input Workspace */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex flex-col justify-between min-h-[340px]">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-primary-500 tracking-wider">
                  <span>ROUND: {roundType.toUpperCase()}</span>
                  <span>QUESTION {currentIdx + 1} OF {questions.length}</span>
                </div>

                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                  {questions[currentIdx]}
                </h2>

                <div className="relative mt-4">
                  <textarea
                    placeholder="Formulate your response... Speak via Mic button or type text directly."
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-primary-550 focus:outline-none text-slate-700 dark:text-slate-200 text-sm resize-none"
                  />
                  
                  {/* Floating Micro buttons */}
                  <button
                    onClick={handleToggleRecording}
                    className={`absolute bottom-3 right-3 p-3 rounded-full border shadow-md transition-all active:scale-95 ${
                      isTranscribing
                        ? 'bg-red-500 border-red-500 text-white glow-red animate-pulse'
                        : 'bg-primary-600 border-primary-650 text-white hover:bg-primary-750'
                    }`}
                    title={isTranscribing ? 'Stop voice transcription' : 'Start speaking'}
                  >
                    {isTranscribing ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-slate-850 hover:bg-slate-900 dark:bg-slate-750 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                >
                  <span>{currentIdx < questions.length - 1 ? 'Save & Next Question' : 'Complete & Evaluate'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 3: EVALUATING SCREEN */}
      {phase === 'evaluating' && (
        <div className="max-w-md mx-auto p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Grading Assessment Transcript</h3>
          <p className="text-xs text-slate-400">Evaluating spelling accuracy, language transitions, tech depth, and structured answers...</p>
        </div>
      )}

      {/* PHASE 4: GRADE REPORT */}
      {phase === 'report' && report && (
        <div className="space-y-6">
          {/* Main Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Ring */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex flex-col items-center justify-center text-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Overall Score</h3>
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-950 border-8 border-primary-600/10">
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{report.score}%</span>
                {/* Visual circle SVG overlay */}
                <svg className="absolute top-0 left-0 w-32 h-32 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    className="stroke-primary-600 fill-none"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - report.score / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="mt-4 text-[10px] font-extrabold bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full uppercase tracking-wider">
                Recruiter Verdict
              </span>
            </div>

            {/* Metrics Breakdown */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm md:col-span-2 space-y-4 justify-center flex flex-col">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Metrics Breakdown</h3>
              
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Confidence Index</span>
                  <span className="text-primary-600 dark:text-primary-400">{report.feedback.confidenceScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full glow-primary" style={{ width: `${report.feedback.confidenceScore}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Communication Clarity</span>
                  <span className="text-primary-600 dark:text-primary-400">{report.feedback.communicationScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full glow-primary" style={{ width: `${report.feedback.communicationScore}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Technical Accuracy</span>
                  <span className="text-primary-600 dark:text-primary-400">{report.feedback.technicalAccuracy}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full glow-primary" style={{ width: `${report.feedback.technicalAccuracy}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-3">
              <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest">Strengths identified</h4>
              <ul className="space-y-2">
                {report.feedback.strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✔</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-3">
              <h4 className="text-xs font-black text-primary-500 uppercase tracking-widest">Areas to Optimize</h4>
              <ul className="space-y-2">
                {report.feedback.improvements.map((imp, idx) => (
                  <li key={idx} className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed flex items-start gap-2">
                    <span className="text-primary-500 mt-0.5">➔</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Question Transcript */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base border-b border-slate-100 dark:border-slate-800 pb-3">Q&A Audit Transcript</h3>
            <div className="space-y-4">
              {report.transcript.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">QUESTION {idx + 1}</span>
                    <span className="text-primary-500">Score: {item.score}/100</span>
                  </div>
                  <p className="text-xs font-bold text-slate-750 dark:text-slate-200">{item.question}</p>
                  <div className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900 whitespace-pre-wrap">
                    <span className="font-bold text-slate-400 block text-[9px] uppercase tracking-wider mb-1">Your Response:</span>
                    {item.answer}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pl-2 border-l-2 border-primary-500/40 italic">
                    {item.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setPhase('setup')}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-750 dark:hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <RotateCcw size={14} />
              <span>Retry Assessment</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;
