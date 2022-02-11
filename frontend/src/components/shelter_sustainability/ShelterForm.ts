export enum ShelterFormType {
  radioGroup = 0,
  checkboxGroup = 1,
  formGroup = 2,
}
export default interface ShelterForm {
  title: string;
  type: ShelterFormType;
  inputs?: ShelterFormInput[];
  children?: ShelterForm[];
  _id: string; // unique
}

export interface ShelterFormInput {
  description?: string;
  label: string;
  score: number;
  _id: string; // unique
}

// export type ShelterFormInputs = ShelterFormInput[] | ShelterForm[];