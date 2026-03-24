
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { GeminiInsight, SynergyInsight, ActionPlan, DefusionResult, MindfulnessSession, Language, StudyQuestion, StudyFeedback, DeepDefusionResponse, RecoveryInsight, AlcoholToolkit, IkeaManual, TwisterMove, RPGProfile, DinnerScenario, PopUpAd } from "../types";
import { GEMINI_MODEL, GEMINI_TTS_MODEL } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = GEMINI_MODEL;
const ttsModel = GEMINI_TTS_MODEL;

const getLanguageInstruction = (lang: Language) => {
    return lang === 'sv' ? "Respond in Swedish. Be warm, professional, and therapeutic." : "Respond in English. Be warm, professional, and therapeutic.";
};

// --- Fallback Data Generators ---

const getFallbackInsight = (lang: Language): GeminiInsight => ({
    metaphor: lang === 'sv' 
        ? "Föreställ dig ditt sinne som en himmel och tankarna som moln. Himlen förblir opåverkad oavsett väder."
        : "Imagine your mind is like a sky, and thoughts are just clouds passing by. The sky remains unchanged regardless of the weather.",
    exercise: lang === 'sv'
        ? "Ta tre djupa andetag. Notera 5 saker du ser, 4 saker du känner, 3 saker du hör. Låt detta grunda dig i nuet."
        : "Take three deep breaths. Notice 5 things you see, 4 things you feel, and 3 things you hear. Let this ground you in the now.",
    quote: lang === 'sv'
        ? "Du är himlen. Allt annat är bara väder. - Pema Chödrön"
        : "You are the sky. Everything else – it's just the weather. - Pema Chödrön"
});

const getFallbackSynergy = (lang: Language): SynergyInsight => ({
    relationshipName: lang === 'sv' ? "Dynamisk Balans" : "Dynamic Balance",
    explanation: lang === 'sv'
        ? "Dessa processer arbetar tillsammans som två ben som går. Den ena ger stabilitet medan den andra rör dig framåt."
        : "These processes work together like two legs walking. One provides stability while the other moves you forward.",
    practicalTip: lang === 'sv'
        ? "Försök att märka när du använder den ena processen och fråga dig själv hur den andra kan stödja den."
        : "Try to notice when you are using one process and ask yourself how the other might support it."
});

const getFallbackDefusion = (lang: Language): DeepDefusionResponse => ({
    analysis: lang === 'sv' 
        ? "Det låter som att ditt sinne försöker skydda dig, men gör det på ett sätt som skapar stress."
        : "It sounds like your mind is trying to protect you, but doing so in a way that creates stress.",
    reframe: lang === 'sv' 
        ? "Jag noterar att jag har tanken att..."
        : "I am noticing I'm having the thought that...",
    techniques: [
        {
            title: lang === 'sv' ? "Moln på himlen" : "Clouds in the Sky",
            description: lang === 'sv' ? "Föreställ dig tanken skriven på ett moln som sakta driver förbi." : "Imagine the thought written on a cloud drifting by.",
            category: 'visual'
        },
        {
            title: lang === 'sv' ? "Kalle Anka-röst" : "Silly Voice",
            description: lang === 'sv' ? "Säg tanken högt med en fånig röst för att ta udden av den." : "Say the thought out loud in a silly cartoon voice.",
            category: 'auditory'
        },
        {
            title: lang === 'sv' ? "Hjälper detta?" : "Is it helpful?",
            description: lang === 'sv' ? "Om du köper denna tanke, hjälper det dig att leva det liv du vill leva?" : "If you buy into this thought, does it help you live the life you want?",
            category: 'pragmatic'
        }
    ]
});

const getFallbackActionPlan = (lang: Language): ActionPlan => ({
    steps: lang === 'sv'
        ? [
            "Ta en paus på 10 sekunder innan du reagerar.",
            "Identifiera en sak som är viktig för dig idag.",
            "Gör en liten vänlig handling mot dig själv."
          ]
        : [
            "Pause for 10 seconds before reacting.",
            "Identify one thing that matters to you today.",
            "Do one small act of kindness for yourself."
          ]
});

