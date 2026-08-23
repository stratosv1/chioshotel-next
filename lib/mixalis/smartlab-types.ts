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

export type SmartLabQuantityRole =
  | "controllable"
  | "time_state"
  | "derived"
  | "fixed"
  | "model_assumption";

export type SmartLabQuantityPhysicsRole =
  | "initial_speed"
  | "height"
  | "gravity"
  | "time"
  | "horizontal_position"
  | "vertical_displacement"
  | "horizontal_velocity"
  | "vertical_velocity"
  | "speed"
  | "velocity_angle"
  | "range"
  | "radius"
  | "arc_length"
  | "angular_displacement"
  | "revolution_count"
  | "angular_speed"
  | "linear_speed"
  | "frequency"
  | "period"
  | "centripetal_acceleration"
  | "centripetal_force"
  | "mass"
  | "generic";

export type SmartLabVisualRepresentation =
  | "vertical_distance"
  | "horizontal_distance"
  | "displacement_vector"
  | "velocity_vector"
  | "vector_component"
  | "acceleration_vector"
  | "force_vector"
  | "radius"
  | "angle"
  | "arc"
  | "trajectory"
  | "position"
  | "scalar_measurement"
  | "time_state"
  | "none";

export type SmartLabQuantity = {
  id: string;
  physicsRole: SmartLabQuantityPhysicsRole;
  name: string;
  symbol: string;
  unit: string;
  meaning: string;
  whyItMatters: string;
  role: SmartLabQuantityRole;
  dependsOn: string[];
  affects: string[];
  visualRepresentation: SmartLabVisualRepresentation;
  sourceItemIds: string[];
};

export type SmartLabControl = {
  id: string;
  quantityId: string;
  role: SmartLabControlRole;
  type: "slider" | "toggle";
  label: string;
  symbol: string;
  min: number;
  max: number;
  defaultValue: number;
  step: number;
  unit: string;
  invariants: string[];
  affects: string[];
};

export type SmartLabImpactRule = {
  controlQuantityId: string;
  changes: string[];
  unchanged: string[];
  explanation: string;
};

export type SmartLabWidget = {
  id: string;
  subchapterId: string;
  title: string;
  concept: string;
  physicsPreset: SmartLabPhysicsPreset;
  scene: {
    description: string;
  };
  quantities: SmartLabQuantity[];
  controls: SmartLabControl[];
  diagram: {
    description: string;
    representedQuantityIds: string[];
  };
  liveMeasurements: string[];
  impactModel: SmartLabImpactRule[];

  // Legacy fields remain optional so older saved revisions can still be read safely.
  importance?: "core" | "supporting" | "advanced";
  scopeRelation?: "official_core" | "within_official_scope" | "exercise_extension" | "boundary_only" | "unclassified_depth";
  smartEntryIds?: string[];
  sourceItemIds?: string[];
  question?: string;
  prediction?: string;
  parameterAudit?: Array<{
    controlQuantityId: string;
    testedValues: number[];
    verifies: string[];
    result: "passed";
  }>;
  liveFeedback?: string;
  discovery?: string;
  equation?: string;
  challenge?: { instruction: string; successHint: string };
  transferCheck?: string;
  targetInsight?: string;
  implementationNotes?: string[];
};

export type SmartLabSubchapter = {
  subchapterId: string;
  subchapterLabel: string;
  subchapterTitle: string;
  lessonRevisionId: string;
  lessonRevisionNumber: number;
  widgets: SmartLabWidget[];
  intelligenceVersionId?: string;
};

export type SmartLabContent = {
  title: string;
  summary: string;
  subchapters: SmartLabSubchapter[];
  coverage: {
    totalQuantities: number;
    representedQuantities: number;
    controllableQuantities: number;
  };
  chapterSynthesisWidgets?: SmartLabWidget[];
  nonInteractiveCore?: Array<{ smartEntryId: string; reason: string }>;
};

export type SmartLabLessonVersion = {
  subchapterId: string;
  subchapterLabel: string;
  subchapterTitle: string;
  lessonRevisionId: string;
  revisionNumber: number;
  quantityCount: number;
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
  lessonVersions: SmartLabLessonVersion[];
  content: SmartLabContent | { state?: string };
  errorMessage: string | null;
  updatedAt: string;
  completedAt: string | null;
};
