export interface ProjectDocument {
  name: string;
  users: string[];
  modules: {
    general?: GeneralModule;
  };
}

export interface TemplateDocument {
  name: string;
  modules: {
    general?: GeneralModule;
  };
}

export interface GeneralModule {
  year: number;
  name: string;
  locationLatitude: number;
  locationLongitude: number;
  temporary: boolean;
  expirationYear?: number;
  integration?: "well" | "moderately" | "badly";
  electricityCompanyName: string;
  publicGridConnection: boolean;
  publicGridDomesticRate?: number;
  publicGridDistance?: number;
  networkExtension?: boolean;

  currency: string;
}
