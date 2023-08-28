export enum ShelterFormType {
  radioGroup = 0,
  checkboxGroup = 1,
  formGroup = 2,
}
export interface ShelterForm {
  title: string;
  type: ShelterFormType;
  children: ShelterFormChild[];
  nonApplicable?: boolean;
  disabled?: boolean;
  _id: string;
}
export interface ShelterFormInput {
  description?: string;
  nonApplicable?: boolean;
  label: string;
  score: number;
  imagePath?: string;
  _id: string;
}

export type ShelterFormChild = ShelterFormInput | ShelterForm;
