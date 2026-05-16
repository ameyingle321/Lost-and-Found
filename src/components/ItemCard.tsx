import { MapPin, Calendar, ShieldCheck } from 'lucide-react';
import type { Item } from '../types/database';

interface ItemCardProps {
  item: Item;
  onClaim?: (item: Item) => void;
}

export function ItemCard({ item, onClaim }: ItemCardProps) {
  // Format the date assuming it's a valid ISO string
  const formattedDate = new Date(item.date_logged).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="group flex flex-col bg-card rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-purple/5">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/50">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 font-medium">
            No Image
          </div>
        )}
        
        {/* Category Chip floating on image */}
        <div className="absolute top-3 left-3 bg-purple/20 border border-purple/40 text-purple-200 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold shadow-[0_0_15px_rgba(157,89,255,0.4)]">
          {item.category}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-grow p-5">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
          {item.title}
        </h3>
        
        <p className="text-sm text-white/70 mb-4 line-clamp-2 flex-grow">
          {item.description}
        </p>

        {/* Metadata */}
        <div className="flex flex-col space-y-2 mb-6">
          <div className="flex items-center text-white/50 text-xs font-medium">
            <MapPin className="w-4 h-4 mr-2 text-white/40" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center text-white/50 text-xs font-medium">
            <Calendar className="w-4 h-4 mr-2 text-white/40" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Footer Action */}
        {item.type === 'found' && onClaim && (
          <button 
            onClick={() => onClaim(item)}
            className="mt-auto w-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-colors py-2.5 rounded-xl text-white text-sm font-medium"
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            Secure Claim
          </button>
        )}
      </div>
    </div>
  );
}
