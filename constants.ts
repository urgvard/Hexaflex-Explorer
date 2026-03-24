
import { ActProcess, Language, Translations, ReferenceResource } from './types';

// ── Interaction timings ──────────────────────────────────────────────
export const LONG_PRESS_MS = 600;
export const QUOTE_ROTATION_MS = 60_000;
export const HINT_SHOW_DELAY_MS = 2_000;
export const HINT_HIDE_DELAY_MS = 5_000;
export const BREATHING_CYCLE_S = 16;

// ── Gemini model identifiers ─────────────────────────────────────────
export const GEMINI_MODEL = 'gemini-2.5-flash';
export const GEMINI_TTS_MODEL = 'gemini-2.5-flash-preview-tts';

// ── Input limits ─────────────────────────────────────────────────────
export const MAX_INPUT_CHARS = 500;

// Soft, therapeutic pastel palette
export const PASTEL_COLORS = {
  present: '#99f6e4', // Teal 200 (Minty)
  values: '#fbcfe8', // Pink 200 (Rose)
  action: '#fde68a', // Amber 200 (Soft Gold)
  context: '#c4b5fd', // Violet 300 (Lavender)
  defusion: '#bfdbfe', // Blue 200 (Baby Blue)
  acceptance: '#fecaca', // Red 200 (Salmon)
};