const getFallbackMindfulness = (lang: Language): MindfulnessSession => ({
    title: lang === 'sv' ? "Grundning i Nuet" : "Grounding in the Now",
    technique: "Box Breathing",
    educationalContext: lang === 'sv' 
        ? "Denna teknik hjälper till att reglera nervsystemet genom att balansera syre och koldioxid, vilket signalerar trygghet till kroppen." 
        : "This technique helps regulate the autonomic nervous system by balancing oxygen and carbon dioxide, signaling safety to the body.",
    steps: [
        { 
            instruction: lang === 'sv' ? "Andas in långsamt genom näsan, räkna till 4." : "Inhale slowly through your nose for a count of 4.",
            duration: 5,
            pacing: 'breathing'
        },
        {
            instruction: lang === 'sv' ? "Håll andan, räkna till 4." : "Hold your breath for a count of 4.",
            duration: 5,
            pacing: 'steady'
        },
        {
            instruction: lang === 'sv' ? "Andas ut genom munnen, räkna till 4." : "Exhale through your mouth for a count of 4.",
            duration: 5,
            pacing: 'breathing'
        },
        {
            instruction: lang === 'sv' ? "Håll andan igen, räkna till 4." : "Hold empty for a count of 4.",
            duration: 5,
            pacing: 'steady'
        },
         {
            instruction: lang === 'sv' ? "Upprepa och känn lugnet sprida sig." : "Repeat, letting calmness spread.",
            duration: 8,
            pacing: 'breathing'
        }
    ],
    insight: lang === 'sv' 
        ? "Att kontrollera andningen är det snabbaste sättet att tala om för hjärnan att faran är över." 
        : "Controlling your breath is the fastest way to tell your brain that you are safe."
});

const getFallbackStudyQuestion = (lang: Language): StudyQuestion => ({
    id: "q-fallback",
    category: lang === 'sv' ? "Värderingar" : "Values",
    question: lang === 'sv' 
        ? "Tänk på en svår situation du nyligen stått inför. Hur skulle du kunna ha agerat annorlunda om du hade haft dina värderingar i åtanke?"
        : "Think of a difficult situation you faced recently. How might you have acted differently if you had your values clearly in mind?",
    hint: lang === 'sv' ? "Fokusera på 'varför' bakom dina handlingar." : "Focus on the 'why' behind your actions."
});

const getFallbackStudyFeedback = (lang: Language): StudyFeedback => ({
    isCorrect: true,
    feedback: lang === 'sv' ? "Det är en bra reflektion." : "That is a great reflection.",
    encouragement: lang === 'sv' ? "Fortsätt öva!" : "Keep practicing!"
});

const getFallbackRecovery = (lang: Language): RecoveryInsight => ({
    blockedNode: lang === 'sv' ? "Acceptans" : "Acceptance",
    analysis: lang === 'sv' 
        ? "Det verkar som att du använder detta beteende för att undvika en svår känsla (upplevelsemässigt undvikande)." 
        : "It seems you are using this behavior to avoid a difficult feeling (experiential avoidance).",
    pivotTitle: lang === 'sv' ? "Surfa på impulsen" : "Urge Surfing",
    pivotDescription: lang === 'sv' 
        ? "Istället för att kämpa emot impulsen, föreställ dig den som en våg. Du behöver inte drunkna i den, du kan rida på den tills den ebbar ut."
        : "Instead of fighting the urge, imagine it as a wave. You don't have to drown in it; you can ride it until it subsides.",
    pivotAction: lang === 'sv' ? "Stanna upp i 3 minuter och observera vågen." : "Pause for 3 minutes and observe the wave."
});


// --- API Functions ---

