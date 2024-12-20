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
      expenses: {
        Row: {
          amount: number
          archived: boolean
          archived_at: string | null
          category: string
          created_at: string | null
          description: string
          id: string
          notes: string | null
          quarter_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          archived?: boolean
          archived_at?: string | null
          category: string
          created_at?: string | null
          description: string
          id?: string
          notes?: string | null
          quarter_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          archived?: boolean
          archived_at?: string | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          notes?: string | null
          quarter_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_quarter_fk"
            columns: ["user_id", "quarter_id"]
            isOneToOne: false
            referencedRelation: "quarterly_estimates"
            referencedColumns: ["user_id", "quarter"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          last_trial_used: string | null
          login_count: number | null
          subscription_expiry: string | null
          subscription_type: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          last_trial_used?: string | null
          login_count?: number | null
          subscription_expiry?: string | null
          subscription_type?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          last_trial_used?: string | null
          login_count?: number | null
          subscription_expiry?: string | null
          subscription_type?: string | null
        }
        Relationships: []
      }
      quarterly_estimates: {
        Row: {
          archive_expires_at: string | null
          archived: boolean
          archived_at: string | null
          can_unarchive: boolean | null
          manual_unarchive_count: number | null
          paid_at: string | null
          quarter: string
          total_expenses: number | null
          total_federal_tax: number | null
          total_income: number | null
          total_self_employment_tax: number | null
          total_state_tax: number | null
          total_tax: number | null
          user_id: string
        }
        Insert: {
          archive_expires_at?: string | null
          archived?: boolean
          archived_at?: string | null
          can_unarchive?: boolean | null
          manual_unarchive_count?: number | null
          paid_at?: string | null
          quarter: string
          total_expenses?: number | null
          total_federal_tax?: number | null
          total_income?: number | null
          total_self_employment_tax?: number | null
          total_state_tax?: number | null
          total_tax?: number | null
          user_id: string
        }
        Update: {
          archive_expires_at?: string | null
          archived?: boolean
          archived_at?: string | null
          can_unarchive?: boolean | null
          manual_unarchive_count?: number | null
          paid_at?: string | null
          quarter?: string
          total_expenses?: number | null
          total_federal_tax?: number | null
          total_income?: number | null
          total_self_employment_tax?: number | null
          total_state_tax?: number | null
          total_tax?: number | null
          user_id?: string
        }
        Relationships: []
      }
      tax_calculations: {
        Row: {
          archived: boolean
          archived_at: string | null
          created_at: string | null
          federal_tax: number | null
          id: string
          income: number | null
          invoice_name: string | null
          notes: string | null
          quarter_id: string | null
          self_employment_tax: number | null
          state_tax: number | null
          user_id: string
        }
        Insert: {
          archived?: boolean
          archived_at?: string | null
          created_at?: string | null
          federal_tax?: number | null
          id?: string
          income?: number | null
          invoice_name?: string | null
          notes?: string | null
          quarter_id?: string | null
          self_employment_tax?: number | null
          state_tax?: number | null
          user_id?: string
        }
        Update: {
          archived?: boolean
          archived_at?: string | null
          created_at?: string | null
          federal_tax?: number | null
          id?: string
          income?: number | null
          invoice_name?: string | null
          notes?: string | null
          quarter_id?: string | null
          self_employment_tax?: number | null
          state_tax?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_calculations_quarter_fk"
            columns: ["user_id", "quarter_id"]
            isOneToOne: false
            referencedRelation: "quarterly_estimates"
            referencedColumns: ["user_id", "quarter"]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
