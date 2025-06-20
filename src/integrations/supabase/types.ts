export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      creators: {
        Row: {
          about: string | null
          avatar: string | null
          cover: string | null
          cover_subtitle: string | null
          cover_title: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          pix_key: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          about?: string | null
          avatar?: string | null
          cover?: string | null
          cover_subtitle?: string | null
          cover_title?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          pix_key?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          about?: string | null
          avatar?: string | null
          cover?: string | null
          cover_subtitle?: string | null
          cover_title?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          pix_key?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          access_token: string | null
          amount: number
          created_at: string | null
          creator_id: string | null
          expires_at: string | null
          fan_username: string
          id: string
          message: string | null
          package_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          access_token?: string | null
          amount: number
          created_at?: string | null
          creator_id?: string | null
          expires_at?: string | null
          fan_username: string
          id?: string
          message?: string | null
          package_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string | null
          amount?: number
          created_at?: string | null
          creator_id?: string | null
          expires_at?: string | null
          fan_username?: string
          id?: string
          message?: string | null
          package_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      package_features: {
        Row: {
          created_at: string | null
          feature: string
          id: string
          package_id: string | null
        }
        Insert: {
          created_at?: string | null
          feature: string
          id?: string
          package_id?: string | null
        }
        Update: {
          created_at?: string | null
          feature?: string
          id?: string
          package_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "package_features_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      package_media: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          is_preview: boolean | null
          package_id: string | null
          type: string
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          is_preview?: boolean | null
          package_id?: string | null
          type: string
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          is_preview?: boolean | null
          package_id?: string | null
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_media_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string | null
          creator_id: string | null
          highlighted: boolean | null
          id: string
          is_hidden: boolean | null
          price: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          highlighted?: boolean | null
          id?: string
          is_hidden?: boolean | null
          price: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          highlighted?: boolean | null
          id?: string
          is_hidden?: boolean | null
          price?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "packages_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_content: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          reward_id: string | null
          type: string
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          reward_id?: string | null
          type: string
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          reward_id?: string | null
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_content_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          access_token: string
          created_at: string | null
          expire_at: string
          id: string
          message: string | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expire_at: string
          id?: string
          message?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expire_at?: string
          id?: string
          message?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rewards_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          created_at: string | null
          creator_id: string | null
          id: string
          type: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          id?: string
          type: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          id?: string
          type?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_links_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          buyer_alias: string
          buyer_email: string | null
          buyer_id: string | null
          buyer_whatsapp: string | null
          created_at: string | null
          creator_amount: number
          creator_id: string | null
          id: string
          package_id: string | null
          platform_fee: number
          reward_id: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          buyer_alias: string
          buyer_email?: string | null
          buyer_id?: string | null
          buyer_whatsapp?: string | null
          created_at?: string | null
          creator_amount: number
          creator_id?: string | null
          id?: string
          package_id?: string | null
          platform_fee: number
          reward_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          buyer_alias?: string
          buyer_email?: string | null
          buyer_id?: string | null
          buyer_whatsapp?: string | null
          created_at?: string | null
          creator_amount?: number
          creator_id?: string | null
          id?: string
          package_id?: string | null
          platform_fee?: number
          reward_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number
          completed_date: string | null
          created_at: string | null
          creator_id: string | null
          id: string
          pix_key: string
          request_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          completed_date?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          pix_key: string
          request_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          completed_date?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          pix_key?: string
          request_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
