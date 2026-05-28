// Lead status enum matching Supabase
export type LeadStatus = "new" | "contacted" | "purchased" | "lost";

// Location options (can be "indianapolis", "florida", or any custom string)
export type Location = "indianapolis" | "florida" | string;

// Pixel / notification category derived from shirt type (CLAUDE.md §5).
// `both` is reserved for Phase 3 multi-bucket selection.
export type LeadCategory = "harley" | "concert" | "both" | "other";

// Quiz response structure
export type ShirtType = "harley" | "classic_rock" | "90s_band" | "other";

export interface QuizResponses {
  shirtType: ShirtType[]; // Multi-select — sellers often have more than one kind
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
  note?: string; // Optional trust/explanatory note shown under the question
  options: {
    value: string;
    label: string;
    description?: string;
  }[];
}

// Database insert type (without id and created_at)
export type LeadInsert = Omit<Lead, "id" | "created_at">;

// Request body posted from the contact form to /api/leads
export interface LeadSubmissionPayload {
  fullName: string;
  phoneNumber: string;
  location: Location;
  quizResponses: QuizResponses;
  images?: string[];
  userComments?: string;
}

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
