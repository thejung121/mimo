
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      creators: {
        Row: {
          id: string
          username: string
          name: string
          avatar: string
          cover: string
          description: string
          cover_title: string | null
          cover_subtitle: string | null
          about: string | null
          pix_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          name: string
          avatar: string
          cover: string
          description: string
          cover_title?: string | null
          cover_subtitle?: string | null
          about?: string | null
          pix_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          name?: string
          avatar?: string
          cover?: string
          description?: string
          cover_title?: string | null
          cover_subtitle?: string | null
          about?: string | null
          pix_key?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      mimo_packages: {
        Row: {
          id: string
          creator_id: string
          title: string
          price: number
          highlighted: boolean
          is_hidden: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          title: string
          price: number
          highlighted?: boolean
          is_hidden?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          title?: string
          price?: number
          highlighted?: boolean
          is_hidden?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      package_features: {
        Row: {
          id: string
          package_id: string
          feature: string
          created_at: string
        }
        Insert: {
          id?: string
          package_id: string
          feature: string
          created_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          feature?: string
          created_at?: string
        }
      }
      package_media: {
        Row: {
          id: string
          package_id: string
          type: string
          url: string
          caption: string | null
          is_preview: boolean
          created_at: string
        }
        Insert: {
          id?: string
          package_id: string
          type: string
          url: string
          caption?: string | null
          is_preview?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          type?: string
          url?: string
          caption?: string | null
          is_preview?: boolean
          created_at?: string
        }
      }
      reward_content: {
        Row: {
          id: string
          reward_id: string
          type: string
          url: string
          caption: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reward_id: string
          type: string
          url: string
          caption?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reward_id?: string
          type?: string
          url?: string
          caption?: string | null
          created_at?: string
        }
      }
      rewards: {
        Row: {
          id: string
          transaction_id: string
          message: string | null
          access_token: string
          expire_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          message?: string | null
          access_token: string
          expire_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          transaction_id?: string
          message?: string | null
          access_token?: string
          expire_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      social_links: {
        Row: {
          id: string
          creator_id: string
          type: string
          url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          type: string
          url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          type?: string
          url?: string
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          buyer_id: string | null
          creator_id: string
          package_id: string
          buyer_alias: string
          buyer_email: string | null
          buyer_whatsapp: string | null
          amount: number
          platform_fee: number
          creator_amount: number
          status: string
          stripe_session_id: string | null
          stripe_payment_intent_id: string | null
          reward_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          buyer_id?: string | null
          creator_id: string
          package_id: string
          buyer_alias: string
          buyer_email?: string | null
          buyer_whatsapp?: string | null
          amount: number
          platform_fee: number
          creator_amount: number
          status: string
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          reward_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          buyer_id?: string | null
          creator_id?: string
          package_id?: string
          buyer_alias?: string
          buyer_email?: string | null
          buyer_whatsapp?: string | null
          amount?: number
          platform_fee?: number
          creator_amount?: number
          status?: string
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          reward_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          username: string
          display_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      withdrawals: {
        Row: {
          id: string
          creator_id: string
          amount: number
          status: string
          pix_key: string
          request_date: string
          completed_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          amount: number
          status: string
          pix_key: string
          request_date?: string
          completed_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          amount?: number
          status?: string
          pix_key?: string
          request_date?: string
          completed_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