// 1. Standard Insights
export const fetchActInsights = async (
  processTitle: string,
  processDescription: string,
  lang: Language
): Promise<GeminiInsight> => {
  try {
    const prompt = `
      ${getLanguageInstruction(lang)}
      You are an expert ACT therapist. Provide a creative insight for the ACT process: "${processTitle}".
      Context: ${processDescription}.
      Return JSON with:
      1. metaphor: A vivid metaphor (1 sentence).
      2. exercise: A 30-second micro-intervention.
      3. quote: A philosophical quote.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metaphor: { type: Type.STRING },
            exercise: { type: Type.STRING },
            quote: { type: Type.STRING },
          },
          required: ["metaphor", "exercise", "quote"],
        },
      },
    });

    if (!response.text) throw new Error("No response text");
    return JSON.parse(response.text) as GeminiInsight;
  } catch (error) {
    console.warn("Gemini API Error (fetchActInsights), using fallback:", error);
    return getFallbackInsight(lang);
  }
};

// 2. Synergy
export const fetchSynergy = async (processA: string, processB: string, lang: Language): Promise<SynergyInsight> => {
  try {
    const prompt = `
      ${getLanguageInstruction(lang)}
      Analyze the dynamic relationship between these two ACT processes: "${processA}" and "${processB}".
      How do they support each other?
      Return JSON:
      1. relationshipName: A creative name for this pair (e.g. "The Grounded Action").
      2. explanation: 2 sentences on how they work together.
      3. practicalTip: One combined tip using both.
    `;
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            relationshipName: { type: Type.STRING },
            explanation: { type: Type.STRING },
            practicalTip: { type: Type.STRING },
          },
          required: ["relationshipName", "explanation", "practicalTip"],
        }
      }
    });
    if (!response.text) throw new Error("No response text");
    return JSON.parse(response.text) as SynergyInsight;
  } catch (error) {
    console.warn("Gemini API Error (fetchSynergy), using fallback:", error);
    return getFallbackSynergy(lang);
  }
};

// 3. Contextualizer
export const fetchContextualizedInfo = async (process: string, userContext: string, lang: Language): Promise<string> => {
  try {
    const prompt = `
      ${getLanguageInstruction(lang)}
      Explain the ACT process "${process}" specifically for someone struggling with: "${userContext}".
      Keep it warm, empathetic, and under 100 words. Speak directly to the user.
    `;
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || (lang === 'sv' ? "Kunde inte generera kontext." : "Could not generate context.");
  } catch (error) {
    console.warn("Gemini API Error (fetchContextualizedInfo), using fallback:", error);
    return lang === 'sv' 
        ? "Genom att tillämpa denna process på din situation kan du hitta nya sätt att förhålla dig till dina upplevelser."
        : "Applying this process to your situation can help you find new ways to relate to your experiences.";
  }
};

// 4. Defusion Lab (UPGRADED)
export const fetchDefusionTactics = async (thought: string, lang: Language): Promise<DeepDefusionResponse> => {
  try {
    const prompt = `
      ${getLanguageInstruction(lang)}
      You are an expert ACT therapist helping a user defuse from a sticky thought.
      User's Thought: "${thought}".
      
      Tasks:
      1. Briefly validate and analyze why this thought might be sticky (e.g. "This sounds like the 'Story of Not Enough'").
      2. Reframe it into the standard ACT format: "I am noticing I am having the thought that..."
      3. Create 3 distinct defusion techniques tailored to this specific thought:
         - One Visual (e.g., imagining it on a leaf).
         - One Auditory/Playful (e.g., saying it in a silly voice).
         - One Pragmatic (e.g., checking workability).

      Return JSON:
      {
        "analysis": string,
        "reframe": string,
        "techniques": [
            { "title": string, "description": string, "category": "visual" },
            { "title": string, "description": string, "category": "auditory" },
            { "title": string, "description": string, "category": "pragmatic" }
        ]
      }
    `;
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
              analysis: { type: Type.STRING },
              reframe: { type: Type.STRING },
              techniques: { 
                  type: Type.ARRAY, 
                  items: { 
                      type: Type.OBJECT,
                      properties: {
                          title: { type: Type.STRING },
                          description: { type: Type.STRING },
                          category: { type: Type.STRING, enum: ['visual', 'auditory', 'pragmatic'] }
                      },
                      required: ["title", "description", "category"]
                  } 
              }
          },
          required: ["analysis", "reframe", "techniques"],
        }
      }
    });
    if (!response.text) throw new Error("No response text");
    return JSON.parse(response.text) as DeepDefusionResponse;
  } catch (error) {
    console.warn("Gemini API Error (fetchDefusionTactics), using fallback:", error);
    return getFallbackDefusion(lang);
  }
};

// 5. Action Architect
export const fetchActionPlan = async (process: string, lang: Language): Promise<ActionPlan> => {
  try {
    const prompt = `
      ${getLanguageInstruction(lang)}
      Create 3 concrete, tiny, immediate behavioral steps (micro-habits) a person can take TODAY to practice "${process}".
      Return JSON with 'steps' (array of strings).
    `;
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
              steps: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["steps"],
        }
      }
    });
    if (!response.text) throw new Error("No response text");
    return JSON.parse(response.text) as ActionPlan;
  } catch (error) {
    console.warn("Gemini API Error (fetchActionPlan), using fallback:", error);
    return getFallbackActionPlan(lang);
  }
};

// 6. Mindfulness Generator (Expanded)
export const fetchMindfulnessSession = async (userFeeling: string, lang: Language): Promise<MindfulnessSession> => {
    try {
        const prompt = `
            ${getLanguageInstruction(lang)}
            You are a mindfulness coach. The user feels: "${userFeeling}".
            Select ONE specific technique that best fits this state (e.g., Box Breathing for stress, Body Scan for exhaustion, Leaves on a Stream for worry, Visualization for low mood).
            
            Generate a JSON object with:
            1. title: Creative title (e.g. "The Calm Anchor").
            2. technique: Name of the technique used.
            3. educationalContext: 1-2 sentences explaining the psychological or physiological 'why' behind this technique.
            4. steps: Array of 5 distinct steps.
               - instruction: Short, spoken guidance (max 15 words).
               - duration: Seconds to display (5-12 seconds).
               - pacing: 'breathing' (expanding/contracting), 'steady' (still), or 'fast' (energetic).
            5. insight: A closing affirmation.
        `;
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        technique: { type: Type.STRING },
                        educationalContext: { type: Type.STRING },
                        steps: { 
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    instruction: { type: Type.STRING },
                                    duration: { type: Type.NUMBER },
                                    pacing: { type: Type.STRING }
                                },
                                required: ["instruction", "duration", "pacing"]
                            }
                        },
                        insight: { type: Type.STRING }
                    },
                    required: ["title", "technique", "educationalContext", "steps", "insight"]
                }
            }
        });
        if (!response.text) throw new Error("No response text");
        return JSON.parse(response.text) as MindfulnessSession;
    } catch (error) {
        console.warn("Gemini API Error (fetchMindfulnessSession), using fallback:", error);
        return getFallbackMindfulness(lang);
    }
};

// Bonus: Socratic Question
export const fetchSocraticQuestion = async (process: string, lang: Language): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `${getLanguageInstruction(lang)} Ask one profound, reflective, open-ended question that helps a user explore "${process}" deeply. Short and punchy.`
        });
        return response.text || (lang === 'sv' ? "Vad betyder detta för dig?" : "What does this mean to you?");
    } catch (error) {
        console.warn("Gemini API Error (fetchSocraticQuestion), using fallback:", error);
        return lang === 'sv' 
            ? "Vad skulle ditt visaste jag säga om detta?" 
            : "What would your wisest self say about this?";
    }
}

// 7. Study Guide Generator
export const fetchStudyQuestion = async (lang: Language): Promise<StudyQuestion> => {
    try {
        const prompt = `
            ${getLanguageInstruction(lang)}
            You are a Socratic tutor for the ACT (Acceptance and Commitment Therapy) Hexaflex model.
            Generate a random, open-ended study question or scenario to test the user's understanding.
            Topics can range from Defusion, Acceptance, Values, etc.
            
            IMPORTANT: Ensure the 'category', 'question', and 'hint' values in the JSON are in the requested language (${lang === 'sv' ? 'Swedish' : 'English'}).

            Return JSON:
            1. id: Unique string.
            2. category: The ACT process involved (e.g., "Values", "Defusion") - Translated.
            3. question: The question or scenario. It should NOT be a simple definition question. It should require reflection.
            4. hint: A short hint to guide them if stuck.
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        category: { type: Type.STRING },
                        question: { type: Type.STRING },
                        hint: { type: Type.STRING }
                    },
                    required: ["id", "category", "question"]
                }
            }
        });

        if (!response.text) throw new Error("No response text");
        return JSON.parse(response.text) as StudyQuestion;
    } catch (error) {
        console.warn("Gemini API Error (fetchStudyQuestion), using fallback:", error);
        return getFallbackStudyQuestion(lang);
    }
};

