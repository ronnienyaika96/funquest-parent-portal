export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_roles: {
        Row: {
          created_at: string
          id: string
          permissions: Json | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permissions?: Json | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permissions?: Json | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      child_profiles: {
        Row: {
          age_range: string | null
          avatar: string | null
          created_at: string
          id: string
          interests: string[] | null
          name: string
          parent_id: string
          school: string | null
          updated_at: string
        }
        Insert: {
          age_range?: string | null
          avatar?: string | null
          created_at?: string
          id?: string
          interests?: string[] | null
          name: string
          parent_id: string
          school?: string | null
          updated_at?: string
        }
        Update: {
          age_range?: string | null
          avatar?: string | null
          created_at?: string
          id?: string
          interests?: string[] | null
          name?: string
          parent_id?: string
          school?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      content_uploads: {
        Row: {
          age_range: string
          category: string
          created_at: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          metadata: Json | null
          name: string
          status: string | null
          tags: string[] | null
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          age_range: string
          category: string
          created_at?: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          metadata?: Json | null
          name: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          age_range?: string
          category?: string
          created_at?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          metadata?: Json | null
          name?: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          age_range: string
          analytics_data: Json | null
          category: string
          created_at: string
          created_by: string
          description: string | null
          file_path: string | null
          id: string
          name: string
          settings: Json | null
          status: string | null
          thumbnail_path: string | null
          updated_at: string
        }
        Insert: {
          age_range: string
          analytics_data?: Json | null
          category: string
          created_at?: string
          created_by: string
          description?: string | null
          file_path?: string | null
          id?: string
          name: string
          settings?: Json | null
          status?: string | null
          thumbnail_path?: string | null
          updated_at?: string
        }
        Update: {
          age_range?: string
          analytics_data?: Json | null
          category?: string
          created_at?: string
          created_by?: string
          description?: string | null
          file_path?: string | null
          id?: string
          name?: string
          settings?: Json | null
          status?: string | null
          thumbnail_path?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          metadata: Json | null
          status: string | null
          subscribed_at: string
          tags: string[] | null
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          metadata?: Json | null
          status?: string | null
          subscribed_at?: string
          tags?: string[] | null
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          metadata?: Json | null
          status?: string | null
          subscribed_at?: string
          tags?: string[] | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      printables: {
        Row: {
          age_range: string | null
          category: string
          created_at: string
          description: string | null
          difficulty: string
          downloads: number
          featured: boolean
          file_url: string
          id: string
          pages: number
          preview_url: string | null
          rating: number
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          age_range?: string | null
          category: string
          created_at?: string
          description?: string | null
          difficulty?: string
          downloads?: number
          featured?: boolean
          file_url: string
          id?: string
          pages?: number
          preview_url?: string | null
          rating?: number
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          age_range?: string | null
          category?: string
          created_at?: string
          description?: string | null
          difficulty?: string
          downloads?: number
          featured?: boolean
          file_url?: string
          id?: string
          pages?: number
          preview_url?: string | null
          rating?: number
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          grade: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          grade?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          grade?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tracing_progress: {
        Row: {
          attempts: number
          completed: boolean
          created_at: string
          id: string
          last_traced: string
          letter: string
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number
          completed?: boolean
          created_at?: string
          id?: string
          last_traced?: string
          letter: string
          score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number
          completed?: boolean
          created_at?: string
          id?: string
          last_traced?: string
          letter?: string
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      woocommerce_customers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          metadata: Json | null
          user_id: string | null
          woo_customer_id: number
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
          woo_customer_id: number
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
          woo_customer_id?: number
        }
        Relationships: []
      }
      woocommerce_orders: {
        Row: {
          created_at: string | null
          currency: string | null
          id: string
          line_items: Json | null
          metadata: Json | null
          status: string | null
          total: number | null
          user_id: string | null
          woo_customer_id: number | null
          woo_order_id: number
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          id?: string
          line_items?: Json | null
          metadata?: Json | null
          status?: string | null
          total?: number | null
          user_id?: string | null
          woo_customer_id?: number | null
          woo_order_id: number
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          id?: string
          line_items?: Json | null
          metadata?: Json | null
          status?: string | null
          total?: number | null
          user_id?: string | null
          woo_customer_id?: number | null
          woo_order_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "woocommerce_orders_woo_customer_id_fkey"
            columns: ["woo_customer_id"]
            isOneToOne: false
            referencedRelation: "woocommerce_customers"
            referencedColumns: ["woo_customer_id"]
          },
        ]
      }
      woocommerce_products: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          name: string
          price: number | null
          woo_product_id: number
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          price?: number | null
          woo_product_id: number
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          price?: number | null
          woo_product_id?: number
        }
        Relationships: []
      }
      woocommerce_subscription_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string | null
          id: string
          subscription_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string | null
          id?: string
          subscription_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string | null
          id?: string
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "woocommerce_subscription_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "woocommerce_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      woocommerce_subscriptions: {
        Row: {
          created_at: string | null
          customer_id: string | null
          end_date: string | null
          id: string
          next_payment_date: string | null
          product_id: string | null
          start_date: string | null
          status: string | null
          wc_subscription_id: number
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          end_date?: string | null
          id?: string
          next_payment_date?: string | null
          product_id?: string | null
          start_date?: string | null
          status?: string | null
          wc_subscription_id: number
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          end_date?: string | null
          id?: string
          next_payment_date?: string | null
          product_id?: string | null
          start_date?: string | null
          status?: string | null
          wc_subscription_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "woocommerce_subscriptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "woocommerce_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "woocommerce_subscriptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "woocommerce_products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
