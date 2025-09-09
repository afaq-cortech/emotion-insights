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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      access_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          is_used: boolean
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_used?: boolean
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_used?: boolean
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      ad_packages: {
        Row: {
          ad_list: Json | null
          assigned_panels: Json | null
          created_at: string
          id: number
          inst_list: Json | null
          package_id: string | null
          show_order: Json | null
        }
        Insert: {
          ad_list?: Json | null
          assigned_panels?: Json | null
          created_at?: string
          id?: number
          inst_list?: Json | null
          package_id?: string | null
          show_order?: Json | null
        }
        Update: {
          ad_list?: Json | null
          assigned_panels?: Json | null
          created_at?: string
          id?: number
          inst_list?: Json | null
          package_id?: string | null
          show_order?: Json | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          login_id: string | null
          password_hash: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          login_id?: string | null
          password_hash: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          login_id?: string | null
          password_hash?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          allowed_tables: string[] | null
          api_key: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_name: string
          last_used_at: string | null
          metadata: Json | null
          rate_limit_per_hour: number | null
          usage_count: number | null
        }
        Insert: {
          allowed_tables?: string[] | null
          api_key: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name: string
          last_used_at?: string | null
          metadata?: Json | null
          rate_limit_per_hour?: number | null
          usage_count?: number | null
        }
        Update: {
          allowed_tables?: string[] | null
          api_key?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name?: string
          last_used_at?: string | null
          metadata?: Json | null
          rate_limit_per_hour?: number | null
          usage_count?: number | null
        }
        Relationships: []
      }
      api_usage_logs: {
        Row: {
          api_key_id: string | null
          created_at: string | null
          endpoint: string
          id: string
          ip_address: string | null
          method: string
          request_data: Json | null
          response_status: number | null
          response_time_ms: number | null
          user_agent: string | null
        }
        Insert: {
          api_key_id?: string | null
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address?: string | null
          method: string
          request_data?: Json | null
          response_status?: number | null
          response_time_ms?: number | null
          user_agent?: string | null
        }
        Update: {
          api_key_id?: string | null
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: string | null
          method?: string
          request_data?: Json | null
          response_status?: number | null
          response_time_ms?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_breakdown: {
        Row: {
          asset_id: string | null
          assign_date: string | null
          created_at: string
          id: number
          reactor_id: string | null
        }
        Insert: {
          asset_id?: string | null
          assign_date?: string | null
          created_at?: string
          id?: number
          reactor_id?: string | null
        }
        Update: {
          asset_id?: string | null
          assign_date?: string | null
          created_at?: string
          id?: number
          reactor_id?: string | null
        }
        Relationships: []
      }
      asset_data: {
        Row: {
          ad_info: Json | null
          asset_desc: string | null
          asset_duration: number | null
          asset_id: string | null
          asset_name: string | null
          asset_priority: number | null
          asset_type: string | null
          asset_url: string | null
          created_at: string
          created_by: string | null
          end_date: string | null
          id: number
          interstitial_type: string | null
          post_date: string | null
          si_info: Json | null
        }
        Insert: {
          ad_info?: Json | null
          asset_desc?: string | null
          asset_duration?: number | null
          asset_id?: string | null
          asset_name?: string | null
          asset_priority?: number | null
          asset_type?: string | null
          asset_url?: string | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: number
          interstitial_type?: string | null
          post_date?: string | null
          si_info?: Json | null
        }
        Update: {
          ad_info?: Json | null
          asset_desc?: string | null
          asset_duration?: number | null
          asset_id?: string | null
          asset_name?: string | null
          asset_priority?: number | null
          asset_type?: string | null
          asset_url?: string | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: number
          interstitial_type?: string | null
          post_date?: string | null
          si_info?: Json | null
        }
        Relationships: []
      }
      asset_summary: {
        Row: {
          asset_id: string | null
          assigned: number | null
          created_at: string
          end_date: string | null
          filters: Json | null
          goal: number | null
          id: number
          post_date: string | null
          priority: number | null
          reactors: Json | null
          status: string | null
        }
        Insert: {
          asset_id?: string | null
          assigned?: number | null
          created_at?: string
          end_date?: string | null
          filters?: Json | null
          goal?: number | null
          id?: number
          post_date?: string | null
          priority?: number | null
          reactors?: Json | null
          status?: string | null
        }
        Update: {
          asset_id?: string | null
          assigned?: number | null
          created_at?: string
          end_date?: string | null
          filters?: Json | null
          goal?: number | null
          id?: number
          post_date?: string | null
          priority?: number | null
          reactors?: Json | null
          status?: string | null
        }
        Relationships: []
      }
      calendar: {
        Row: {
          created_at: string
          date_end: string | null
          date_start: string | null
          id: number
          reactors_assigned: number | null
          week: number | null
          year: number | null
        }
        Insert: {
          created_at?: string
          date_end?: string | null
          date_start?: string | null
          id?: number
          reactors_assigned?: number | null
          week?: number | null
          year?: number | null
        }
        Update: {
          created_at?: string
          date_end?: string | null
          date_start?: string | null
          id?: number
          reactors_assigned?: number | null
          week?: number | null
          year?: number | null
        }
        Relationships: []
      }
      calendar_panels: {
        Row: {
          calendar_week_id: number | null
          created_at: string
          id: number
          package_order: Json | null
          panel_demo_vals: Json | null
          panel_desc: string
          panel_id: string | null
          reactors_assigned: number | null
        }
        Insert: {
          calendar_week_id?: number | null
          created_at?: string
          id?: number
          package_order?: Json | null
          panel_demo_vals?: Json | null
          panel_desc?: string
          panel_id?: string | null
          reactors_assigned?: number | null
        }
        Update: {
          calendar_week_id?: number | null
          created_at?: string
          id?: number
          package_order?: Json | null
          panel_demo_vals?: Json | null
          panel_desc?: string
          panel_id?: string | null
          reactors_assigned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_panels_calendar_week_id_fkey"
            columns: ["calendar_week_id"]
            isOneToOne: false
            referencedRelation: "calendar"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_prelim: {
        Row: {
          created_at: string
          demo: string | null
          demo_options: Json | null
          id: number
        }
        Insert: {
          created_at?: string
          demo?: string | null
          demo_options?: Json | null
          id?: number
        }
        Update: {
          created_at?: string
          demo?: string | null
          demo_options?: Json | null
          id?: number
        }
        Relationships: []
      }
      demo_tags: {
        Row: {
          created_at: string
          demo_tag: string | null
          id: number
          reactor_id: string | null
        }
        Insert: {
          created_at?: string
          demo_tag?: string | null
          id?: number
          reactor_id?: string | null
        }
        Update: {
          created_at?: string
          demo_tag?: string | null
          id?: number
          reactor_id?: string | null
        }
        Relationships: []
      }
      demos: {
        Row: {
          age: number | null
          age_group: string | null
          alcohol_consumption: string | null
          compare_anxiety: string | null
          compare_fearfulness: string | null
          compare_happiness: string | null
          compare_humor: string | null
          compare_open_minded: string | null
          compare_outgoing: string | null
          compare_sadness: string | null
          compare_self_confidence: string | null
          compare_stressed_out: string | null
          created_at: string | null
          education: string | null
          education_group: string | null
          employment_status: string | null
          frequency_gamble: string | null
          frequency_movies_tv: string | null
          frequency_music: string | null
          frequency_podcasts: string | null
          frequency_social_clips: string | null
          frequency_video_gaming: string | null
          gender: string | null
          genre_movies: string | null
          genre_music: string | null
          genre_podcast: string | null
          housing_status: string | null
          id: number
          income: string | null
          income_group: string | null
          issue_abortion: string | null
          issue_border: string | null
          issue_drug_legality: string | null
          marital_status: string | null
          mix_values: Json | null
          mobile_type: string | null
          mostly_shop: string | null
          optimism_us_economy: string | null
          optimism_your_future: string | null
          panel: string | null
          pets: string | null
          political_party: string | null
          race: string | null
          reactor_id: string | null
          religious_attendence: string | null
          religious_beliefs: string | null
          religious_group: string | null
          saving: string | null
          smoke_vape: string | null
          spend_online: string | null
          state_territory: string | null
          streaming_services_amount: string | null
          streaming_want: string | null
          vehicle_ownership: string | null
          vote_2016: string | null
          vote_2020: string | null
          vote_2024: string | null
          vote_economy: number | null
          vote_environment: number | null
          vote_equality: number | null
          vote_lgbgt: number | null
          zipcode: string | null
        }
        Insert: {
          age?: number | null
          age_group?: string | null
          alcohol_consumption?: string | null
          compare_anxiety?: string | null
          compare_fearfulness?: string | null
          compare_happiness?: string | null
          compare_humor?: string | null
          compare_open_minded?: string | null
          compare_outgoing?: string | null
          compare_sadness?: string | null
          compare_self_confidence?: string | null
          compare_stressed_out?: string | null
          created_at?: string | null
          education?: string | null
          education_group?: string | null
          employment_status?: string | null
          frequency_gamble?: string | null
          frequency_movies_tv?: string | null
          frequency_music?: string | null
          frequency_podcasts?: string | null
          frequency_social_clips?: string | null
          frequency_video_gaming?: string | null
          gender?: string | null
          genre_movies?: string | null
          genre_music?: string | null
          genre_podcast?: string | null
          housing_status?: string | null
          id: number
          income?: string | null
          income_group?: string | null
          issue_abortion?: string | null
          issue_border?: string | null
          issue_drug_legality?: string | null
          marital_status?: string | null
          mix_values?: Json | null
          mobile_type?: string | null
          mostly_shop?: string | null
          optimism_us_economy?: string | null
          optimism_your_future?: string | null
          panel?: string | null
          pets?: string | null
          political_party?: string | null
          race?: string | null
          reactor_id?: string | null
          religious_attendence?: string | null
          religious_beliefs?: string | null
          religious_group?: string | null
          saving?: string | null
          smoke_vape?: string | null
          spend_online?: string | null
          state_territory?: string | null
          streaming_services_amount?: string | null
          streaming_want?: string | null
          vehicle_ownership?: string | null
          vote_2016?: string | null
          vote_2020?: string | null
          vote_2024?: string | null
          vote_economy?: number | null
          vote_environment?: number | null
          vote_equality?: number | null
          vote_lgbgt?: number | null
          zipcode?: string | null
        }
        Update: {
          age?: number | null
          age_group?: string | null
          alcohol_consumption?: string | null
          compare_anxiety?: string | null
          compare_fearfulness?: string | null
          compare_happiness?: string | null
          compare_humor?: string | null
          compare_open_minded?: string | null
          compare_outgoing?: string | null
          compare_sadness?: string | null
          compare_self_confidence?: string | null
          compare_stressed_out?: string | null
          created_at?: string | null
          education?: string | null
          education_group?: string | null
          employment_status?: string | null
          frequency_gamble?: string | null
          frequency_movies_tv?: string | null
          frequency_music?: string | null
          frequency_podcasts?: string | null
          frequency_social_clips?: string | null
          frequency_video_gaming?: string | null
          gender?: string | null
          genre_movies?: string | null
          genre_music?: string | null
          genre_podcast?: string | null
          housing_status?: string | null
          id?: number
          income?: string | null
          income_group?: string | null
          issue_abortion?: string | null
          issue_border?: string | null
          issue_drug_legality?: string | null
          marital_status?: string | null
          mix_values?: Json | null
          mobile_type?: string | null
          mostly_shop?: string | null
          optimism_us_economy?: string | null
          optimism_your_future?: string | null
          panel?: string | null
          pets?: string | null
          political_party?: string | null
          race?: string | null
          reactor_id?: string | null
          religious_attendence?: string | null
          religious_beliefs?: string | null
          religious_group?: string | null
          saving?: string | null
          smoke_vape?: string | null
          spend_online?: string | null
          state_territory?: string | null
          streaming_services_amount?: string | null
          streaming_want?: string | null
          vehicle_ownership?: string | null
          vote_2016?: string | null
          vote_2020?: string | null
          vote_2024?: string | null
          vote_economy?: number | null
          vote_environment?: number | null
          vote_equality?: number | null
          vote_lgbgt?: number | null
          zipcode?: string | null
        }
        Relationships: []
      }
      option_list: {
        Row: {
          analysis_date: string | null
          created_at: string
          id: string
          notes: string | null
          option_value: string
          polling_id: string
          video_name: string
          video_url: string | null
        }
        Insert: {
          analysis_date?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          option_value: string
          polling_id: string
          video_name: string
          video_url?: string | null
        }
        Update: {
          analysis_date?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          option_value?: string
          polling_id?: string
          video_name?: string
          video_url?: string | null
        }
        Relationships: []
      }
      option_list_failed: {
        Row: {
          analysis_date: string | null
          created_at: string
          error_reason: string
          id: string
          notes: string | null
          option_value: string
          polling_id: string
          video_name: string
          video_url: string | null
        }
        Insert: {
          analysis_date?: string | null
          created_at?: string
          error_reason: string
          id?: string
          notes?: string | null
          option_value: string
          polling_id: string
          video_name: string
          video_url?: string | null
        }
        Update: {
          analysis_date?: string | null
          created_at?: string
          error_reason?: string
          id?: string
          notes?: string | null
          option_value?: string
          polling_id?: string
          video_name?: string
          video_url?: string | null
        }
        Relationships: []
      }
      panel_mixes: {
        Row: {
          created_at: string
          id: number
          mix_id: string | null
          mix_name: string | null
          panel_mix: Json | null
        }
        Insert: {
          created_at?: string
          id?: number
          mix_id?: string | null
          mix_name?: string | null
          panel_mix?: Json | null
        }
        Update: {
          created_at?: string
          id?: number
          mix_id?: string | null
          mix_name?: string | null
          panel_mix?: Json | null
        }
        Relationships: []
      }
      panels: {
        Row: {
          create_date: string | null
          created_at: string
          id: number
          inactive_date: string | null
          panel_count: number | null
          panel_demo_vals: Json | null
          panel_desc: string | null
          panel_id: string | null
          panel_max: number | null
          panel_priority: number | null
          reactor_id: Json | null
        }
        Insert: {
          create_date?: string | null
          created_at?: string
          id?: number
          inactive_date?: string | null
          panel_count?: number | null
          panel_demo_vals?: Json | null
          panel_desc?: string | null
          panel_id?: string | null
          panel_max?: number | null
          panel_priority?: number | null
          reactor_id?: Json | null
        }
        Update: {
          create_date?: string | null
          created_at?: string
          id?: number
          inactive_date?: string | null
          panel_count?: number | null
          panel_demo_vals?: Json | null
          panel_desc?: string | null
          panel_id?: string | null
          panel_max?: number | null
          panel_priority?: number | null
          reactor_id?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          is_admin: boolean | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          is_admin?: boolean | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          name?: string | null
        }
        Relationships: []
      }
      reactor_alerts: {
        Row: {
          alert_status: string | null
          created_at: string
          end_date: string | null
          filter: Json | null
          id: number
          message: string | null
          start_date: string | null
        }
        Insert: {
          alert_status?: string | null
          created_at?: string
          end_date?: string | null
          filter?: Json | null
          id?: number
          message?: string | null
          start_date?: string | null
        }
        Update: {
          alert_status?: string | null
          created_at?: string
          end_date?: string | null
          filter?: Json | null
          id?: number
          message?: string | null
          start_date?: string | null
        }
        Relationships: []
      }
      reactor_assignments: {
        Row: {
          assign_date: string | null
          created_at: string
          id: number
          package_order: Json | null
          panel_id: string | null
          reactor_id: string | null
          score_count: number | null
          week: number | null
          year: number | null
        }
        Insert: {
          assign_date?: string | null
          created_at?: string
          id?: number
          package_order?: Json | null
          panel_id?: string | null
          reactor_id?: string | null
          score_count?: number | null
          week?: number | null
          year?: number | null
        }
        Update: {
          assign_date?: string | null
          created_at?: string
          id?: number
          package_order?: Json | null
          panel_id?: string | null
          reactor_id?: string | null
          score_count?: number | null
          week?: number | null
          year?: number | null
        }
        Relationships: []
      }
      reactor_collection: {
        Row: {
          created_at: string
          filename: string | null
          id: number
          package_id: string | null
          reactor_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          filename?: string | null
          id?: number
          package_id?: string | null
          reactor_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          filename?: string | null
          id?: number
          package_id?: string | null
          reactor_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      reactor_collection_archive: {
        Row: {
          archive_date: string | null
          created_at: string
          filename: string | null
          id: number
          package_id: string | null
          reactor_id: string | null
          status: string | null
        }
        Insert: {
          archive_date?: string | null
          created_at?: string
          filename?: string | null
          id?: number
          package_id?: string | null
          reactor_id?: string | null
          status?: string | null
        }
        Update: {
          archive_date?: string | null
          created_at?: string
          filename?: string | null
          id?: number
          package_id?: string | null
          reactor_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      reactor_completes: {
        Row: {
          created_at: string
          end_date: string | null
          id: number
          package_count: number | null
          package_ids: Json | null
          reactor_id: string | null
          start_date: string | null
          status: string | null
          week: number | null
          year: number | null
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: number
          package_count?: number | null
          package_ids?: Json | null
          reactor_id?: string | null
          start_date?: string | null
          status?: string | null
          week?: number | null
          year?: number | null
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: number
          package_count?: number | null
          package_ids?: Json | null
          reactor_id?: string | null
          start_date?: string | null
          status?: string | null
          week?: number | null
          year?: number | null
        }
        Relationships: []
      }
      reactor_profile: {
        Row: {
          created_at: string
          demo_2024_voting: string | null
          demo_age: string | null
          demo_education: string | null
          demo_gender: string | null
          demo_householding: string | null
          demo_income: string | null
          demo_marital: string | null
          demo_occupation: string | null
          demo_race: string | null
          demo_religious: string | null
          email: string | null
          first_name: string | null
          id: number
          last_name: string | null
          zipcode: string | null
        }
        Insert: {
          created_at?: string
          demo_2024_voting?: string | null
          demo_age?: string | null
          demo_education?: string | null
          demo_gender?: string | null
          demo_householding?: string | null
          demo_income?: string | null
          demo_marital?: string | null
          demo_occupation?: string | null
          demo_race?: string | null
          demo_religious?: string | null
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          zipcode?: string | null
        }
        Update: {
          created_at?: string
          demo_2024_voting?: string | null
          demo_age?: string | null
          demo_education?: string | null
          demo_gender?: string | null
          demo_householding?: string | null
          demo_income?: string | null
          demo_marital?: string | null
          demo_occupation?: string | null
          demo_race?: string | null
          demo_religious?: string | null
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          zipcode?: string | null
        }
        Relationships: []
      }
      reactor_status: {
        Row: {
          button: string | null
          button_url: string | null
          created_at: string
          id: number
          message: string | null
          status: string | null
        }
        Insert: {
          button?: string | null
          button_url?: string | null
          created_at?: string
          id?: number
          message?: string | null
          status?: string | null
        }
        Update: {
          button?: string | null
          button_url?: string | null
          created_at?: string
          id?: number
          message?: string | null
          status?: string | null
        }
        Relationships: []
      }
      reactor_utilization: {
        Row: {
          assigned_assets: Json | null
          created_at: string
          id: number
          post_date: string | null
          reactor_id: string | null
          slots_ads: number | null
          slots_int: number | null
        }
        Insert: {
          assigned_assets?: Json | null
          created_at?: string
          id?: number
          post_date?: string | null
          reactor_id?: string | null
          slots_ads?: number | null
          slots_int?: number | null
        }
        Update: {
          assigned_assets?: Json | null
          created_at?: string
          id?: number
          post_date?: string | null
          reactor_id?: string | null
          slots_ads?: number | null
          slots_int?: number | null
        }
        Relationships: []
      }
      reactor_warnings: {
        Row: {
          created_at: string
          id: number
          level: string | null
          level_desc: string | null
          message: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          level?: string | null
          level_desc?: string | null
          message?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          level?: string | null
          level_desc?: string | null
          message?: string | null
        }
        Relationships: []
      }
      reactor_week_assignments: {
        Row: {
          ad_duration: number | null
          ad_url: string | null
          asset_id: string | null
          asset_type: string | null
          complete_time: string | null
          created_at: string
          end_date: string | null
          id: number
          interstitial_type: string | null
          package_id: string | null
          reactor_id: string | null
          si_info: Json | null
          start_date: string | null
          week: number | null
          year: number | null
        }
        Insert: {
          ad_duration?: number | null
          ad_url?: string | null
          asset_id?: string | null
          asset_type?: string | null
          complete_time?: string | null
          created_at?: string
          end_date?: string | null
          id?: number
          interstitial_type?: string | null
          package_id?: string | null
          reactor_id?: string | null
          si_info?: Json | null
          start_date?: string | null
          week?: number | null
          year?: number | null
        }
        Update: {
          ad_duration?: number | null
          ad_url?: string | null
          asset_id?: string | null
          asset_type?: string | null
          complete_time?: string | null
          created_at?: string
          end_date?: string | null
          id?: number
          interstitial_type?: string | null
          package_id?: string | null
          reactor_id?: string | null
          si_info?: Json | null
          start_date?: string | null
          week?: number | null
          year?: number | null
        }
        Relationships: []
      }
      status_messages: {
        Row: {
          created_at: string
          id: number
          message: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          message?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          message?: string | null
          status?: string | null
        }
        Relationships: []
      }
      streaming_manager: {
        Row: {
          card_number: string | null
          ccv2: string | null
          created_at: string
          email: string | null
          expire_date: string | null
          id: number
          out_email: string | null
          password: string | null
          reactor_id: string | null
          status: string | null
          streamer: string | null
          subscription: string | null
          user_id: string | null
        }
        Insert: {
          card_number?: string | null
          ccv2?: string | null
          created_at?: string
          email?: string | null
          expire_date?: string | null
          id?: number
          out_email?: string | null
          password?: string | null
          reactor_id?: string | null
          status?: string | null
          streamer?: string | null
          subscription?: string | null
          user_id?: string | null
        }
        Update: {
          card_number?: string | null
          ccv2?: string | null
          created_at?: string
          email?: string | null
          expire_date?: string | null
          id?: number
          out_email?: string | null
          password?: string | null
          reactor_id?: string | null
          status?: string | null
          streamer?: string | null
          subscription?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_choices: {
        Row: {
          created_at: string
          id: number
          sub_details: string | null
          sub_level: string | null
          sub_value: string | null
          subscription: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          sub_details?: string | null
          sub_level?: string | null
          sub_value?: string | null
          subscription?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          sub_details?: string | null
          sub_level?: string | null
          sub_value?: string | null
          subscription?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          access_code: string | null
          age_group: string | null
          agree_crosscheck: string | null
          agree_data_share: string | null
          agree_iphone: string | null
          agree_live_id: string | null
          cell_number: string
          created_at: string
          education: string | null
          email: string
          first_name: string
          gender: string | null
          id: string
          income: string | null
          last_name: string
          marital_status: string | null
          race: string | null
          reactor_id: string | null
          reactor_level: string | null
          registered_voter: string | null
          status: string | null
          sub_change: string | null
          subscription: string | null
          user_id: string
          vote_2024: string | null
        }
        Insert: {
          access_code?: string | null
          age_group?: string | null
          agree_crosscheck?: string | null
          agree_data_share?: string | null
          agree_iphone?: string | null
          agree_live_id?: string | null
          cell_number: string
          created_at?: string
          education?: string | null
          email: string
          first_name: string
          gender?: string | null
          id?: string
          income?: string | null
          last_name: string
          marital_status?: string | null
          race?: string | null
          reactor_id?: string | null
          reactor_level?: string | null
          registered_voter?: string | null
          status?: string | null
          sub_change?: string | null
          subscription?: string | null
          user_id: string
          vote_2024?: string | null
        }
        Update: {
          access_code?: string | null
          age_group?: string | null
          agree_crosscheck?: string | null
          agree_data_share?: string | null
          agree_iphone?: string | null
          agree_live_id?: string | null
          cell_number?: string
          created_at?: string
          education?: string | null
          email?: string
          first_name?: string
          gender?: string | null
          id?: string
          income?: string | null
          last_name?: string
          marital_status?: string | null
          race?: string | null
          reactor_id?: string | null
          reactor_level?: string | null
          registered_voter?: string | null
          status?: string | null
          sub_change?: string | null
          subscription?: string | null
          user_id?: string
          vote_2024?: string | null
        }
        Relationships: []
      }
      video_analysis: {
        Row: {
          created_at: string | null
          id: string
          option_count: number
          option_value: string
          video_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          option_count?: number
          option_value: string
          video_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          option_count?: number
          option_value?: string
          video_name?: string
        }
        Relationships: []
      }
      video_polling: {
        Row: {
          analysis_date: string
          created_at: string
          id: string
          notes: string | null
          polling_id: string
          raw_selected_options: string
          selected_options: string[]
          video_name: string
          video_url: string
        }
        Insert: {
          analysis_date: string
          created_at?: string
          id?: string
          notes?: string | null
          polling_id: string
          raw_selected_options: string
          selected_options: string[]
          video_name: string
          video_url: string
        }
        Update: {
          analysis_date?: string
          created_at?: string
          id?: string
          notes?: string | null
          polling_id?: string
          raw_selected_options?: string
          selected_options?: string[]
          video_name?: string
          video_url?: string
        }
        Relationships: []
      }
      video_polling_summary: {
        Row: {
          created_at: string
          id: string
          option_count: number
          option_value: string
          polling_id: string
          video_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_count?: number
          option_value: string
          polling_id: string
          video_name: string
        }
        Update: {
          created_at?: string
          id?: string
          option_count?: number
          option_value?: string
          polling_id?: string
          video_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      batch_assign_reactors_to_panels: {
        Args: { assignments: Json }
        Returns: {
          assigned_count: number
          panel_id: string
        }[]
      }
      count_incomplete_assets: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      count_rows: {
        Args: { condition?: string; table_name: string }
        Returns: number
      }
      create_access_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      create_user_profile: {
        Args: {
          p_access_code?: string
          p_cell_number: string
          p_email: string
          p_first_name: string
          p_last_name: string
          p_reactor_level?: string
          p_subscription?: string
          p_user_id: string
        }
        Returns: string
      }
      delete_polling_summary: {
        Args: { video_name_param: string }
        Returns: undefined
      }
      filter_reactors_by_demo_tags: {
        Args: { exclude_assigned_asset_id?: string; filter_groups: Json }
        Returns: {
          reactor_id: string
        }[]
      }
      generate_access_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_api_key: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_asset_breakdown: {
        Args: {
          end_week_param: number
          start_week_param: number
          year_param?: number
        }
        Returns: {
          asset_id: string
          asset_type: string
          usage_count: number
        }[]
      }
      get_demo_category_values: {
        Args: { category_name: string }
        Returns: {
          value: string
        }[]
      }
      get_distinct_demo_categories: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
        }[]
      }
      get_interstitial_breakdown: {
        Args: {
          end_week_param: number
          start_week_param: number
          year_param?: number
        }
        Returns: {
          interstitial_type: string
          usage_count: number
        }[]
      }
      get_package_breakdown: {
        Args: {
          end_week_param: number
          start_week_param: number
          year_param?: number
        }
        Returns: {
          package_id: string
          usage_count: number
        }[]
      }
      get_polling_summary: {
        Args: { video_name_param: string }
        Returns: {
          created_at: string
          id: string
          option_count: number
          option_value: string
          polling_id: string
          video_name: string
        }[]
      }
      get_random_unassigned_reactors: {
        Args: { limit_count: number }
        Returns: {
          reactor_id: string
        }[]
      }
      get_subscription_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          count: number
          subscription_id: string
          subscription_name: string
        }[]
      }
      get_weekly_report_summary: {
        Args: {
          end_week_param: number
          start_week_param: number
          year_param?: number
        }
        Returns: {
          unique_asset_types: number
          unique_assets: number
          unique_interstitial_types: number
          unique_packages: number
          unique_reactors: number
          week: number
          year: number
        }[]
      }
      hash_password: {
        Args: { password: string }
        Returns: string
      }
      insert_polling_summary: {
        Args: {
          option_count_param: number
          option_value_param: string
          polling_id_param: string
          video_name_param: string
        }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_session: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      rebuild_reactor_completes_for_week: {
        Args: { p_week: number; p_year: number }
        Returns: Json
      }
      rebuild_reactor_utilization: {
        Args: Record<PropertyKey, never>
        Returns: {
          assigned_assets: Json
          post_date: string
          reactor_id: string
          slots_ads: number
          slots_int: number
        }[]
      }
      refresh_demo_tags: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      sync_existing_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      sync_user_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      test_jsonb_param: {
        Args: { test_param: Json }
        Returns: Json
      }
      update_demographic_groups: {
        Args: Record<PropertyKey, never>
        Returns: {
          updated_age_count: number
          updated_education_count: number
          updated_income_count: number
          updated_religious_count: number
        }[]
      }
      update_demographics_and_tags: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      update_expired_alerts: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      use_access_code: {
        Args: { access_code: string; user_id: string }
        Returns: boolean
      }
      validate_access_code: {
        Args: { access_code: string }
        Returns: boolean
      }
      validate_api_key: {
        Args: { input_key: string }
        Returns: {
          allowed_tables: string[]
          api_key_id: string
          is_valid: boolean
          key_name: string
          rate_limit_exceeded: boolean
        }[]
      }
      verify_admin_login: {
        Args: { input_email: string; input_password: string }
        Returns: {
          created_at: string
          email: string
          id: string
          login_id: string
        }[]
      }
      verify_admin_password: {
        Args: { login_input: string; password: string }
        Returns: boolean
      }
      verify_password: {
        Args: { hash: string; password: string }
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
