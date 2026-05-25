'use client';

import { Bot, Sparkles, Send } from 'lucide-react';
import { useState } from 'react';

const suggestedPrompts = [
  'Show me all deals closing this month',
  'Which contacts have a lead score above 80?',
  'What deals are at risk of stalling?',
  'Give me a pipeline summary for this quarter',
  'Who are my top performing reps?',
];

export default function CopilotPage() {
  const [input, setInput] = useState('');

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-3">
          <Sparkles size={24} className="text-brand-400" />
          AI Copilot
        </h1>
        <p className="text-sm text-surface-500 mt-1">Ask questions about your CRM data. Powered by Claude.</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card p-6 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center mb-6 shadow-glow-lg animate-pulse_glow">
            <Bot size={36} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-surface-800 mb-2">How can I help you today?</h2>
          <p className="text-sm text-surface-500 max-w-md mb-8">
            I can analyze your pipeline, surface insights about contacts and deals, 
            and help you make data-driven decisions.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-lg w-full">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="text-left px-4 py-3 rounded-xl border border-surface-300 text-xs text-surface-600 hover:bg-surface-200 hover:border-brand-500/30 hover:text-surface-800 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="relative mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your CRM data..."
            className="input-field pr-12 py-3"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-brand-600 hover:bg-brand-500 flex items-center justify-center transition-colors">
            <Send size={14} className="text-white" />
          </button>
        </div>
        <p className="text-[10px] text-surface-500 mt-2 text-center">
          AI Copilot uses Claude claude-sonnet-4-20250514 · Read-only access to your workspace data
        </p>
      </div>
    </div>
  );
}
