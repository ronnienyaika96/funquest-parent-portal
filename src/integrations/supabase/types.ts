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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          age_max: number | null
          age_min: number | null
          created_at: string | null
          id: string
          is_published: boolean | null
          title: string
          type: string
          value: string | null
        }
        Insert: {
          age_max?: number | null
          age_min?: number | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          title: string
          type: string
          value?: string | null
        }
        Update: {
          age_max?: number | null
          age_min?: number | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          title?: string
          type?: string
          value?: string | null
        }
        Relationships: []
      }
      activity_steps: {
        Row: {
          activity_id: string | null
          created_at: string | null
          data: Json
          game_type: string
          id: string
          instruction_audio_url: string | null
          step_order: number
        }
        Insert: {
          activity_id?: string | null
          created_at?: string | null
          data: Json
          game_type: string
          id?: string
          instruction_audio_url?: string | null
          step_order: number
        }
        Update: {
          activity_id?: string | null
          created_at?: string | null
          data?: Json
          game_type?: string
          id?: string
          instruction_audio_url?: string | null
          step_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "activity_steps_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      admins: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          condition: Json
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          condition: Json
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          condition?: Json
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      child_badges: {
        Row: {
          badge_id: string | null
          child_id: string | null
          earned_at: string | null
          id: string
        }
        Insert: {
          badge_id?: string | null
          child_id?: string | null
          earned_at?: string | null
          id?: string
        }
        Update: {
          badge_id?: string | null
          child_id?: string | null
          earned_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_badges_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      child_profiles: {
        Row: {
          age: number
          avatar: string | null
          created_at: string | null
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          age: number
          avatar?: string | null
          created_at?: string | null
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          age?: number
          avatar?: string | null
          created_at?: string | null
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "child_profiles_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      progress: {
        Row: {
          activity_id: string | null
          child_id: string | null
          completed: boolean | null
          id: string
          stars_earned: number | null
          time_spent_seconds: number | null
          updated_at: string | null
        }
        Insert: {
          activity_id?: string | null
          child_id?: string | null
          completed?: boolean | null
          id?: string
          stars_earned?: number | null
          time_spent_seconds?: number | null
          updated_at?: string | null
        }
        Update: {
          activity_id?: string | null
          child_id?: string | null
          completed?: boolean | null
          id?: string
          stars_earned?: number | null
          time_spent_seconds?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          expires_at: string | null
          id: string
          plan: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          expires_at?: string | null
          id?: string
          plan?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          expires_at?: string | null
          id?: string
          plan?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
