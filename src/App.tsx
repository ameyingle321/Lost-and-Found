import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { ItemCard } from './components/ItemCard';
import { LogItemModal } from './components/LogItemModal';
import { SecureClaimModal } from './components/SecureClaimModal';
import { ClaimsReviewPanel } from './components/ClaimsReviewPanel';
import { dummyItems } from './data/dummyItems';
import type { Item } from './types/database';

function App() {
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [claimItemId, setClaimItemId] = useState<string | null>(null);
  const [aiAlert, setAiAlert] = useState<string | null>(null);



  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('type', activeTab)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Use dummy data as fallback for prototype
      if (error) console.error('Error fetching items:', error);
      const filtered = dummyItems.filter(i => i.type === activeTab);
      setItems(filtered);
    } else {
      setItems(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);



  const claimItem = items.find(i => i.id === claimItemId) || null;

  return (
    <>
      <div className="ambient-glow"></div>
      
      <div className="min-h-screen flex flex-col items-center pb-20 relative">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenModal={() => setIsUploadOpen(true)}
        />
        
        <main className="w-full max-w-6xl px-4 mt-12">
          {/* Dashboard Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">
              {activeTab === 'lost' ? 'Lost Items Feed' : 'Found Items Feed'}
            </h1>
            <p className="text-white/60">
              {activeTab === 'lost' 
                ? 'Browse items reported lost across the campus.' 
                : 'Browse items recovered by fellow students and staff.'}
            </p>
          </div>

          <div className="-mx-4 mb-4">
            <ClaimsReviewPanel session={null} />
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-white/10 aspect-[3/4] animate-pulse"></div>
              ))
            ) : items.length > 0 ? (
              items.map(item => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  onClaim={(i) => setClaimItemId(i.id)} 
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-white/50 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                No items currently logged in this feed.
              </div>
            )}
          </div>
        </main>
      </div>

      <LogItemModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        type={activeTab}
        onSuccess={() => {
          setIsUploadOpen(false);
          fetchItems();
        }}
        onMatchFound={(count) => {
          setAiAlert(`We found ${count} items logged recently matching those exact visual markers.`);
        }}
      />

      <SecureClaimModal 
        item={claimItem}
        onClose={() => setClaimItemId(null)}
      />

      {/* Actionable Browser Toast Notification */}
      {aiAlert && (
        <div className="fixed bottom-6 right-6 z-[200] bg-purple-900/90 backdrop-blur-xl border border-purple-500/50 p-4 rounded-2xl shadow-[0_0_40px_rgba(157,89,255,0.4)] flex items-start space-x-3 max-w-sm transition-all">
          <div className="bg-purple-500/20 p-2 rounded-full flex-shrink-0">
            <Bell className="w-5 h-5 text-purple-200" />
          </div>
          <div className="flex-1 pr-2">
            <h4 className="text-purple-100 font-bold mb-1">Intelligence Alert</h4>
            <p className="text-purple-200/80 text-sm leading-tight">{aiAlert}</p>
          </div>
          <button 
            onClick={() => setAiAlert(null)} 
            className="text-purple-300 hover:text-white transition-colors text-xl font-bold leading-none"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}

export default App;
