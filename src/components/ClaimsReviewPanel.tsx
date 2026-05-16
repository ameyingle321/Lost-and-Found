import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Claim } from '../types/database';

type JoinedClaim = Claim & {
  items: {
    title: string;
    location: string;
    image_url: string;
    posted_by?: string;
  };
};

export function ClaimsReviewPanel({ session }: { session: any }) {
  const [claims, setClaims] = useState<JoinedClaim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    
    const fetchClaims = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('claims')
        .select('*, items!inner(title, location, image_url, posted_by)')
        .eq('items.posted_by', session.user.id)
        .eq('status', 'pending');

      if (!error && data) {
        setClaims(data as unknown as JoinedClaim[]);
      } else {
        console.error('Error fetching claims:', error);
      }
      setLoading(false);
    };

    fetchClaims();
  }, [session]);

  const handleResolveClaim = async (claimId: string, itemId: string, claimantId: string, approved: boolean) => {
    try {
      if (approved) {
        const { error: claimError } = await supabase
          .from('claims')
          .update({ status: 'approved' })
          .eq('id', claimId);
        
        if (claimError) throw claimError;

        const { error: itemError } = await supabase
          .from('items')
          .update({ status: 'resolved', claimed_by: claimantId })
          .eq('id', itemId);

        if (itemError) throw itemError;

        alert('Claim approved! Safely deposit the item at the admin desk or contact the user via internal masked routing.');
      } else {
        const { error: claimError } = await supabase
          .from('claims')
          .update({ status: 'rejected' })
          .eq('id', claimId);
          
        if (claimError) throw claimError;
        
        alert('Proof rejected. The listing remains active on the public feed.');
      }

      setClaims(prev => prev.filter(c => c.id !== claimId));

    } catch (err: any) {
      alert(`Error resolving claim: ${err.message}`);
    }
  };

  if (loading) return null;

  return (
    <div className="mb-8 w-full max-w-6xl px-4">
      <h3 className="text-xl font-bold text-white mb-4">Pending Verification Requests</h3>
      
      {claims.length === 0 ? (
        <div className="text-white/40 bg-card/30 border border-white/5 rounded-2xl p-6 text-center text-sm">
          No verification requests pending at this time.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {claims.map(claim => (
            <div key={claim.id} className="bg-card border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4">
              
              <div className="flex items-start space-x-4 md:w-1/3 shrink-0">
                {claim.items.image_url ? (
                  <img src={claim.items.image_url} alt="Item" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <span className="text-xs text-white/30">No Img</span>
                  </div>
                )}
                <div>
                  <h4 className="text-white font-bold text-sm line-clamp-2">{claim.items.title}</h4>
                  <p className="text-white/50 text-xs mt-1">{claim.items.location}</p>
                </div>
              </div>

              <div className="flex-1 bg-white/5 border border-purple/30 rounded-lg p-3 text-sm text-white font-mono overflow-auto">
                <span className="text-purple-300 text-xs block mb-1 font-sans">SUBMITTED PROOF:</span>
                {claim.proof_description}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 shrink-0 justify-center">
                <button 
                  onClick={() => handleResolveClaim(claim.id, claim.item_id, claim.claimant_id, false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Reject Proof
                </button>
                <button 
                  onClick={() => handleResolveClaim(claim.id, claim.item_id, claim.claimant_id, true)}
                  className="px-4 py-2 rounded-lg bg-claro-gradient text-white font-semibold shadow-sm shadow-purple/20 hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
                >
                  Approve & Reveal
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
