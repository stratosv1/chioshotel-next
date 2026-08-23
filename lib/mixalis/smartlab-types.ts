export type SmartLabImportance = "core" | "supporting" | "advanced";

export type SmartLabScopeRelation =
  | "official_core"
  | "within_official_scope"
  | "exercise_extension"
  | "boundary_only"
  | "unclassified_depth";

export type SmartLabPhysicsPreset =
  | "horizontal_projectile"
  | "uniform_circular_motion"
  | "centripetal_force"
  | "generic_relation";

export type SmartLabControlRole =
  | "initial_speed"
  | "height"
  | "gravity"
  | "radius"
  | "angular_speed"
  | "linear_speed"
  | "mass"
  | "frequency"
  | "generic";

export type SmartLabControl = {
  id: string;
  role: SmartLabControlRole;
  type: "slider" | "toggle";
  label: string;
  symbol: string;
  min: number;
  max: number;
  defaultValue: number;
  step: number;
  unit: string;
};

export type SmartLabWidget = {
  id: string;
  subchapterId: string;
  title: string;
  concept: string;
  importance: SmartLabImportance;
  scopeRelation: SmartLabScopeRelation;
  smartEntryIds: string[];
  sourceItemIds: string[];
  physicsPreset: SmartLabPhysicsPreset;
  scene: {
    dimension: "2d" | "3d";
    description: string;
  };
  question: string;
  prediction: string;
  controls: SmartLabControl[];
  liveFeedback: string;
  discovery: string;
  equation: string;
  challenge: {
    instruction: string;
    successHint: string;
  };
  transferCheck: string;
  targetInsight: string;
  implementationNotes: string[];
};

export type SmartLabSubchapter = {
  subchapterId: string;
  subchapterLabel: string;
  subchapterTitle: string;
  intelligenceVersionId: string;
  widgets: SmartLabWidget[];
};

export type SmartLabContent = {
  title: string;
  summary: string;
  subchapters: SmartLabSubchapter[];
  chapterSynthesisWidgets: SmartLabWidget[];
  nonInteractiveCore: Array<{
    smartEntryId: string;
    reason: string;
  }>;
  coverage: {
    totalCoreEntries: number;
    interactiveCoreEntries: number;
    nonInteractiveCoreEntries: number;
  };
};

export type SmartLabRevisionView = {
  id: string;
  courseId: string;
  courseTitle: string;
  chapterId: string;
  chapterNumberLabel: string | null;
  chapterTitle: string;
  revisionNumber: number;
  status: "draft" | "processing" | "current" | "superseded" | "error";
  model: string;
  promptReference: string;
  promptVersion: string;
  inputSnapshotHash: string;
  smartVersions: Array<{
    subchapterId: string;
    intelligenceVersionId: string;
    versionNumber: number;
  }>;
  content: SmartLabContent | { state?: string };
  errorMessage: string | null;
  updatedAt: string;
  completedAt: string | null;
};
