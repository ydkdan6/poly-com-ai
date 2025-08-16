import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Database {
  public: {
    Tables: {
      faqs: {
        Row: {
          id: string;
          category: string;
          question: string;
          answer: string;
          keywords: string[];
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const { message, sessionId } = await req.json();
    console.log('Received message:', message);

    // Initialize Supabase client
    const supabase = createClient<Database>(supabaseUrl!, supabaseServiceKey!);

    // Get FAQ data for context
    const { data: faqs } = await supabase
      .from('faqs')
      .select('*');

    console.log('Retrieved FAQs:', faqs?.length);

    // Create context from FAQs
    const faqContext = faqs?.map(faq => 
      `Q: ${faq.question}\nA: ${faq.answer}\nKeywords: ${faq.keywords.join(', ')}`
    ).join('\n\n') || '';

    const systemPrompt = `You are an AI assistant for the Department of Computer Science at Kaduna Polytechnic. Your role is to help students, prospective students, and visitors with information about the department.

Here is the official FAQ information for the department:

${faqContext}

Guidelines:
1. Always be helpful, professional, and friendly
2. Provide accurate information based on the FAQ data when available
3. If you don't have specific information, acknowledge this and suggest contacting the department directly
4. Focus on Computer Science department-related topics
5. Be encouraging and supportive to students
6. Keep responses concise but informative
7. Use a warm, welcoming tone appropriate for an educational institution

When answering questions, prioritize information from the FAQ database above. If the question isn't covered in the FAQs, provide general helpful guidance while noting that specific details should be confirmed with the department.`;

    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': geminiApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\nUser: ${message}` }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response:', data);

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I encountered an error processing your request. Please try again.';

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: 'I apologize, but I\'m experiencing technical difficulties. Please try again later or contact the department directly.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});