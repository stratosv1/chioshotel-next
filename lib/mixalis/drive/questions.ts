// Question bank for /mixalis/drive (θεωρία διπλώματος).
// Extracted from the official Ministry questionnaire ("Θεωρητική εκπαίδευση
// υποψηφίων οδηγών", Ερωτηματολόγιο), with the answers as marked (Σ/Λ) in the book.
// Ids are "p<pdf page>-<number>" and must stay stable: practice statistics on
// the phone are stored per id. Pictures live in /public/mixalis/drive.
import bank from "./questions.json";

export type DriveQuestion = {
  /** Stable id, e.g. "p241-16". Never reuse or renumber. */
  id: string;
  /** Question number as printed in the booklet. */
  ref?: string;
  /** Chapter of the questionnaire, e.g. "Σήμανση". */
  category?: string;
  text: string;
  /** Optional picture, e.g. "/mixalis/drive/p241-13.webp". */
  image?: string;
  options: string[];
  /** When the answers are pictures: one image per option. */
  optionImages?: string[];
  /** Index(es) of the correct option(s), 0-based. */
  correct: number[];
  /** Short note shown after answering. */
  explanation?: string;
};

export const DRIVE_QUESTIONS: DriveQuestion[] = bank as DriveQuestion[];