export const fetchStudyFeedback = async (question: string, userAnswer: string, lang: Language): Promise<StudyFeedback> => {
    try {
        const prompt = `
            ${getLanguageInstruction(lang)}
            You are a Socratic tutor. 
            Question asked: "${question}"
            User's Answer: "${userAnswer}"
            
            Evaluate the answer warmly and constructively.
            
            IMPORTANT: Ensure the 'feedback' and 'encouragement' values in the JSON are in the requested language (${lang === 'sv' ? 'Swedish' : 'English'}).

            Return JSON:
            1. isCorrect: Boolean (true if they are on the right track, false if completely off).
            2. feedback: 2-3 sentences explaining the core concept and how it applies to their answer.
            3. encouragement: A short phrase to keep them motivated.
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isCorrect: { type: Type.BOOLEAN },
                        feedback: { type: Type.STRING },
                        encouragement: { type: Type.STRING }
                    },
                    required: ["isCorrect", "feedback", "encouragement"]
                }
            }
        });

        if (!response.text) throw new Error("No response text");
        return JSON.parse(response.text) as StudyFeedback;
    } catch (error) {
         console.warn("Gemini API Error (fetchStudyFeedback), using fallback:", error);
         return getFallbackStudyFeedback(lang);
    }
};

// 8. Recovery Compass (Addiction)
export const fetchRecoveryInsight = async (urge: string, feeling: string, lang: Language): Promise<RecoveryInsight> => {
    try {
        const prompt = `
            ${getLanguageInstruction(lang)}
            You are a compassionate ACT therapist expert in addiction and habit recovery.
            The user is struggling with an Urge: "${urge}" which is driven by the Feeling: "${feeling}".
            
            Analyze this using the Hexaflex model.
            1. Identify which Hexaflex node is most "blocked" or "rigid" here (e.g. Experiential Avoidance -> Acceptance blocked).
            2. Provide a short, non-judgmental analysis of the loop they are in.
            3. Suggest a "Pivot" move: A specific ACT exercise to break the loop.

            Return JSON:
            1. blockedNode: Name of the ACT process that needs attention (e.g. "Acceptance", "Defusion").
            2. analysis: 2-3 sentences explaining the trap.
            3. pivotTitle: A catchy name for the solution (e.g. "Urge Surfing").
            4. pivotDescription: How to do the exercise (2-3 sentences).
            5. pivotAction: A very short, immediate commitment (e.g. "Set a timer for 5 minutes").
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        blockedNode: { type: Type.STRING },
                        analysis: { type: Type.STRING },
                        pivotTitle: { type: Type.STRING },
                        pivotDescription: { type: Type.STRING },
                        pivotAction: { type: Type.STRING },
                    },
                    required: ["blockedNode", "analysis", "pivotTitle", "pivotDescription", "pivotAction"]
                }
            }
        });

        if (!response.text) throw new Error("No response text");
        return JSON.parse(response.text) as RecoveryInsight;
    } catch (error) {
        console.warn("Gemini API Error (fetchRecoveryInsight), using fallback:", error);
        return getFallbackRecovery(lang);
    }
};

