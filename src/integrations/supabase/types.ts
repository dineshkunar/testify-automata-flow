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
      integration_syncs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          integration_id: string
          started_at: string
          sync_data: Json | null
          sync_status: string
          synced_items: number | null
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          integration_id: string
          started_at?: string
          sync_data?: Json | null
          sync_status?: string
          synced_items?: number | null
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          integration_id?: string
          started_at?: string
          sync_data?: Json | null
          sync_status?: string
          synced_items?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_syncs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          api_key_encrypted: string | null
          configuration: Json
          created_at: string
          id: string
          name: string
          provider: string
          status: string
          type: string
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          api_key_encrypted?: string | null
          configuration?: Json
          created_at?: string
          id?: string
          name: string
          provider: string
          status?: string
          type: string
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          api_key_encrypted?: string | null
          configuration?: Json
          created_at?: string
          id?: string
          name?: string
          provider?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      marketplace_tools: {
        Row: {
          configuration: Json | null
          id: string
          installed_at: string
          status: string
          tool_id: string
          tool_name: string
          user_id: string
          version: string | null
        }
        Insert: {
          configuration?: Json | null
          id?: string
          installed_at?: string
          status?: string
          tool_id: string
          tool_name: string
          user_id: string
          version?: string | null
        }
        Update: {
          configuration?: Json | null
          id?: string
          installed_at?: string
          status?: string
          tool_id?: string
          tool_name?: string
          user_id?: string
          version?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          preferences: Json | null
          role: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          preferences?: Json | null
          role?: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          preferences?: Json | null
          role?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          date_from: string
          date_to: string
          description: string | null
          file_path: string | null
          id: string
          include_charts: boolean | null
          include_details: boolean | null
          include_raw_data: boolean | null
          name: string
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_from: string
          date_to: string
          description?: string | null
          file_path?: string | null
          id?: string
          include_charts?: boolean | null
          include_details?: boolean | null
          include_raw_data?: boolean | null
          name: string
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_from?: string
          date_to?: string
          description?: string | null
          file_path?: string | null
          id?: string
          include_charts?: boolean | null
          include_details?: boolean | null
          include_raw_data?: boolean | null
          name?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      test_cases: {
        Row: {
          actual_result: string | null
          assignee_id: string | null
          created_at: string
          description: string | null
          environment: string | null
          expected_result: string | null
          id: string
          priority: string
          status: string
          steps: Json | null
          tags: string[] | null
          test_data: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_result?: string | null
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          environment?: string | null
          expected_result?: string | null
          id?: string
          priority: string
          status?: string
          steps?: Json | null
          tags?: string[] | null
          test_data?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_result?: string | null
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          environment?: string | null
          expected_result?: string | null
          id?: string
          priority?: string
          status?: string
          steps?: Json | null
          tags?: string[] | null
          test_data?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      test_executions: {
        Row: {
          browser: string | null
          environment: string | null
          error_message: string | null
          executed_at: string
          executed_by: string
          execution_time: number | null
          id: string
          screenshots: Json | null
          status: string
          test_case_id: string
        }
        Insert: {
          browser?: string | null
          environment?: string | null
          error_message?: string | null
          executed_at?: string
          executed_by: string
          execution_time?: number | null
          id?: string
          screenshots?: Json | null
          status: string
          test_case_id: string
        }
        Update: {
          browser?: string | null
          environment?: string | null
          error_message?: string | null
          executed_at?: string
          executed_by?: string
          execution_time?: number | null
          id?: string
          screenshots?: Json | null
          status?: string
          test_case_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_executions_test_case_id_fkey"
            columns: ["test_case_id"]
            isOneToOne: false
            referencedRelation: "test_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credentials: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_user: {
        Args: { p_username: string; p_password: string }
        Returns: {
          user_id: string
          username: string
          role: Database["public"]["Enums"]["user_role"]
        }[]
      }
      get_dashboard_metrics: {
        Args: { user_uuid?: string }
        Returns: {
          total_test_cases: number
          passed_tests: number
          failed_tests: number
          pending_tests: number
          total_executions: number
          avg_execution_time: number
          recent_activity: Json
        }[]
      }
      register_user: {
        Args: {
          p_username: string
          p_password: string
          p_role?: Database["public"]["Enums"]["user_role"]
        }
        Returns: string
      }
    }
    Enums: {
      user_role: "admin" | "tester"
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
    Enums: {
      user_role: ["admin", "tester"],
    },
  },
} as const
