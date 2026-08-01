export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          mobile: string | null;
          linkedin_url: string | null;
          company_name: string | null;
          website: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          mobile?: string | null;
          linkedin_url?: string | null;
          company_name?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          mobile?: string | null;
          linkedin_url?: string | null;
          company_name?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          order_id: string;
          format_id: string;
          package_name: string;
          token_amount: number;
          payment_method: "upi" | "card";
          status:
            | "order_placed"
            | "representative_assigned"
            | "campaign_finalized"
            | "campaign_live"
            | "cancelled"
            | "refunded";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          format_id: string;
          package_name: string;
          token_amount?: number;
          payment_method: "upi" | "card";
          status?: Database["public"]["Tables"]["bookings"]["Row"]["status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          format_id?: string;
          package_name?: string;
          token_amount?: number;
          payment_method?: "upi" | "card";
          status?: Database["public"]["Tables"]["bookings"]["Row"]["status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          payment_ref: string;
          order_id: string;
          amount: number;
          currency: string;
          method: "upi" | "card";
          status: "pending" | "success" | "failed" | "refunded";
          provider: "dummy" | "razorpay";
          provider_payment_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          payment_ref: string;
          order_id: string;
          amount?: number;
          currency?: string;
          method: "upi" | "card";
          status?: Database["public"]["Tables"]["payments"]["Row"]["status"];
          provider?: Database["public"]["Tables"]["payments"]["Row"]["provider"];
          provider_payment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          payment_ref?: string;
          order_id?: string;
          amount?: number;
          currency?: string;
          method?: "upi" | "card";
          status?: Database["public"]["Tables"]["payments"]["Row"]["status"];
          provider?: Database["public"]["Tables"]["payments"]["Row"]["provider"];
          provider_payment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["order_id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
