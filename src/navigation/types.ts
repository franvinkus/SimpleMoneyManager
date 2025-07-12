export type RootStackParamList = {
  Splash: undefined; 
  Home: undefined;   
  Camera: undefined;
  Preview: {photoPath: string},
  OCR: {photoPath: string},
  SCANRESULT: { 
    rawOcrText: string; 
    extractedDate: string;
    extractedTotal: string;
    extractedItems: ItemDetail[];
  };
};

export type ItemDetail = {
  name: string;
  quantity?: number; 
  unitPrice?: number; 
  totalItemPrice?: number; 
  rawLine: string;
};