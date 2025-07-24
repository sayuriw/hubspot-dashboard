export interface DataEntry {
  companySize: string;
  industry: string;
  quarter: string;
  responseValue: string;
  numResponses: number;
}

export interface Question {
  questionId: string;
  questionNumber: number;
  question: string;
  questionType: string;
  description: string;
  data: DataEntry[];
}

export interface HubSpotData {
  metadata: {
    title: string;
    description: string;
  };
  uniqueValues: {
    companySize: string[];
    industry: string[];
    quarter: string[];
  };
  questions: Question[];
} 