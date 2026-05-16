export interface Item {
  id: string;
  created_at: string;
  title: string;
  description: string;
  category: 'Electronics' | 'IDs/Wallets' | 'Clothing' | 'Keys';
  type: 'lost' | 'found';
  status: 'active' | 'pending_verification' | 'resolved';
  location: string;
  date_logged: string;
  image_url: string;
  posted_by?: string;
  claimed_by?: string;
}

export interface Claim {
  id: string;
  item_id: string;
  claimant_id: string;
  proof_description: string;
  status: 'pending' | 'approved' | 'rejected';
}
