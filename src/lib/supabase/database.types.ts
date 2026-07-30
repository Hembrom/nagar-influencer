export type Database = {
  public: {
    Tables: {
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
