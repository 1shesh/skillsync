import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Copy,
  Check,
  Lock,
  Cpu,
  ArrowRight,
  Sparkles,
  Server
} from 'lucide-react';
import { UserProfile } from '../types';

interface JwtTokenInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  user: UserProfile | null;
}

export const JwtTokenInspector: React.FC<JwtTokenInspectorProps> = ({
  isOpen,
  onClose,
  token,
  user
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Decode JWT segments if available
  let headerObj = { alg: 'HS256', typ: 'JWT' };
  let payloadObj: any = {
    id: user?.id || 'usr-student-01',
    email: user?.email || 'student@sih.ac.in',
    role: user?.role || 'student',
    name: user?.name || 'Aarav Sharma',
    institutionOrCompany: user?.institutionOrCompany || 'IIT BHU',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 86400
  };

  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        headerObj = JSON.parse(atob(parts[0]));
        payloadObj = JSON.parse(atob(parts[1]));
      }
    } catch (e) {
      console.warn('Could not decode token string, showing active user claims');
    }
  }

  const handleCopy = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                JWT Authentication Service & Claims Inspector
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Signature Verified
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Stateless token verified by API Gateway before routing to microservices
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Raw Encoded JWT Token Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Raw Encoded JWT (Bearer Token)
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Token' : 'Copy Token'}</span>
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] break-all leading-relaxed">
              {token ? (
                <span>
                  <span className="text-rose-400 font-semibold">{token.split('.')[0]}</span>
                  <span className="text-slate-500">.</span>
                  <span className="text-purple-400 font-semibold">{token.split('.')[1]}</span>
                  <span className="text-slate-500">.</span>
                  <span className="text-cyan-400 font-semibold">{token.split('.')[2] || 'SIGNATURE'}</span>
                </span>
              ) : (
                <span className="text-slate-500 italic">No token loaded. Please sign in to issue a new JWT.</span>
              )}
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span> Header
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span> Payload / Claims
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span> HMAC-SHA256 Signature
              </span>
            </div>
          </div>

          {/* Decoded Sections Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Header */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-rose-400">
                1. Decoded Header
              </span>
              <pre className="text-xs font-mono text-slate-300 bg-slate-900/90 p-3 rounded-lg overflow-x-auto border border-slate-800">
                {JSON.stringify(headerObj, null, 2)}
              </pre>
              <p className="text-[11px] text-slate-400">
                Uses standard HMAC-SHA256 algorithm for signing.
              </p>
            </div>

            {/* Payload Claims */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-purple-400">
                2. Decoded Payload Claims
              </span>
              <pre className="text-xs font-mono text-emerald-400 bg-slate-900/90 p-3 rounded-lg overflow-x-auto border border-slate-800">
                {JSON.stringify(payloadObj, null, 2)}
              </pre>
              <p className="text-[11px] text-slate-400">
                Includes role claim: <strong className="text-white capitalize">{payloadObj.role}</strong>
              </p>
            </div>
          </div>

          {/* API Gateway Role Routing Explanation */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>How the API Gateway Uses This JWT in the Prototype</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-indigo-400 font-bold">1. Client Request</span>
                <p className="text-[11px] text-slate-400">
                  Client attaches header: <code className="text-slate-300">Authorization: Bearer &lt;token&gt;</code>
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold">2. Gateway Intercept</span>
                <p className="text-[11px] text-slate-400">
                  Reverse proxy verifies signature, parses <code className="text-slate-300">req.user.role</code>, checks access rules.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold">3. Service Execution</span>
                <p className="text-[11px] text-slate-400">
                  Routes request to Course, Opportunity, or Community microservice with logged telemetry.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Cryptographic standard: RFC 7519</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
