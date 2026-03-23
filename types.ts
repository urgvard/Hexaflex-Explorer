
export type Language = 'en' | 'sv';
export type Theme = 'light' | 'dark';

export interface ActProcess {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  position: 'top' | 'top-right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'top-left';
  color: string;
}

export interface GeminiInsight {
  metaphor: string;
  exercise: string;
  quote: string;
}

export interface SynergyInsight {
  relationshipName: string;
  explanation: string;
  practicalTip: string;
}

export interface ActionPlan {
  steps: string[];
}

export interface DefusionTechnique {
    title: string; // e.g., "The Silly Voice"
    description: string; // e.g., "Say the thought in a Donald Duck voice..."
    category: 'visual' | 'auditory' | 'pragmatic';
}

export interface DeepDefusionResponse {
    analysis: string; // Empathetic validation
    reframe: string; // "I am noticing..."
    techniques: DefusionTechnique[];
}

export interface DefusionResult {
  variations: string[];
}

export interface RecoveryInsight {
    blockedNode: string; // e.g., "Acceptance" or "Values"
    analysis: string; // Explanation of the loop
    pivotTitle: string; // Title of the solution
    pivotDescription: string; // The exercise
    pivotAction: string; // A tiny immediate action
}

export interface AlcoholExercise {
    processId: string; // e.g., 'defusion', 'acceptance'
    title: string;
    instruction: string;
}

export interface AlcoholToolkit {
    exercises: AlcoholExercise[];
}

export interface MindfulnessSession {
    title: string;
    technique: string; // e.g. "Box Breathing" or "Visualization"
    educationalContext: string; // The "Why" and "Background"
    steps: Array<{
        instruction: string;
        duration: number; // in seconds
        pacing: 'breathing' | 'steady' | 'fast'; // For visual animation
    }>;
    insight: string; // Closing thought
}

export interface ReferenceResource {
    title: string;
    author?: string;
    url: string;
    type: 'organization' | 'book' | 'article' | 'tool';
}

export interface StudyQuestion {
    id: string;
    category: string; // e.g. "Values" or "Scenario"
    question: string;
    hint?: string;
}

export interface StudyFeedback {
    isCorrect: boolean; // Not strict, more about alignment
    feedback: string;
    encouragement: string;
}

// --- GAMES TYPES ---

export interface IkeaManualStep {
    stepNumber: number;
    title: string;
    instruction: string; // "Locate the Allen Wrench..."
    visualMetaphor: 'wrench' | 'screws' | 'hammer' | 'tears';
}

export interface IkeaManual {
    productName: string; // e.g. "ANXIËTY SÖLVER"
    description: string;
    steps: IkeaManualStep[];
    missingPartDisclaimer: string; // "Note: Serenity not included."
}

export interface TwisterMove {
    limb: string; // "Left foot", "Ego", "Inner Child"
    targetNode: string; // "Acceptance"
    instruction: string; // "Place your left foot on Acceptance..."
    distraction: string; // "...while trying not to scream at your boss."
}

export interface RPGStat {
    statName: string; // e.g. "Lag Reduction"
    score: number; // 0-100
    description: string; // "Ping: 12ms"
    buff: string; // "Drink water to increase"
}

export interface RPGProfile {
    className: string; // "Level 34 Overthinker"
    quest: string; // "The Quest for Serotonin"
    stats: Record<string, RPGStat>; // Keyed by processId (present-moment, etc)
}

export interface DinnerGuest {
    role: string; // "The Drunk Uncle" (Acceptance)
    name: string;
    action: string; // "Spilling wine on the carpet."
    quote: string; // "It's tie-dye now."
}

export interface DinnerScenario {
    hostMood: string;
    guests: Record<string, DinnerGuest>; // Keyed by processId
}