export const UI_TEXT: Record<Language, Translations> = {
  en: {
    title: 'Hexaflex Explorer',
    subtitle: 'Psychological Flexibility',
    instructions: 'Select one node to explore deeply.\nSelect two nodes to discover their synergy.',
    defusionLab: 'Defusion Lab',
    defusionLabSubtitle: 'Cognitive Alchemist',
    mindfulnessStudio: 'Mindfulness',
    mindfulnessSubtitle: 'Present Moment Anchor',
    recoveryCompass: 'Recovery Compass',
    recoverySubtitle: 'Addiction & Patterns',
    alcoholSupport: 'Alcohol',
    alcoholBubbleDescription: '"Explore specific Hexaflex tools for navigating alcohol use."',
    synergyBridge: 'The Bridge',
    synergyTip: 'Synergy Tip',
    close: 'Close',
    loading: 'Synthesizing...',
    waitingThought: 'Waiting for a thought...',
    inputPlaceholder: 'e.g. I am not good enough...',
    contextPlaceholder: 'e.g. Work stress, feeling overwhelmed, anxiety...',
    reflectionPlaceholder: 'Type your reflection here...',
    tryThis: 'Try This Now',
    microHabits: 'Micro-Habits',
    reflect: 'Reflect',
    back: 'Back',
    startOver: 'Start Over',
    music: 'Soundscape',
    nextTrack: 'Shift Mood',
    
    centerLine1: 'PSYCHOLOGICAL',
    centerLine2: 'FLEXIBILITY',
    breathePrompt: 'Stop - tap to breathe...',
    stopBreathe: 'Stop breathing',
    longPressHint: 'Long-press a circle to quick-start an exercise.',

    dailyCueTitle: 'Today\'s Flexibility Cue',
    dailyCuePlaceholder: 'Loading insight...',

    conceptActTitle: 'The Concept of ACT Therapy',
    conceptActContent: 'Acceptance and Commitment Therapy (ACT) teaches you to accept what is out of your personal control, and commit to action that improves and enriches your life. The aim is to maximize human potential for a rich, full, and meaningful life.',
    conceptHexagonTitle: 'The Concept of Hexagon Theory',
    conceptHexagonContent: 'The ACT Hexagon maps out six essential mental skills that help you stop fighting your feelings and start living a life you love. By practicing them together, you build the emotional flexibility needed to handle life’s challenges without losing your way.',

    perspective: 'Perspective',
    thePrism: 'Contextualization',
    prismIntro: 'Describe your current situation or feelings to see how this process applies to you specifically.',
    
    processA: 'Process A',
    processB: 'Process B',

    defusionIntro: 'Input a sticky, painful, or repetitive thought. The AI will help you detach from it.',
    defusionAnalyze: 'Analyzing Hook...',
    defusionExperiment: 'Experiment',
    defusionRelease: 'Release',
    defusionReframeHeader: 'The Reframe',
    defusionTechniquesHeader: 'Try These Techniques',
    defusionFinalStep: 'Let It Go',
    defusionRestart: 'New Thought',

    recoveryIntro: 'Break the loop. Identify the urge or pattern you are struggling with, and see how ACT can provide a pivot point.',
    recoveryInputUrge: 'The Urge / Addiction (e.g. Drinking, Scrolling)',
    recoveryInputFeeling: 'The Feeling Behind It (e.g. Anxiety, Boredom)',
    recoveryAnalyze: 'Mapping the Loop...',
    recoveryTheLoop: 'The Trap',
    recoveryThePivot: 'The Pivot',
    recoveryAction: 'Commitment',

    alcoholIntro: 'A specialized toolkit for navigating alcohol use through the lens of psychological flexibility.',
    alcoholTabExercises: 'Hexaflex Exercises',
    alcoholTabScript: 'Mindfulness Script',
    alcoholGenerateExercises: 'Generate Recovery Exercises',
    alcoholGenerateScript: 'Create Awareness Script',

    mindfulnessIntro: 'Activate your "Observing Self". Select a feeling below or describe your state to generate a tailored session.',
    mindfulnessGoal: 'The AI will select a specific technique (e.g., Box Breathing, Body Scan, Visualization) best suited for your current needs.',
    mindfulnessInputLabel: 'I am feeling...',
    mindfulnessPlaceholder: 'e.g. Overwhelmed, Scattered, Heavy, Restless...',
    mindfulnessTags: {
        stress: 'Stressed',
        focus: 'Unfocused',
        sleep: 'Can\'t Sleep',
        anxiety: 'Anxious'
    },
    startSession: 'Design Session',
    beginPractice: 'Begin Practice',
    stopSession: 'End Session',
    listen: 'Lyssna',
    technique: 'Technique',
    scienceBehind: 'The Purpose',

    libraryTitle: 'Reference Library',
    librarySubtitle: 'Clinically Trusted Resources',
    sectionOrgs: 'Organizations & Clinical Bodies',
    sectionBooks: 'Seminal Books',
    sectionResearch: 'Research & Tools',

    guideTitle: 'Interactive Guide',
    guideExplore: 'Explore',
    guideExploreDesc: 'Select a node to reveal insights and exercises.',
    guideSynergy: 'Synergy',
    guideSynergyDesc: 'Select two nodes to discover connections.',

    studyTitle: 'Reflective Study',
    studySubtitle: 'Deepen Your Understanding',
    studyIntro: 'This interactive guide asks random questions to help you reflect on the Hexaflex model. There are no wrong answers, only deeper insights.',
    studyStart: 'Start Reflection',
    studyAnswerPlaceholder: 'Type your thoughts here...',
    studySubmit: 'Check Insight',
    studyNext: 'Next Question',
    studyFeedbackTitle: 'Guide\'s Perspective',

    gamesTitle: 'The Arcade',
    gamesSubtitle: 'Playful Perspectives',
    gameIkeaTitle: 'The "Hëxäflëx" Manual',
    gameIkeaDesc: 'Assemble your soul like flat-pack furniture.',
    gameTwisterTitle: 'Brain Twister',
    gameTwisterDesc: 'Psychological flexibility... literally.',
    gameRPGTitle: 'Adulting RPG',
    gameRPGDesc: 'Your character stats for real life.',
    gameDinnerTitle: 'Dysfunctional Dinner',
    gameDinnerDesc: 'The Hexagon as a chaotic dinner party.',
    gameAdsTitle: 'Unsolicited Ads',
    gameAdsDesc: 'Treat thoughts like internet pop-ups.',

    gamePlay: 'Play',
    gameAssemble: 'Assemble',
    gameSpin: 'Spin',
    gameRoll: 'Roll Stats',
    gameSeatGuests: 'Seat Guests',
    gameGenerate: 'See What Your Brain Says',
    gameSkipAd: 'Skip Ad',
    gameNextStep: 'Next Step',
    gamePrevStep: 'Prev Step',
    gameFinish: 'Finish',
    gameTryAgain: 'Try Again',
    gameReroll: 'Reroll Character',
    gameRound: 'Round',
    gameStreak: 'Streak',

    ikeaProblemPlaceholder: 'e.g. Existential Dread',
    ikeaIntroTitle: 'What are you building?',
    ikeaIntroDesc: 'Enter the problem you are trying to solve (e.g. "Anxiety", "Procrastination").',

    twisterIntroTitle: 'Psychological Twister',
    twisterIntroDesc: '"The Spinner is Life. It yells out commands. You try not to fall over mentally."',
    twisterSpinning: 'Life is spinning...',
    twisterCollapsed: 'I Collapsed',
    twisterHeld: 'I Held It!',
    twisterOuch: 'OUCH!',

    rpgIntroTitle: 'Create Your Character',
    rpgRoleLabel: 'Current Role / Job',
    rpgRolePlaceholder: 'e.g. Exhausted Parent, Junior Dev',
    rpgBossLabel: 'Current Boss Battle (Stressor)',
    rpgBossPlaceholder: 'e.g. Laundry Mountain, Imposter Syndrome',

    dinnerIntroTitle: 'What\'s on the menu?',
    dinnerIntroDesc: 'Enter the stressful topic you are "serving" tonight.',
    dinnerInputPlaceholder: 'e.g. My Career Choices',
    dinnerHostMood: 'Host Mood',

    adIntroTitle: 'AdBlocker: Brain Edition',
    adIntroDesc: 'Input a sticky thought',
    adInputPlaceholder: 'I\'m terrible at everything...',
    adButtonLoading: 'Loading...',

    tabs: {
        essence: 'Essence',
        personalize: 'Contextualization',
        action: 'Action',
        reflect: 'Reflect'
    },
    copyrightLine: `© ${new Date().getFullYear()} Jesper Kähr. All rights reserved.`,
    copyrightContact: 'jesper.kahr@protonmail.com',
  },
  sv: {
    title: 'Hexaflex Explorer',
    subtitle: 'Psykologisk Flexibilitet',
    instructions: 'Välj en nod för att utforska djupt.\nVälj två noder för att upptäcka deras synergi.',
    defusionLab: 'Defusionslabbet',
    defusionLabSubtitle: 'Kognitiv Alkemist',
    mindfulnessStudio: 'Mindfulness',
    mindfulnessSubtitle: 'Ankare i Nuet',
    recoveryCompass: 'Återhämtningskompass',
    recoverySubtitle: 'Beroende & Mönster',
    alcoholSupport: 'Alkohol',
    alcoholBubbleDescription: '"Utforska specifika Hexaflex-verktyg för att navigera kring alkohol."',
    synergyBridge: 'Bron',
    synergyTip: 'Synergitips',
    close: 'Stäng',
    loading: 'Syntetiserar...',
    waitingThought: 'Väntar på en tanke...',
    inputPlaceholder: 't.ex. Jag duger inte...',
    contextPlaceholder: 't.ex. Arbetsstress, känner mig överväldigad, ångest...',
    reflectionPlaceholder: 'Skriv din reflektion här...',
    tryThis: 'Prova Detta Nu',
    microHabits: 'Mikro-Vanor',
    reflect: 'Reflektera',
    back: 'Tillbaka',
    startOver: 'Börja Om',
    music: 'Ljudlandskap',
    nextTrack: 'Byt Stämning',

    centerLine1: 'PSYKOLOGISK',
    centerLine2: 'FLEXIBILITET',
    breathePrompt: 'Stanna upp - tryck för att andas...',
    stopBreathe: 'Sluta andas',
    longPressHint: 'Håll inne en cirkel för snabbstart.',

    dailyCueTitle: 'Dagens Flexibilitetstips',
    dailyCuePlaceholder: 'Laddar insikt...',

    conceptActTitle: 'Konceptet ACT-Terapi',
    conceptActContent: 'Acceptance and Commitment Therapy (ACT) lär dig att acceptera det du inte kan kontrollera, och att engagera dig i handlingar som berikar ditt liv. Målet är att maximera mänsklig potential för ett rikt och meningsfullt liv.',
    conceptHexagonTitle: 'Konceptet Hexagonteori',
    conceptHexagonContent: 'ACT-hexagonen kartlägger sex mentala färdigheter som hjälper dig sluta kämpa mot dina känslor och börja leva ett liv du älskar. Genom att öva dessa bygger du den emotionella flexibilitet som krävs för att hantera livets utmaningar utan att tappa bort vägen.',

    perspective: 'Perspektiv',
    thePrism: 'Kontextualisering',
    prismIntro: 'Beskriv din nuvarande situation eller känslor för att se hur denna process gäller dig specifikt.',

    processA: 'Process A',
    processB: 'Process B',

    defusionIntro: 'Skriv in en klistrig, smärtsam eller återkommande tanke. AI:n hjälper dig att koppla loss från den.',
    defusionAnalyze: 'Analyserar Kroken...',
    defusionExperiment: 'Experimentera',
    defusionRelease: 'Släpp Taget',
    defusionReframeHeader: 'Omformuleringen',
    defusionTechniquesHeader: 'Prova Dessa Tekniker',
    defusionFinalStep: 'Låt Det Gå',
    defusionRestart: 'Ny Tanke',

    recoveryIntro: 'Bryt loopen. Identifiera impulsen eller mönstret du kämpar med, och se hur ACT kan ge en vändpunkt.',
    recoveryInputUrge: 'Impulsen / Beroendet (t.ex. Dricka, Scrolla)',
    recoveryInputFeeling: 'Känslan bakom (t.ex. Ångest, Uttråkning)',
    recoveryAnalyze: 'Kartlägger Loopen...',
    recoveryTheLoop: 'Fällan',
    recoveryThePivot: 'Vändpunkten',
    recoveryAction: 'Åtagande',

    alcoholIntro: 'En specialiserad verktygslåda för att navigera alkoholbruk genom psykologisk flexibilitet.',
    alcoholTabExercises: 'Hexaflex Övningar',
    alcoholTabScript: 'Mindfulness Script',
    alcoholGenerateExercises: 'Generera Återhämtningsövningar',
    alcoholGenerateScript: 'Skapa Medvetenhets-script',

    mindfulnessIntro: 'Aktivera ditt "Observerande Jag". Välj en känsla nedan eller beskriv ditt tillstånd för att skapa en skräddarsydd session.',
    mindfulnessGoal: 'AI:n väljer en specifik teknik (t.ex. Fyrkantsandning, Kroppsscanning, Visualisering) som passar dina behov bäst.',
    mindfulnessInputLabel: 'Jag känner mig...',
    mindfulnessPlaceholder: 't.ex. Överväldigad, Splittrad, Tung, Rastlös...',
    mindfulnessTags: {
        stress: 'Stressad',
        focus: 'Ofokuserad',
        sleep: 'Kan inte sova',
        anxiety: 'Ångestfylld'
    },
    startSession: 'Designa Session',
    beginPractice: 'Starta Övning',
    stopSession: 'Avsluta Session',
    listen: 'Lyssna',
    technique: 'Teknik',
    scienceBehind: 'Syftet',

    libraryTitle: 'Referensbibliotek',
    librarySubtitle: 'Kliniskt Säkrade Resurser',
    sectionOrgs: 'Organisationer & Kliniska Organ',
    sectionBooks: 'Grundläggande Böcker',
    sectionResearch: 'Forskning & Verktyg',

    guideTitle: 'Interaktiv Guide',
    guideExplore: 'Utforska',
    guideExploreDesc: 'Välj en nod för att visa insikter och övningar.',
    guideSynergy: 'Synergi',
    guideSynergyDesc: 'Välj två noder för att upptäcka kopplingar.',

    studyTitle: 'Reflekterande Studie',
    studySubtitle: 'Fördjupa din förståelse',
    studyIntro: 'Denna interaktiva guide ställer slumpmässiga frågor för att hjälpa dig reflektera över Hexaflex-modellen. Det finns inga fel svar, bara djupare insikter.',
    studyStart: 'Starta Reflektion',
    studyAnswerPlaceholder: 'Skriv dina tankar här...',
    studySubmit: 'Kontrollera Insikt',
    studyNext: 'Nästa Fråga',
    studyFeedbackTitle: 'Guidens Perspektiv',

    gamesTitle: 'Spelhallen',
    gamesSubtitle: 'Lekfulla Perspektiv',
    gameIkeaTitle: '"Hëxäflëx" Manualen',
    gameIkeaDesc: 'Montera din själ som en platt paketmöbel.',
    gameTwisterTitle: 'Hjärn-Twister',
    gameTwisterDesc: 'Psykologisk flexibilitet... bokstavligen.',
    gameRPGTitle: 'Vuxen-RPG',
    gameRPGDesc: 'Dina karaktärspoäng för det verkliga livet.',
    gameDinnerTitle: 'Kaosartad Middag',
    gameDinnerDesc: 'Hexagonen som en dysfunktionell middagsbjudning.',
    gameAdsTitle: 'Oönskade Annonser',
    gameAdsDesc: 'Behandla tankar som internet-popups.',

    gamePlay: 'Spela',
    gameAssemble: 'Montera',
    gameSpin: 'Snurra',
    gameRoll: 'Slå tärning',
    gameSeatGuests: 'Placera gäster',
    gameGenerate: 'Vad säger hjärnan?',
    gameSkipAd: 'Hoppa över',
    gameNextStep: 'Nästa steg',
    gamePrevStep: 'Föregående',
    gameFinish: 'Klar',
    gameTryAgain: 'Försök igen',
    gameReroll: 'Slå om karaktär',
    gameRound: 'Runda',
    gameStreak: 'Svit',

    ikeaProblemPlaceholder: 't.ex. Existentiell Ångest',
    ikeaIntroTitle: 'Vad bygger du?',
    ikeaIntroDesc: 'Ange problemet du försöker lösa (t.ex. "Ångest", "Uppskjutande").',

    twisterIntroTitle: 'Psykologisk Twister',
    twisterIntroDesc: '"Snurran är Livet. Den skriker ut kommandon. Du försöker att inte ramla ihop mentalt."',
    twisterSpinning: 'Livet snurrar...',
    twisterCollapsed: 'Jag kollapsade',
    twisterHeld: 'Jag klarade det!',
    twisterOuch: 'AJ!',

    rpgIntroTitle: 'Skapa din Karaktär',
    rpgRoleLabel: 'Nuvarande Roll / Jobb',
    rpgRolePlaceholder: 't.ex. Utmattad Förälder, Junior Utvecklare',
    rpgBossLabel: 'Nuvarande Boss-strid (Stressfaktor)',
    rpgBossPlaceholder: 't.ex. Tvättberget, Bluffsyndrom',

    dinnerIntroTitle: 'Vad står på menyn?',
    dinnerIntroDesc: 'Ange det stressiga ämnet du "serverar" ikväll.',
    dinnerInputPlaceholder: 't.ex. Mina Karriärval',
    dinnerHostMood: 'Värdens Humör',

    adIntroTitle: 'AdBlocker: Hjärn-utgåva',
    adIntroDesc: 'Skriv in en klistrig tanke',
    adInputPlaceholder: 'Jag är usel på allt...',
    adButtonLoading: 'Laddar...',

    tabs: {
        essence: 'Essens',
        personalize: 'Kontextualisering',
        action: 'Handling',
        reflect: 'Reflektera'
    },
    copyrightLine: `© ${new Date().getFullYear()} Jesper Kähr. Alla rättigheter förbehållna.`,
    copyrightContact: 'jesper.kahr@protonmail.com',
  }
};

