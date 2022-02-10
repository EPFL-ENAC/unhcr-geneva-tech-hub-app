export enum ShelterFormType {
  RadioGroup = 0,
  checkboxGroup = 1,
}
export default interface ShelterForm {
  title: string;
  type: ShelterFormType;
  inputs: ShelterFormInput[];
  _id: string; // unique
}

export interface ShelterFormInput {
  description?: string;
  label: string;
  score: number;
  _id: string; // unique
}
