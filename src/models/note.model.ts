import { Evidence } from './evidence.model';

export interface Note {
  evaluation_id: string
  evaluator_id: string
  people_id: string
  evidence_id: string
  note: number | null
  evidenceId: Evidence
}