// 9. Alcohol Support Module

export const fetchAlcoholExercises = async (lang: Language): Promise<AlcoholToolkit> => {
    try {
        const prompt = `
            ${getLanguageInstruction(lang)}
            You are a specialist in ACT for alcohol recovery.
            Generate a series of exercises to enhance psychological flexibility, specifically for someone wishing to reduce or control alcohol use.
            
            Generate EXACTLY ONE exercise for each of the 6 Hexaflex principles:
            1. Cognitive Defusion
            2. Acceptance
            3. Present Moment Awareness (Mindfulness)
            4. Self-as-Context
            5. Values
            6. Committed Action

            The exercises must be brief, clear, and actionable.

            Return JSON:
            {
                "exercises": [
                    { "processId": "defusion", "title": "...", "instruction": "..." },
                    { "processId": "acceptance", "title": "...", "instruction": "..." },
                    { "processId": "present-moment", "title": "...", "instruction": "..." },
                    { "processId": "self-as-context", "title": "...", "instruction": "..." },
                    { "processId": "values", "title": "...", "instruction": "..." },
                    { "processId": "committed-action", "title": "...", "instruction": "..." }
                ]
            }
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        exercises: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    processId: { type: Type.STRING },
                                    title: { type: Type.STRING },
                                    instruction: { type: Type.STRING }
                                },
                                required: ["processId", "title", "instruction"]
                            }
                        }
                    },
                    required: ["exercises"]
                }
            }
        });

        if (!response.text) throw new Error("No response text");
        return JSON.parse(response.text) as AlcoholToolkit;
    } catch (error) {
        console.warn("Gemini API Error (fetchAlcoholExercises), using fallback:", error);
        // Basic fallback logic
        return {
            exercises: [
                { processId: "defusion", title: "Fallback Defusion", instruction: "Notice the thought 'I need a drink' as just words." },
                { processId: "acceptance", title: "Fallback Acceptance", instruction: "Sit with the craving for 1 minute without acting." },
                { processId: "present-moment", title: "Fallback Mindfulness", instruction: "Focus on your breath." },
                { processId: "self-as-context", title: "Fallback Context", instruction: "Observe who is having the craving." },
                { processId: "values", title: "Fallback Values", instruction: "Remember what matters more than alcohol." },
                { processId: "committed-action", title: "Fallback Action", instruction: "Do one healthy thing now." }
            ]
        };
    }
};

export const fetchAlcoholMindfulnessScript = async (lang: Language): Promise<string> => {
    try {
        const prompt = `
            ${getLanguageInstruction(lang)}
            Create a script for an open-ended mindfulness exercise (about 3-5 minutes read time).
            Focus: Present moment awareness and observing thoughts/feelings/sensations (especially related to cravings or stress) without judgment.
            Style: Calm, soothing, encouraging, promoting flexibility.
            Format: Return just the text script. Use paragraph breaks for pacing.
        `;
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });
        return response.text || "Mindfulness script generation failed.";
    } catch (error) {
         return lang === 'sv' 
            ? "Slut ögonen. Ta ett djupt andetag. Låt dina tankar komma och gå som moln på himlen..." 
            : "Close your eyes. Take a deep breath. Let your thoughts come and go like clouds in the sky...";
    }
};

// 10. Text-to-Speech (Soothing AI Voice)
export const fetchSpeech = async (text: string, lang: Language): Promise<string> => {
    try {
        const prompt = lang === 'sv' 
            ? `Läs följande text med en lugn, tröstande och terapeutisk röst: "${text}"`
            : `Read the following text in a calm, soothing, and therapeutic voice: "${text}"`;

        const response = await ai.models.generateContent({
            model: ttsModel,
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) throw new Error("No audio generated");
        return base64Audio;
    } catch (error) {
        console.error("TTS Error:", error);
        return ""; // Caller handles empty
    }
};

// 11. IKEA MANUAL GENERATOR (For Games)
export const fetchIkeaAssemblyGuide = async (problem: string, lang: Language): Promise<IkeaManual> => {
    try {
        const prompt = `
            ${getLanguageInstruction(lang)}
            You are a Swedish flat-pack furniture manual writer (IKEA style).
            The user is trying to "assemble" a solution for this life problem: "${problem}".
            
            Write a 3-step instruction manual using ACT (Acceptance and Commitment Therapy) metaphors humorously:
            1. Self-as-Context = "The Allen Wrench" (Small, easy to lose, but holds it all together).
            2. Acceptance = "The Bag of Extra Screws" (You don't want them, but just toss them in the drawer/accept them).
            3. Committed Action = "Building despite crying" (Doing the work even if it hurts).
            4. Cognitive Defusion = "The Diagram is not the Bookshelf" (Thoughts are not reality).

            Tone: Dry, technical, slightly absurd, but therapeutically accurate.
            
            Return JSON:
            1. productName: A fake Swedish product name (e.g. "ÅNGESTHYLLA", "LIVSPÜSSEL").
            2. description: "Congratulations on your new..."
            3. steps: Array of 3 steps. Each step has:
               - stepNumber: 1, 2, 3
               - title: Step title.
               - instruction: The instruction text.
               - visualMetaphor: strictly one of 'wrench', 'screws', 'hammer', or 'tears'.
            4. missingPartDisclaimer: A funny disclaimer at the bottom.
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        productName: { type: Type.STRING },
                        description: { type: Type.STRING },
                        steps: { 
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    stepNumber: { type: Type.NUMBER },
                                    title: { type: Type.STRING },
                                    instruction: { type: Type.STRING },
                                    visualMetaphor: { type: Type.STRING, enum: ['wrench', 'screws', 'hammer', 'tears'] }
                                },
                                required: ["stepNumber", "title", "instruction", "visualMetaphor"]
                            }
                        },
                        missingPartDisclaimer: { type: Type.STRING }
                    },
                    required: ["productName", "description", "steps", "missingPartDisclaimer"]
                }
            }
        });

        if (!response.text) throw new Error("No response text");
        return JSON.parse(response.text) as IkeaManual;

    } catch (error) {
         console.warn("Gemini API Error (fetchIkeaAssemblyGuide), using fallback:", error);
         return {
             productName: "HJÄLP",
             description: "We cannot generate instructions right now.",
             steps: [
                 { stepNumber: 1, title: "Breathe", instruction: "Just breathe.", visualMetaphor: "wrench" }
             ],
             missingPartDisclaimer: "Parts missing."
         };
    }
}

