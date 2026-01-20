// Lead status enum matching Supabase
export type LeadStatus = "new" | "contacted" | "purchased" | "lost";

// Location options (can be "indianapolis", "florida", or any custom string)
export type Location = "indianapolis" | "florida" | string;

// Quiz response structure
export interface QuizResponses {
  shirtType: "harley" | "classic_rock" | "90s_band" | "other";
  decades: ("70s" | "80s" | "90s")[]; // Multi-select
  volume: "10_or_less" | "20_to_50" | "50_plus";
  condition: "great" | "faded" | "holes";
}

// Lead record from database
export interface Lead {
  id: string;
  created_at: string;
  full_name: string;
  phone_number: string;
  location: Location;
  quiz_responses: QuizResponses;
  images: string[];
  status: LeadStatus;
  user_comments?: string;
  admin_notes?: string;
}

// Form data for lead submission
export interface LeadFormData {
  fullName: string;
  phoneNumber: string;
  location: Location;
  quizResponses: QuizResponses;
  userComments?: string;
}

// Quiz step configuration
export interface QuizStepConfig {
  id: number;
  question: string;
  field: keyof QuizResponses;
  multiSelect?: boolean;
  options: {
    value: string;
    label: string;
    description?: string;
  }[];
}

// Database insert type (without id and created_at)
export type LeadInsert = Omit<Lead, "id" | "created_at">;

// Hall of Fame / Recent Buy type
export interface RecentBuy {
  id: string;
  created_at: string;
  item_name: string;
  description: string;
  price_paid: number;
  image_url: string;
  technical_details: {
    tag?: string;
    stitch?: string;
    era?: string;
    condition?: string;
  };
}

export type RecentBuyInsert = Omit<RecentBuy, "id" | "created_at">;