export const INSPIRATIONAL_QUOTES = [
    { en: "You are the sky. Everything else is just the weather.", sv: "Du är himlen. Allt annat är bara väder." },
    { en: "Breathe. You are exactly where you need to be.", sv: "Andas. Du är precis där du behöver vara." },
    { en: "Courage is not the absence of fear, but the ability to act in spite of it.", sv: "Mod är inte avsaknad av rädsla, utan förmågan att agera trots den." },
    { en: "This too shall pass.", sv: "Även detta skall passera." },
    { en: "Small steps are still progress.", sv: "Små steg är också framsteg." },
    { en: "Be kind to yourself.", sv: "Var snäll mot dig själv." },
    { en: "In the midst of movement and chaos, keep stillness inside of you.", sv: "Mitt i rörelse och kaos, behåll stillheten inom dig." },
    { en: "Your potential is endless.", sv: "Din potential är oändlig." },
    { en: "Calmness is a superpower.", sv: "Lugn är en superkraft." },
    { en: "Grow through what you go through.", sv: "Väx genom det du går igenom." },
    { en: "Peace comes from within. Do not seek it without.", sv: "Frid kommer inifrån. Sök det inte utanför." },
    { en: "Trust the wait. Embrace the uncertainty.", sv: "Lita på väntan. Omfamna ovissheten." }
];