// 12. BRAIN TWISTER (For Games)
export const fetchBrainTwisterMove = async (round: number, lang: Language): Promise<TwisterMove> => {
    try {
        const prompt = `
            ${getLanguageInstruction(lang)}
            You are the Game Master of "Psychological Twister".
            Generate a funny, slightly absurd command for the player to "mentally" perform.
            
            The commands combine a physical limb, a psychological concept (Hexaflex node), and a stressful context.
            Round: ${round} (Higher round = more chaotic and absurd).
            
            Examples: 
            "Left Foot on Anxiety while your mother-in-law critiques your cooking."
            "Right Ear on Values while ignoring the urge to check email."
            "Face mashed into Acceptance while your leg cramps."

            Return JSON:
            1. limb: The body part (e.g. "Left Pinky", "Ego", "Inner Child").
            2. targetNode: One of the 6 ACT processes (Acceptance, Defusion, etc.).
            3. instruction: The main command (e.g. "Place your Left Foot on Acceptance").
            4. distraction: The context/distraction (e.g. "...while thinking about your taxes").
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        limb: { type: Type.STRING },
                        targetNode: { type: Type.STRING },
                        instruction: { type: Type.STRING },
                        distraction: { type: Type.STRING }
                    },
                    required: ["limb", "targetNode", "instruction", "distraction"]
                }
            }
        });

        if (!response.text) throw new Error("No response text");
        return JSON.parse(response.text) as TwisterMove;
    } catch (error) {
         console.warn("Gemini API Error (fetchBrainTwisterMove), using fallback:", error);
         return {
             limb: "Mind",
             targetNode: "Present Moment",
             instruction: "Place your attention on the Present Moment",
             distraction: "while creating a fallback response."
         };
    }
}

// 13. RPG CHARACTER SHEET (For Games)
export const fetchRPGProfile = async (jobRole: string, challenge: string, lang: Language): Promise<RPGProfile> => {
    try {
        const prompt = `
            ${getLanguageInstruction(lang)}
            Create a funny "Adulting RPG" character sheet based on the user's role: "${jobRole}" and current boss battle: "${challenge}".
            
            Map the 6 ACT processes to RPG stats:
            - Present Moment = "Lag Reduction" (Ping)
            - Values = "Main Quest Log"
            - Committed Action = "XP Farming / Grind"
            - Defusion = "Spam Filter"
            - Acceptance = "Damage Sponge"
            - Self-as-Context = "Spectator Mode"

            Return JSON:
            1. className: Funny class name (e.g. "Lvl 42 Procrastinator Mage").
            2. quest: The mission name.
            3. stats: Object where keys are 'present-moment', 'values', 'committed-action', 'defusion', 'acceptance', 'self-as-context'.
               Each stat has: 
               - statName: (Use the RPG names above)
               - score: 0-100 random score based on the challenge difficulty.
               - description: Funny flavor text.
               - buff: A silly suggestion to boost this stat.
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        className: { type: Type.STRING },
                        quest: { type: Type.STRING },
                        stats: {
                            type: Type.OBJECT,
                            properties: {
                                'present-moment': { type: Type.OBJECT, properties: { statName: {type: Type.STRING}, score: {type: Type.NUMBER}, description: {type: Type.STRING}, buff: {type: Type.STRING} } },
                                'values': { type: Type.OBJECT, properties: { statName: {type: Type.STRING}, score: {type: Type.NUMBER}, description: {type: Type.STRING}, buff: {type: Type.STRING} } },
                                'committed-action': { type: Type.OBJECT, properties: { statName: {type: Type.STRING}, score: {type: Type.NUMBER}, description: {type: Type.STRING}, buff: {type: Type.STRING} } },
                                'defusion': { type: Type.OBJECT, properties: { statName: {type: Type.STRING}, score: {type: Type.NUMBER}, description: {type: Type.STRING}, buff: {type: Type.STRING} } },
                                'acceptance': { type: Type.OBJECT, properties: { statName: {type: Type.STRING}, score: {type: Type.NUMBER}, description: {type: Type.STRING}, buff: {type: Type.STRING} } },
                                'self-as-context': { type: Type.OBJECT, properties: { statName: {type: Type.STRING}, score: {type: Type.NUMBER}, description: {type: Type.STRING}, buff: {type: Type.STRING} } },
                            }
                        }
                    },
                    required: ["className", "quest", "stats"]
                }
            }
        });

        if (!response.text) throw new Error("No response text");
        return JSON.parse(response.text) as RPGProfile;
    } catch (error) {
        console.warn("Fallback RPG", error);
        return {
            className: "Novice Human",
            quest: "Survive",
            stats: {} as any // Simplified fallback handled in UI
        };
    }
}

