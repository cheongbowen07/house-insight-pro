const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValyuResult {
  title: string;
  url: string;
  content: string;
}

interface ValyuResponse {
  results: ValyuResult[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address } = await req.json();
    
    if (!address) {
      throw new Error('Address is required');
    }

    console.log(`Analyzing property: ${address}`);

    // Step 1: Fetch data from Valyu API
    const valyuApiKey = Deno.env.get('VALYU_API_KEY');
    if (!valyuApiKey) {
      throw new Error('VALYU_API_KEY not configured');
    }

    const queries = [
      `real estate history, last sale price, property value for ${address}`,
      `building permits, permit history, inspection records for ${address}`,
      `neighborhood trends, recent renovations, common improvements near ${address}`
    ];

    console.log('Fetching data from Valyu API...');
    
    // Fetch all queries in parallel
    const searchPromises = queries.map(async (query) => {
      const response = await fetch('https://api.valyu.ai/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${valyuApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          max_num_results: 3,
          search_type: 'standard'
        }),
      });

      if (!response.ok) {
        console.error(`Valyu API error: ${response.status}`);
        return { results: [] };
      }

      return await response.json() as ValyuResponse;
    });

    const searchResults = await Promise.all(searchPromises);

    // Combine and format all results
    const contextList: string[] = [];
    const sourcesList: { id: number; title: string; url: string }[] = [];
    let sourceId = 1;

    searchResults.forEach((searchResult) => {
      searchResult.results?.forEach((result) => {
        const snippet = `[${sourceId}] Source: ${result.title}\nContent: ${result.content.substring(0, 500)}`;
        contextList.push(snippet);
        sourcesList.push({ id: sourceId, title: result.title, url: result.url });
        sourceId++;
      });
    });

    const rawContext = contextList.join('\n\n---\n\n');

    console.log(`Collected ${sourcesList.length} sources, parsing with AI...`);

    // Step 2: Parse with Lovable AI
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are a construction intelligence parser analyzing property data for contractors.

Your task: Convert raw search results into a structured JSON dossier.

Rules:
1. Analyze 'Last Sale Price' to determine 'budget_tier' (Economy: <$200k, Standard: $200k-$400k, Premium: $400k-$700k, Luxury: >$700k)
2. Calculate 'risk_score' (0-100) based on: age, permit history, neighborhood issues, structural concerns
3. Extract 3-4 distinct intel points covering:
   - Financial (sale history, property value, owner budget indicators)
   - Technical (building age, known issues, structural concerns)
   - Neighborhood (renovation trends, permit approval times, local regulations)
   - Permits (average permit approval time, common inspection issues)
4. Create a compelling 'talk_track' - a one-sentence opener for the contractor
5. Return ONLY valid JSON matching this exact schema:

{
  "address": "string",
  "summary": {
    "headline": "string (short, impactful title)",
    "risk_score": number (0-100),
    "budget_tier": "Economy" | "Standard" | "Premium" | "Luxury",
    "reasoning": "string (why this risk score)"
  },
  "intel": [
    {
      "category": "Financial" | "Technical" | "Neighborhood" | "Permits",
      "icon": "DollarSign" | "AlertTriangle" | "MapPin" | "FileCheck" | "Clock",
      "fact": "string (actual data point)",
      "strategy": "string (tactical advice for contractor)",
      "source_url": "string (optional)"
    }
  ],
  "talk_track": "string (compelling opening line)",
  "raw_sources": []
}

Focus on actionable intelligence that helps contractors:
- Price their quote accurately
- Anticipate potential problems
- Build rapport with homeowner
- Navigate local regulations`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Analyze this property: ${address}\n\nSearch Data:\n${rawContext}\n\nReturn ONLY the JSON dossier.` 
          }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    const dossierJson = JSON.parse(aiResult.choices[0].message.content);

    // Attach sources
    dossierJson.raw_sources = sourcesList.slice(0, 5);

    console.log('Successfully generated dossier');

    return new Response(JSON.stringify(dossierJson), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-property function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
