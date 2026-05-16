import { supabase } from '../lib/supabase';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateImageTags(base64Image: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.warn('VITE_GEMINI_API_KEY is not set. Skipping AI analysis.');
    return '';
  }

  // Extract base64 data without the data URL prefix if present
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  const payload = {
    contents: [
      {
        parts: [
          { text: "Analyze this image. Output exactly 3 to 5 highly descriptive tags separated by commas focusing on object type, primary color, material, and brand. Do not output conversational text." },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data
            }
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text.trim();
  } catch (error) {
    console.error("AI Matchmaker tag generation failed:", error);
    return '';
  }
}

export async function scanForMatches(imageUrl: string, itemType: 'lost' | 'found') {
  if (!imageUrl) return [];

  try {
    // 1. Fetch image and convert to Base64
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    const base64Image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    // 2. Retrieve tags
    const tagsString = await generateImageTags(base64Image);
    if (!tagsString) return [];

    const tags = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
    if (tags.length === 0) return [];

    console.log(`[AI Matchmaker] Extracted tags: ${tags.join(', ')}`);

    // 3. Query Supabase
    const targetType = itemType === 'lost' ? 'found' : 'lost';
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const orConditions = tags.flatMap(tag => [
      `title.ilike.%${tag}%`,
      `description.ilike.%${tag}%`
    ]).join(',');

    const { data: matches, error } = await supabase
      .from('items')
      .select('*')
      .eq('type', targetType)
      .eq('status', 'active')
      .gte('date_logged', fortyEightHoursAgo)
      .or(orConditions);

    if (error) {
      console.error("Supabase match query failed:", error);
      return [];
    }

    return matches || [];
  } catch (error) {
    console.error("scanForMatches encountered an error:", error);
    return [];
  }
}
