import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { scanForMatches } from '../services/aiMatchmaker';
import type { Item } from '../types/database';

interface LogItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'lost' | 'found';
  onSuccess: () => void;
  onMatchFound: (count: number) => void;
}

export function LogItemModal({ isOpen, onClose, type, onSuccess, onMatchFound }: LogItemModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Item['category']>('Electronics');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'compressing' | 'uploading' | 'saving'>('idle');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let finalImageUrl = '';
    
    try {
      let imageUrl = '';

      if (file) {
        setStatus('compressing');
        
        // 1. Compression
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        
        setStatus('uploading');
        
        // 2. Upload to Cloud
        const fileName = `${crypto.randomUUID()}-${compressedFile.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('item-images')
          .upload(fileName, compressedFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from('item-images')
          .getPublicUrl(fileName);
          
        imageUrl = urlData.publicUrl;
        finalImageUrl = imageUrl;
      }

      setStatus('saving');

      // 3. Write record
      const newItem = {
        title,
        description,
        category,
        location,
        type,
        status: 'active',
        image_url: imageUrl,
        date_logged: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .from('items')
        .insert(newItem);

      if (insertError) {
        throw new Error(`Save failed: ${insertError.message}`);
      }

      // Success
      onSuccess();
      onClose();
      
      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setFile(null);
      setCategory('Electronics');
      
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setStatus('idle');
      
      // Wire AI Matchmaker execution cleanly into the finally block
      if (finalImageUrl) {
        // Run autonomously in background
        scanForMatches(finalImageUrl, type).then(matches => {
          if (matches && matches.length > 0) {
            onMatchFound(matches.length);
          }
        });
      }
    }
  };

  const getButtonText = () => {
    switch (status) {
      case 'compressing': return 'Processing Compression...';
      case 'uploading': return 'Uploading to Cloud...';
      case 'saving': return 'Saving Record...';
      default: return 'Submit Item';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">
            Log {type === 'lost' ? 'Lost' : 'Found'} Item
          </h2>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
            disabled={status !== 'idle'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/50 transition-all"
              placeholder="e.g. Sony WH-1000XM4 Headphones"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as Item['category'])}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/50 transition-all appearance-none"
            >
              <option value="Electronics" className="bg-card text-white">Electronics</option>
              <option value="IDs/Wallets" className="bg-card text-white">IDs/Wallets</option>
              <option value="Clothing" className="bg-card text-white">Clothing</option>
              <option value="Keys" className="bg-card text-white">Keys</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Location</label>
            <input 
              type="text" 
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/50 transition-all"
              placeholder="e.g. Science Building - Room 304"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Description</label>
            <textarea 
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/50 transition-all resize-none"
              placeholder="Provide identifiable details..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Image (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-white/70 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all cursor-pointer bg-white/5 border border-white/10 rounded-xl p-1.5"
            />
          </div>

          <div className="pt-4 mt-2 border-t border-white/10">
            <button 
              type="submit" 
              disabled={status !== 'idle'}
              className="w-full bg-claro-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-purple/20 flex items-center justify-center"
            >
              {getButtonText()}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