export const REFERENCES: ReferenceResource[] = [
    // Organizations
    {
        title: 'Association for Contextual Behavioral Science (ACBS)',
        url: 'https://contextualscience.org/',
        type: 'organization'
    },
    {
        title: 'ACBS Sweden Chapter',
        url: 'https://contextualscience.org/sweden_chapter',
        type: 'organization'
    },
    {
        title: 'Beteendeterapeutiska Föreningen (BTF)',
        url: 'https://www.kbt.se/',
        type: 'organization'
    },
    {
        title: 'American Psychological Association - Division 12',
        url: 'https://div12.org/treatment/acceptance-and-commitment-therapy/',
        type: 'organization'
    },
    
    // Books
    {
        title: 'Acceptance and Commitment Therapy: The Process and Practice of Mindful Change',
        author: 'Hayes, Strosahl, & Wilson',
        url: 'https://www.guilford.com/books/Acceptance-and-Commitment-Therapy/Hayes-Strosahl-Wilson/9781462528943',
        type: 'book'
    },
    {
        title: 'ACT Made Simple',
        author: 'Russ Harris',
        url: 'https://www.actmindfully.com.au/product/act-made-simple/',
        type: 'book'
    },
    {
        title: 'Lyckofällan (The Happiness Trap - Swedish)',
        author: 'Russ Harris',
        url: 'https://naturkultur.se/facklitteratur-halsa/psykologi-och-pedagogik/psykoterapi-och-vagledning/lyckofallan/',
        type: 'book'
    },
    {
        title: 'ACT helt enkelt',
        author: 'Russ Harris',
        url: 'https://naturkultur.se/facklitteratur-halsa/psykologi-och-pedagogik/psykoterapi-och-vagledning/act-helt-enkelt-2-utg/',
        type: 'book'
    },
    {
        title: 'Learning ACT',
        author: 'Luoma, Hayes, & Walser',
        url: 'https://www.newharbinger.com/9781626259492/learning-act/',
        type: 'book'
    },

    // Research/Tools
    {
        title: 'Journal of Contextual Behavioral Science',
        url: 'https://www.sciencedirect.com/journal/journal-of-contextual-behavioral-science',
        type: 'article'
    },
    {
        title: 'The Happiness Trap (Free Resources)',
        author: 'Russ Harris',
        url: 'https://thehappinesstrap.com/free-resources/',
        type: 'tool'
    },
    {
        title: 'Livskompass.se (Svenska ACT-resurser)',
        author: 'Fredrik Livheim m.fl.',
        url: 'http://www.livskompass.se/',
        type: 'tool'
    },
    {
        title: 'Steven C. Hayes - Official Website',
        author: 'Steven C. Hayes',
        url: 'https://stevenchayes.com/',
        type: 'tool'
    }
];

