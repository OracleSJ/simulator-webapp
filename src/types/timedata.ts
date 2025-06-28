export interface Option {
  value: string;
  label: string;
}

export type ProgressStep = 1 | 2 | 3 | 4;

export interface StepInfo {
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}
