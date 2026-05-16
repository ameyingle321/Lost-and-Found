import { useState } from 'react';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Item } from '../types/database';

interface SecureClaimModalProps {
  item: Item | null;
  onClose: () => void;
}

export function SecureClaimModal({ item, onClose }: SecureClaimModalProps) {
  const [proofDescription, setProofDescription] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofDescription.trim()) return;

    setError(null);
    setStatus('submitting');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('You must be logged in to claim an item.');

      const { error: insertError } = await supabase
        .from('claims')
        .insert({
          item_id: item.id,
          claimant_id: session.user.id,
          proof_description: proofDescription,
          status: 'pending'
        });

      if (insertError) {
        throw new Error(`Submission failed: ${insertError.message}`);
      }

      setStatus('success');
      
      // Auto close after showing success message briefly
      setTimeout(() => {
        onClose();
        // Reset state for next open
        setTimeout(() => {
          setStatus('idle');
          setProofDescription('');
        }, 300);
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col relative transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-purple" />
            <h2 className="text-xl font-bold text-white">
              Secure Claim Verification
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
            disabled={status !== 'idle'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {status === 'success' ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-purple/20 rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(157,89,255,0.4)]">
              <CheckCircle2 className="w-8 h-8 text-purple-300" />
            </div>
            <h3 className="text-xl font-bold text-white">Verification Sent</h3>
            <p className="text-white/70">
              Verification proof securely transmitted. The finder will review your response.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            
            <div className="bg-purple/10 border border-purple/20 rounded-xl p-4 text-sm text-purple-100/80 leading-relaxed">
              <strong className="text-purple-300 block mb-1">Zero-Knowledge Protocol active.</strong>
              To protect student property, the finder's details are hidden. Describe distinct proof (e.g. lock screen wallpaper, unique scratches, hidden case contents) to initiate a secure exchange.
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Proof of Ownership <span className="text-red-400">*</span>
              </label>
              <textarea 
                required
                value={proofDescription}
                onChange={(e) => setProofDescription(e.target.value)}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/50 transition-all resize-none"
                placeholder="Be as specific as possible to verify ownership..."
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={status === 'submitting' || !proofDescription.trim()}
                className="w-full bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center"
              >
                {status === 'submitting' ? 'Encrypting & Transmitting...' : 'Submit Proof'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