export const getProcesses = (lang: Language): ActProcess[] => [
  {
    id: 'present-moment',
    title: lang === 'en' ? 'Contact with the Present Moment' : 'Kontakt med Nuet',
    shortDescription: lang === 'en' ? 'Be Here Now' : 'Var Här Nu',
    fullDescription: lang === 'en' 
        ? 'Focusing awareness on the here and now through mindfulness. It involves being psychologically present: consciously connecting with and engaging in whatever is happening in this moment.'
        : 'Att rikta uppmärksamheten mot här och nu genom medveten närvaro. Det handlar om att vara psykologiskt närvarande: att medvetet anknyta till och engagera sig i vad som än händer i detta ögonblick.',
    position: 'top',
    color: PASTEL_COLORS.present,
  },
  {
    id: 'values',
    title: lang === 'en' ? 'Values' : 'Värderingar',
    shortDescription: lang === 'en' ? 'Know What Matters' : 'Vad är Viktigt?',
    fullDescription: lang === 'en' 
        ? 'Clarifying what truly matters for a meaningful life. Values are desired qualities of ongoing action. They describe how we want to behave on an ongoing basis.'
        : 'Att tydliggöra vad som verkligen betyder något för ett meningsfullt liv. Värderingar är önskade kvaliteter i pågående handlande. De beskriver hur vi vill bete oss över tid.',
    position: 'top-right',
    color: PASTEL_COLORS.values,
  },
  {
    id: 'committed-action',
    title: lang === 'en' ? 'Committed Action' : 'Engagerat Handlande',
    shortDescription: lang === 'en' ? 'Do What It Takes' : 'Gör Det Som Krävs',
    fullDescription: lang === 'en'
        ? 'Taking concrete steps toward values-based goals. This involves setting goals guided by your values and taking effective action to achieve them, even when it’s difficult.'
        : 'Att ta konkreta steg mot värderade mål. Detta innebär att sätta mål vägledda av dina värderingar och agera effektivt för att nå dem, även när det är svårt.',
    position: 'bottom-right',
    color: PASTEL_COLORS.action,
  },
  {
    id: 'self-as-context',
    title: lang === 'en' ? 'Self as Context' : 'Självet som Kontext',
    shortDescription: lang === 'en' ? 'Pure Awareness' : 'Rent Medvetande',
    fullDescription: lang === 'en'
        ? 'Observing experiences from a transcendent sense of self, beyond content or stories. It is the "observing self"—the part of you that is aware of whatever you are thinking, feeling, or doing at any moment.'
        : 'Att observera upplevelser från ett transcendent själv, bortom innehåll eller berättelser. Det är det "observerande jaget" – den del av dig som är medveten om vad du tänker, känner eller gör i varje ögonblick.',
    position: 'bottom',
    color: PASTEL_COLORS.context,
  },
  {
    id: 'defusion',
    title: lang === 'en' ? 'Cognitive Defusion' : 'Kognitiv Defusion',
    shortDescription: lang === 'en' ? 'Watch Your Thinking' : 'Betrakta Tankarna',
    fullDescription: lang === 'en'
        ? 'Detaching from unhelpful thoughts by viewing them as passing mental events rather than literal truths. It involves stepping back and observing thoughts rather than getting caught up in them.'
        : 'Att koppla loss från ohjälpsamma tankar genom att se dem som passerande mentala händelser snarare än bokstavliga sanningar. Det handlar om att ta ett steg tillbaka och observera tankar istället för att fastna i dem.',
    position: 'top-left',
    color: PASTEL_COLORS.defusion,
  },
  {
    id: 'acceptance',
    title: lang === 'en' ? 'Acceptance' : 'Acceptans',
    shortDescription: lang === 'en' ? 'Open Up' : 'Öppna Upp',
    fullDescription: lang === 'en'
        ? 'Embracing uncomfortable thoughts and feelings without avoidance. It means making room for painful feelings, urges, and sensations, allowing them to come and go without struggling against them.'
        : 'Att omfamna obehagliga tankar och känslor utan undvikande. Det innebär att göra plats för smärtsamma känslor, impulser och förnimmelser, och låta dem komma och gå utan att kämpa emot dem.',
    position: 'bottom-left',
    color: PASTEL_COLORS.acceptance,
  },
];

export const DAILY_CUES = [
    { processId: 'values', text: { en: "What is one small way you can live your values today?", sv: "Vad är ett litet sätt du kan leva dina värderingar idag?" } },
    { processId: 'present-moment', text: { en: "Pause. What are 3 things you hear right now?", sv: "Pausa. Vad är 3 saker du hör just nu?" } },
    { processId: 'defusion', text: { en: "Notice a thought. Can you see it as just words?", sv: "Notera en tanke. Kan du se den som bara ord?" } },
    { processId: 'acceptance', text: { en: "What feeling are you fighting? Can you let it be?", sv: "Vilken känsla kämpar du emot? Kan du låta den vara?" } },
    { processId: 'self-as-context', text: { en: "Who is the 'you' noticing this screen?", sv: "Vem är det 'du' som lägger märke till denna skärm?" } },
    { processId: 'committed-action', text: { en: "What is one tiny action you've been putting off?", sv: "Vad är en liten handling du har skjutit upp?" } }
];