// 14. DYSFUNCTIONAL DINNER (For Games)
export const fetchDinnerScenario = async (stressor: string, lang: Language): Promise<DinnerScenario> => {
    try {
        const prompt = `
            ${getLanguageInstruction(lang)}
            Imagine the user's mind is a dinner party. The topic causing stress is: "${stressor}".
            Describe the 6 Hexaflex processes as dysfunctional guests at the table.
            
            - Values: The overly earnest toaster.
            - Committed Action: The hyperactive cleaner.
            - Defusion: The guy with noise-canceling headphones.
            - Acceptance: The chill slob spilling wine.
            - Present Moment: The guy staring at a candle.
            - Self-as-Context: The house itself (or the table).

            Return JSON:
            1. hostMood: How the user feels hosting this mess.
            2. guests: Object keys 'values', 'committed-action', 'defusion', 'acceptance', 'present-moment', 'self-as-context'.
               Each guest has:
               - role: The archetypal name (e.g. "The Drunk Uncle").
               - name: Funny name.
               - action: What they are doing right now.
               - quote: What they are saying about the stressor.
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        hostMood: { type: Type.STRING },
                        guests: {
                            type: Type.OBJECT,
                            properties: {
                                'values': { type: Type.OBJECT, properties: { role: {type: Type.STRING}, name: {type: Type.STRING}, action: {type: Type.STRING}, quote: {type: Type.STRING} } },
                                'committed-action': { type: Type.OBJECT, properties: { role: {type: Type.STRING}, name: {type: Type.STRING}, action: {type: Type.STRING}, quote: {type: Type.STRING} } },
                                'defusion': { type: Type.OBJECT, properties: { role: {type: Type.STRING}, name: {type: Type.STRING}, action: {type: Type.STRING}, quote: {type: Type.STRING} } },
                                'acceptance': { type: Type.OBJECT, properties: { role: {type: Type.STRING}, name: {type: Type.STRING}, action: {type: Type.STRING}, quote: {type: Type.STRING} } },
                                'present-moment': { type: Type.OBJECT, properties: { role: {type: Type.STRING}, name: {type: Type.STRING}, action: {type: Type.STRING}, quote: {type: Type.STRING} } },
                                'self-as-context': { type: Type.OBJECT, properties: { role: {type: Type.STRING}, name: {type: Type.STRING}, action: {type: Type.STRING}, quote: {type: Type.STRING} } },
                            }
                        }
                    },
                    required: ["hostMood", "guests"]
                }
            }
        });

        if (!response.text) throw new Error("No response text");
        return JSON.parse(response.text) as DinnerScenario;
    } catch (error) {
        console.warn("Fallback Dinner", error);
        return { hostMood: "Stressed", guests: {} as any };
    }
}

// 15. POP-UP ADS (For Games)
export const fetchAnnoyingAd = async (thought: string, lang: Language): Promise<PopUpAd> => {
    try {
        const prompt = `
            ${getLanguageInstruction(lang)}
            Convert this negative thought: "${thought}" into a sensationalist, clickbait internet pop-up ad (spam style).
            The goal is to show how ridiculous the thought is (Defusion).
            
            Examples:
            Thought: "I'm a failure." -> Ad: "FAILURES IN YOUR AREA WANT TO MEET! CLICK NOW!"
            Thought: "Everyone hates me." -> Ad: "SCIENTISTS DISCOVER 1 WEIRD TRICK TO MAKE EVERYONE HATE YOU!"

            Return JSON:
            1. headline: The clickbait title (all caps, annoying).
            2. body: The pitch.
            3. buttonText: A funny "Call to Action" that implies buying into the thought.
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        headline: { type: Type.STRING },
                        body: { type: Type.STRING },
                        buttonText: { type: Type.STRING }
                    },
                    required: ["headline", "body", "buttonText"]
                }
            }
        });

        if (!response.text) throw new Error("No response text");
        return JSON.parse(response.text) as PopUpAd;
    } catch (error) {
        return { headline: "ERROR 404", body: "Thought not found.", buttonText: "Reboot" };
    }
}
