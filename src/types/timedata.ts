export interface Option {
  value: string;
  label: string;
}

export type CurrentStep = 1 | 2 | 3;

export interface StepInfo {
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}
