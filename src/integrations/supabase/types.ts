export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      churches: {
        Row: {
          auto_approve_members: boolean | null
          created_at: string | null
          id: string
          member_count: number | null
          member_limit: number | null
          ministry_name: string
          name: string
          plan_type: string | null
          team_code: string
          team_code_expires_at: string | null
          updated_at: string | null
        }
        Insert: {
          auto_approve_members?: boolean | null
          created_at?: string | null
          id?: string
          member_count?: number | null
          member_limit?: number | null
          ministry_name: string
          name: string
          plan_type?: string | null
          team_code: string
          team_code_expires_at?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_approve_members?: boolean | null
          created_at?: string | null
          id?: string
          member_count?: number | null
          member_limit?: number | null
          ministry_name?: string
          name?: string
          plan_type?: string | null
          team_code?: string
          team_code_expires_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      equipes: {
        Row: {
          admin_id: string | null
          ativo: boolean | null
          codigo_equipe: string
          criado_em: string | null
          id: string
          nome: string
        }
        Insert: {
          admin_id?: string | null
          ativo?: boolean | null
          codigo_equipe: string
          criado_em?: string | null
          id?: string
          nome: string
        }
        Update: {
          admin_id?: string | null
          ativo?: boolean | null
          codigo_equipe?: string
          criado_em?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      escala_membros: {
        Row: {
          confirmado: boolean | null
          criado_em: string | null
          escala_id: string | null
          funcao: string
          id: string
          instrumento: string | null
          membro_id: string | null
          observacoes: string | null
        }
        Insert: {
          confirmado?: boolean | null
          criado_em?: string | null
          escala_id?: string | null
          funcao: string
          id?: string
          instrumento?: string | null
          membro_id?: string | null
          observacoes?: string | null
        }
        Update: {
          confirmado?: boolean | null
          criado_em?: string | null
          escala_id?: string | null
          funcao?: string
          id?: string
          instrumento?: string | null
          membro_id?: string | null
          observacoes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escala_membros_escala_id_fkey"
            columns: ["escala_id"]
            isOneToOne: false
            referencedRelation: "escalas"
            referencedColumns: ["id"]
          },
        ]
      }
      escalas: {
        Row: {
          criado_em: string | null
          criado_por: string | null
          data_evento: string
          descricao: string | null
          equipe_id: string | null
          horario_evento: string
          id: string
          local_evento: string | null
          status: string | null
          titulo: string
        }
        Insert: {
          criado_em?: string | null
          criado_por?: string | null
          data_evento: string
          descricao?: string | null
          equipe_id?: string | null
          horario_evento: string
          id?: string
          local_evento?: string | null
          status?: string | null
          titulo: string
        }
        Update: {
          criado_em?: string | null
          criado_por?: string | null
          data_evento?: string
          descricao?: string | null
          equipe_id?: string | null
          horario_evento?: string
          id?: string
          local_evento?: string | null
          status?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "escalas_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_interactions: {
        Row: {
          created_at: string
          id: string
          prayer_request_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prayer_request_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prayer_request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_interactions_prayer_request_id_fkey"
            columns: ["prayer_request_id"]
            isOneToOne: false
            referencedRelation: "prayer_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_requests: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string | null
          prayer_count: number
          text: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name?: string | null
          prayer_count?: number
          text: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string | null
          prayer_count?: number
          text?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      schedule_participants: {
        Row: {
          confirmed: boolean | null
          created_at: string
          id: string
          instrument: string | null
          role: string
          schedule_id: string
          user_id: string
        }
        Insert: {
          confirmed?: boolean | null
          created_at?: string
          id?: string
          instrument?: string | null
          role: string
          schedule_id: string
          user_id: string
        }
        Update: {
          confirmed?: boolean | null
          created_at?: string
          id?: string
          instrument?: string | null
          role?: string
          schedule_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_participants_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          event_date: string
          event_time: string
          id: string
          location: string | null
          team_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          event_date: string
          event_time: string
          id?: string
          location?: string | null
          team_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          event_date?: string
          event_time?: string
          id?: string
          location?: string | null
          team_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          role: string
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_users_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: string
          name: string
          team_code: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          team_code: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          team_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          active: boolean
          created_at: string
          email: string
          id: string
          name: string | null
          role: string
          team_code: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          id: string
          name?: string | null
          role?: string
          team_code?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          role?: string
          team_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          active: boolean | null
          availability: string | null
          avatar_url: string | null
          church_id: string | null
          created_at: string | null
          email: string
          id: string
          invited_by: string | null
          name: string
          role: string
          skills: string[] | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          availability?: string | null
          avatar_url?: string | null
          church_id?: string | null
          created_at?: string | null
          email: string
          id: string
          invited_by?: string | null
          name: string
          role?: string
          skills?: string[] | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          availability?: string | null
          avatar_url?: string | null
          church_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          invited_by?: string | null
          name?: string
          role?: string
          skills?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          codigo_equipe: string | null
          criado_em: string | null
          email: string
          foto_url: string | null
          id: string
          instrumento: string | null
          nome: string
          tipo: string
        }
        Insert: {
          codigo_equipe?: string | null
          criado_em?: string | null
          email: string
          foto_url?: string | null
          id: string
          instrumento?: string | null
          nome: string
          tipo: string
        }
        Update: {
          codigo_equipe?: string | null
          criado_em?: string | null
          email?: string
          foto_url?: string | null
          id?: string
          instrumento?: string | null
          nome?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_codigo_equipe_fkey"
            columns: ["codigo_equipe"]
            isOneToOne: false
            referencedRelation: "equipes"
            referencedColumns: ["codigo_equipe"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      buscar_membros_equipe: {
        Args: { equipe_codigo: string }
        Returns: {
          id: string
          nome: string
          email: string
          instrumento: string
          tipo: string
        }[]
      }
      cleanup_expired_invitations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_notifications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_church_with_admin: {
        Args: {
          church_name: string
          ministry_name: string
          creator_uuid: string
          creator_name: string
          creator_email: string
        }
        Returns: {
          church_id: string
          team_code: string
          success: boolean
          message: string
        }[]
      }
      create_team_with_admin: {
        Args: {
          team_name: string
          user_name: string
          user_email: string
          user_id: string
        }
        Returns: {
          team_id: string
          team_code: string
          success: boolean
          message: string
        }[]
      }
      delete_church_team: {
        Args: {
          church_uuid: string
          admin_uuid: string
          confirmation_text: string
          double_confirmation: string
        }
        Returns: boolean
      }
      ensure_user_profile: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      generate_invite_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_team_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gerar_codigo_equipe: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_church_schedules: {
        Args: { church_uuid: string; limit_count?: number }
        Returns: {
          id: string
          event_id: string
          event_title: string
          event_type: string
          event_date: string
          event_time: string
          event_location: string
          participant_count: number
          confirmed_count: number
          status: string
        }[]
      }
      get_detailed_rehearsals_by_church: {
        Args: { church_uuid: string; limit_count?: number }
        Returns: {
          id: string
          title: string
          event_date: string
          event_time: string
          end_time: string
          location: string
          description: string
          notes: string
          status: string
          participant_count: number
          confirmed_count: number
          created_by: string
          created_at: string
        }[]
      }
      get_or_create_user_profile: {
        Args: { user_uuid: string }
        Returns: {
          id: string
          email: string
          name: string
          role: string
          church_id: string
          invited_by: string
          active: boolean
          avatar_url: string
          skills: string[]
          availability: string
          created_at: string
          updated_at: string
        }[]
      }
      get_popular_songs: {
        Args: { church_uuid: string; limit_count?: number }
        Returns: {
          id: string
          title: string
          artist: string
          key: string
          category: string
          usage_count: number
        }[]
      }
      get_rehearsals_by_church: {
        Args: { church_uuid: string; limit_count?: number }
        Returns: {
          id: string
          title: string
          date: string
          location: string
          created_at: string
        }[]
      }
      get_team_members: {
        Args:
          | { church_uuid: string; requesting_user_uuid: string }
          | { requesting_user_id: string }
        Returns: {
          id: string
          name: string
          email: string
          role: string
          active: boolean
          skills: string[]
          availability: string
          avatar_url: string
          created_at: string
          updated_at: string
          invited_by: string
          inviter_name: string
          last_activity: string
          events_count: number
          confirmed_events_count: number
        }[]
      }
      get_team_schedules: {
        Args: { requesting_user_id: string }
        Returns: {
          id: string
          title: string
          description: string
          event_date: string
          event_time: string
          location: string
          created_by: string
          created_at: string
          participant_count: number
        }[]
      }
      get_team_statistics: {
        Args: { church_uuid: string; admin_uuid: string }
        Returns: {
          total_members: number
          active_members: number
          inactive_members: number
          super_admins: number
          admins: number
          leaders: number
          ministers: number
          pending_invitations: number
          recent_activity_count: number
          member_limit: number
          plan_type: string
        }[]
      }
      get_user_by_email: {
        Args: { user_email: string }
        Returns: {
          id: string
          email: string
          nome: string
          tipo: string
          instrumento: string
          foto_url: string
        }[]
      }
      get_user_church_id: {
        Args: { user_uuid: string }
        Returns: string
      }
      get_user_favorite_songs: {
        Args: { user_uuid: string; limit_count?: number }
        Returns: {
          id: string
          title: string
          artist: string
          key: string
          tempo: number
          difficulty: string
          category: string
          tags: string[]
          is_favorite: boolean
          duration: string
          church_id: string
          created_by: string
          created_at: string
          updated_at: string
          creator_name: string
          has_lyrics: boolean
          has_chords: boolean
          has_links: boolean
          youtube_url: string
          spotify_url: string
          apple_music_url: string
        }[]
      }
      get_user_rehearsal_schedule: {
        Args: { user_uuid: string; limit_count?: number }
        Returns: {
          id: string
          title: string
          event_date: string
          event_time: string
          end_time: string
          location: string
          description: string
          notes: string
          status: string
          user_role: string
          user_instrument: string
          user_confirmed: boolean
          participant_count: number
          confirmed_count: number
          created_by: string
          created_at: string
        }[]
      }
      get_user_schedules: {
        Args:
          | { requesting_user_id: string }
          | { user_uuid: string; limit_count?: number }
        Returns: {
          id: string
          event_id: string
          event_title: string
          event_type: string
          event_date: string
          event_time: string
          event_location: string
          participant_count: number
          confirmed_count: number
          status: string
          user_role: string
          instrument: string
          confirmed: boolean
        }[]
      }
      get_user_team_data: {
        Args: { user_id: string }
        Returns: {
          team_id: string
          team_name: string
          team_code: string
          user_role: string
          user_name: string
        }[]
      }
      handle_user_registration: {
        Args: {
          user_name: string
          user_email: string
          user_id: string
          ministry_code?: string
        }
        Returns: Json
      }
      increment_prayer_count: {
        Args: { request_id: string; user_id: string }
        Returns: boolean
      }
      is_admin_user: {
        Args: { user_id: string; target_church_id: string }
        Returns: boolean
      }
      join_team_by_code: {
        Args: { p_team_code: string; p_user_name: string; p_user_email: string }
        Returns: Json
      }
      join_team_with_code: {
        Args:
          | {
              code: string
              user_name: string
              user_email: string
              user_id: string
            }
          | { user_uuid: string; team_code: string }
        Returns: {
          team_id: string
          success: boolean
          message: string
        }[]
      }
      remove_team_member: {
        Args: { member_uuid: string; admin_uuid: string; reason?: string }
        Returns: boolean
      }
      search_songs: {
        Args: {
          search_term?: string
          church_uuid?: string
          song_category?: string
          song_key?: string
          difficulty_level?: string
          limit_count?: number
        }
        Returns: {
          id: string
          title: string
          artist: string
          key: string
          tempo: number
          difficulty: string
          category: string
          tags: string[]
          is_favorite: boolean
          duration: string
          church_id: string
          created_by: string
          created_at: string
          updated_at: string
          creator_name: string
          has_lyrics: boolean
          has_chords: boolean
          has_links: boolean
          youtube_url: string
          spotify_url: string
          apple_music_url: string
        }[]
      }
      toggle_song_favorite: {
        Args: { song_uuid: string; user_uuid: string }
        Returns: boolean
      }
      update_member_role: {
        Args: { member_uuid: string; new_role: string; admin_uuid: string }
        Returns: boolean
      }
      update_team_code: {
        Args: { church_uuid: string; admin_uuid: string }
        Returns: string
      }
      validate_invite_code: {
        Args: { code: string }
        Returns: Json
      }
      validate_team_code: {
        Args: { code: string }
        Returns: {
          is_valid: boolean
          church_id: string
          church_name: string
          ministry_name: string
          member_count: number
          member_limit: number
          auto_approve: boolean
          expires_at: string
          message: string
        }[]
      }
    }
    Enums: {
      user_role: "super_admin" | "admin" | "leader" | "minister"
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
      user_role: ["super_admin", "admin", "leader", "minister"],
    },
  },
} as const