export interface PopUpAd {
    headline: string; // "HOT ANXIETY IN YOUR AREA!"
    body: string; // "Meet local panic attacks tonight."
    buttonText: string; // "Skip Ad"
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface Translations {
    title: string;
    subtitle: string;
    instructions: string;
    defusionLab: string;
    defusionLabSubtitle: string;
    mindfulnessStudio: string;
    mindfulnessSubtitle: string;
    recoveryCompass: string;
    recoverySubtitle: string;
    alcoholSupport: string;
    alcoholBubbleDescription: string;
    synergyBridge: string;
    synergyTip: string;
    close: string;
    loading: string;
    waitingThought: string;
    inputPlaceholder: string;
    contextPlaceholder: string;
    reflectionPlaceholder: string;
    tryThis: string;
    microHabits: string;
    reflect: string;
    back: string;
    startOver: string;
    music: string;
    nextTrack: string;
    
    // Hexagon
    centerLine1: string;
    centerLine2: string;
    breathePrompt: string;
    stopBreathe: string;
    longPressHint: string;

    // Daily Prompt
    dailyCueTitle: string;
    dailyCuePlaceholder: string;

    // Concept Boxes
    conceptActTitle: string;
    conceptActContent: string;
    conceptHexagonTitle: string;
    conceptHexagonContent: string;

    // Detail Panel
    perspective: string;
    thePrism: string;
    prismIntro: string; 

    // Synergy Panel
    processA: string;
    processB: string;

    // Defusion Lab
    defusionIntro: string;
    defusionAnalyze: string;
    defusionExperiment: string;
    defusionRelease: string;
    defusionReframeHeader: string;
    defusionTechniquesHeader: string;
    defusionFinalStep: string;
    defusionRestart: string;

    // Recovery Compass
    recoveryIntro: string;
    recoveryInputUrge: string;
    recoveryInputFeeling: string;
    recoveryAnalyze: string;
    recoveryTheLoop: string;
    recoveryThePivot: string;
    recoveryAction: string;

    // Alcohol Support
    alcoholIntro: string;
    alcoholTabExercises: string;
    alcoholTabScript: string;
    alcoholGenerateExercises: string;
    alcoholGenerateScript: string;

    // Mindfulness Studio
    mindfulnessIntro: string;
    mindfulnessGoal: string;
    mindfulnessInputLabel: string;
    mindfulnessPlaceholder: string;
    mindfulnessTags: {
        stress: string;
        focus: string;
        sleep: string;
        anxiety: string;
    };
    startSession: string;
    beginPractice: string;
    stopSession: string;
    listen: string;
    technique: string;
    scienceBehind: string;

    // Reference Library
    libraryTitle: string;
    librarySubtitle: string;
    sectionOrgs: string;
    sectionBooks: string;
    sectionResearch: string;

    // Guide
    guideTitle: string;
    guideExplore: string;
    guideExploreDesc: string;
    guideSynergy: string;
    guideSynergyDesc: string;

    // Study Guide
    studyTitle: string;
    studySubtitle: string;
    studyIntro: string;
    studyStart: string;
    studyAnswerPlaceholder: string;
    studySubmit: string;
    studyNext: string;
    studyFeedbackTitle: string;

    // Games Main
    gamesTitle: string;
    gamesSubtitle: string;
    
    // Game Titles & Desc
    gameIkeaTitle: string;
    gameIkeaDesc: string;
    gameTwisterTitle: string;
    gameTwisterDesc: string;
    gameRPGTitle: string;
    gameRPGDesc: string;
    gameDinnerTitle: string;
    gameDinnerDesc: string;
    gameAdsTitle: string;
    gameAdsDesc: string;

    // Game Specific UI
    gamePlay: string;
    gameAssemble: string;
    gameSpin: string;
    gameRoll: string;
    gameSeatGuests: string;
    gameGenerate: string;
    gameSkipAd: string;
    gameNextStep: string;
    gamePrevStep: string;
    gameFinish: string;
    gameTryAgain: string;
    gameReroll: string;
    gameRound: string;
    gameStreak: string;
    
    // Game Inputs/Labels
    ikeaProblemPlaceholder: string;
    ikeaIntroTitle: string;
    ikeaIntroDesc: string;
    
    twisterIntroTitle: string;
    twisterIntroDesc: string;
    twisterSpinning: string;
    twisterCollapsed: string;
    twisterHeld: string;
    twisterOuch: string;
    
    rpgIntroTitle: string;
    rpgRoleLabel: string;
    rpgRolePlaceholder: string;
    rpgBossLabel: string;
    rpgBossPlaceholder: string;
    
    dinnerIntroTitle: string;
    dinnerIntroDesc: string;
    dinnerInputPlaceholder: string;
    dinnerHostMood: string;
    
    adIntroTitle: string;
    adIntroDesc: string;
    adInputPlaceholder: string;
    adButtonLoading: string;

    tabs: {
        essence: string;
        personalize: string;
        action: string;
        reflect: string;
    }
}
