export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string | null;
          country: string | null;
          created_at: string | null;
          id: string;
          is_default: boolean | null;
          label: string | null;
          line1: string;
          user_id: string;
        };
        Insert: {
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          id?: string;
          is_default?: boolean | null;
          label?: string | null;
          line1: string;
          user_id: string;
        };
        Update: {
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          id?: string;
          is_default?: boolean | null;
          label?: string | null;
          line1?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          actor_id: string | null;
          created_at: string | null;
          entity_id: string | null;
          entity_type: string | null;
          event: string;
          id: number;
          metadata: Json | null;
        };
        Insert: {
          actor_id?: string | null;
          created_at?: string | null;
          entity_id?: string | null;
          entity_type?: string | null;
          event: string;
          id?: never;
          metadata?: Json | null;
        };
        Update: {
          actor_id?: string | null;
          created_at?: string | null;
          entity_id?: string | null;
          entity_type?: string | null;
          event?: string;
          id?: never;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      cart_items: {
        Row: {
          cart_id: string;
          id: string;
          plan_id: string;
          quantity: number;
        };
        Insert: {
          cart_id: string;
          id?: string;
          plan_id: string;
          quantity?: number;
        };
        Update: {
          cart_id?: string;
          id?: string;
          plan_id?: string;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey";
            columns: ["cart_id"];
            isOneToOne: false;
            referencedRelation: "carts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "service_plans";
            referencedColumns: ["id"];
          },
        ];
      };
      carts: {
        Row: {
          created_at: string | null;
          id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "carts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      deliverables: {
        Row: {
          created_at: string | null;
          file_path: string | null;
          id: string;
          name: string;
          project_id: string;
          url: string | null;
        };
        Insert: {
          created_at?: string | null;
          file_path?: string | null;
          id?: string;
          name: string;
          project_id: string;
          url?: string | null;
        };
        Update: {
          created_at?: string | null;
          file_path?: string | null;
          id?: string;
          name?: string;
          project_id?: string;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "deliverables_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      discounts: {
        Row: {
          active: boolean | null;
          amount_xaf: number | null;
          code: string;
          ends_at: string | null;
          id: string;
          percent: number | null;
          starts_at: string | null;
        };
        Insert: {
          active?: boolean | null;
          amount_xaf?: number | null;
          code: string;
          ends_at?: string | null;
          id?: string;
          percent?: number | null;
          starts_at?: string | null;
        };
        Update: {
          active?: boolean | null;
          amount_xaf?: number | null;
          code?: string;
          ends_at?: string | null;
          id?: string;
          percent?: number | null;
          starts_at?: string | null;
        };
        Relationships: [];
      };
      favorites: {
        Row: {
          created_at: string | null;
          service_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          service_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          service_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "favorites_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "favorites_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          body: string | null;
          created_at: string | null;
          id: string;
          read_at: string | null;
          title: string;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string | null;
          id?: string;
          read_at?: string | null;
          title: string;
          user_id: string;
        };
        Update: {
          body?: string | null;
          created_at?: string | null;
          id?: string;
          read_at?: string | null;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          line_total_xaf: number;
          order_id: string;
          plan_name: string;
          quantity: number;
          service_name: string;
          unit_price_xaf: number;
        };
        Insert: {
          id?: string;
          line_total_xaf: number;
          order_id: string;
          plan_name: string;
          quantity?: number;
          service_name: string;
          unit_price_xaf: number;
        };
        Update: {
          id?: string;
          line_total_xaf?: number;
          order_id?: string;
          plan_name?: string;
          quantity?: number;
          service_name?: string;
          unit_price_xaf?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          brief: string | null;
          created_at: string | null;
          currency: string;
          discount_xaf: number;
          id: string;
          order_number: string;
          quote_note: string | null;
          quote_state: string;
          quoted_at: string | null;
          request_key: string | null;
          service_id: string | null;
          status: Database["public"]["Enums"]["order_status"];
          subtotal_xaf: number;
          total_xaf: number;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          brief?: string | null;
          created_at?: string | null;
          currency?: string;
          discount_xaf?: number;
          id?: string;
          order_number: string;
          quote_note?: string | null;
          quote_state?: string;
          quoted_at?: string | null;
          request_key?: string | null;
          service_id?: string | null;
          status?: Database["public"]["Enums"]["order_status"];
          subtotal_xaf?: number;
          total_xaf?: number;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          brief?: string | null;
          created_at?: string | null;
          currency?: string;
          discount_xaf?: number;
          id?: string;
          order_number?: string;
          quote_note?: string | null;
          quote_state?: string;
          quoted_at?: string | null;
          request_key?: string | null;
          service_id?: string | null;
          status?: Database["public"]["Enums"]["order_status"];
          subtotal_xaf?: number;
          total_xaf?: number;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      payment_events: {
        Row: {
          created_at: string | null;
          event_type: string;
          id: string;
          payload: Json | null;
          payment_id: string;
          provider_event_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_type: string;
          id?: string;
          payload?: Json | null;
          payment_id: string;
          provider_event_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_type?: string;
          id?: string;
          payload?: Json | null;
          payment_id?: string;
          provider_event_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payment_events_payment_id_fkey";
            columns: ["payment_id"];
            isOneToOne: false;
            referencedRelation: "payments";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          amount_xaf: number;
          created_at: string | null;
          id: string;
          idempotency_key: string | null;
          order_id: string;
          payment_number: string;
          provider: string | null;
          provider_reference: string | null;
          status: Database["public"]["Enums"]["payment_status"];
          updated_at: string | null;
        };
        Insert: {
          amount_xaf: number;
          created_at?: string | null;
          id?: string;
          idempotency_key?: string | null;
          order_id: string;
          payment_number: string;
          provider?: string | null;
          provider_reference?: string | null;
          status?: Database["public"]["Enums"]["payment_status"];
          updated_at?: string | null;
        };
        Update: {
          amount_xaf?: number;
          created_at?: string | null;
          id?: string;
          idempotency_key?: string | null;
          order_id?: string;
          payment_number?: string;
          provider?: string | null;
          provider_reference?: string | null;
          status?: Database["public"]["Enums"]["payment_status"];
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          company: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          phone: string | null;
          role: Database["public"]["Enums"]["app_role"];
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          company?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          company?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
      project_updates: {
        Row: {
          body: string | null;
          created_at: string | null;
          id: string;
          project_id: string;
          title: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string | null;
          id?: string;
          project_id: string;
          title: string;
        };
        Update: {
          body?: string | null;
          created_at?: string | null;
          id?: string;
          project_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          order_id: string | null;
          project_number: string;
          status: Database["public"]["Enums"]["project_status"];
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          order_id?: string | null;
          project_number: string;
          status?: Database["public"]["Enums"]["project_status"];
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          order_id?: string | null;
          project_number?: string;
          status?: Database["public"]["Enums"]["project_status"];
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      service_categories: {
        Row: {
          active: boolean | null;
          id: string;
          name: string;
          slug: string;
          sort_order: number | null;
        };
        Insert: {
          active?: boolean | null;
          id?: string;
          name: string;
          slug: string;
          sort_order?: number | null;
        };
        Update: {
          active?: boolean | null;
          id?: string;
          name?: string;
          slug?: string;
          sort_order?: number | null;
        };
        Relationships: [];
      };
      service_features: {
        Row: {
          id: string;
          label: string;
          service_id: string;
          sort_order: number | null;
        };
        Insert: {
          id?: string;
          label: string;
          service_id: string;
          sort_order?: number | null;
        };
        Update: {
          id?: string;
          label?: string;
          service_id?: string;
          sort_order?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "service_features_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      service_plans: {
        Row: {
          active: boolean | null;
          billing_label: string | null;
          discount_percent: number | null;
          id: string;
          name: string;
          price_xaf: number;
          service_id: string;
        };
        Insert: {
          active?: boolean | null;
          billing_label?: string | null;
          discount_percent?: number | null;
          id?: string;
          name: string;
          price_xaf: number;
          service_id: string;
        };
        Update: {
          active?: boolean | null;
          billing_label?: string | null;
          discount_percent?: number | null;
          id?: string;
          name?: string;
          price_xaf?: number;
          service_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "service_plans_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          active: boolean | null;
          category_id: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          image_url: string | null;
          name: string;
          slug: string;
          summary: string | null;
        };
        Insert: {
          active?: boolean | null;
          category_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name: string;
          slug: string;
          summary?: string | null;
        };
        Update: {
          active?: boolean | null;
          category_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name?: string;
          slug?: string;
          summary?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "service_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      support_requests: {
        Row: {
          created_at: string | null;
          id: string;
          message: string;
          responded_at: string | null;
          response: string | null;
          status: string;
          subject: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          message: string;
          responded_at?: string | null;
          response?: string | null;
          status?: string;
          subject: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          message?: string;
          responded_at?: string | null;
          response?: string | null;
          status?: string;
          subject?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "support_requests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      activate_owner: { Args: never; Returns: undefined };
      admin_quote: {
        Args: { p_amount: number; p_note: string; p_order: string };
        Returns: undefined;
      };
      admin_update_project: {
        Args: {
          p_body: string;
          p_file_name?: string;
          p_project: string;
          p_status: string;
          p_title: string;
          p_url?: string;
        };
        Returns: undefined;
      };
      admin_verify_payment: {
        Args: { p_confirm: boolean; p_payment: string };
        Returns: undefined;
      };
      is_admin: { Args: never; Returns: boolean };
      request_quote: {
        Args: { p_brief: string; p_key: string; p_service: string };
        Returns: string;
      };
      respond_quote: {
        Args: { p_accept: boolean; p_order: string };
        Returns: undefined;
      };
      submit_payment: {
        Args: { p_order: string; p_provider: string; p_reference: string };
        Returns: string;
      };
    };
    Enums: {
      app_role: "client" | "admin";
      order_status:
        | "draft"
        | "awaiting_payment"
        | "paid"
        | "processing"
        | "completed"
        | "cancelled"
        | "refunded";
      payment_status:
        | "created"
        | "pending"
        | "processing"
        | "paid"
        | "failed"
        | "cancelled"
        | "refunded";
      project_status:
        | "queued"
        | "active"
        | "review"
        | "delivered"
        | "completed"
        | "blocked"
        | "cancelled";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["client", "admin"],
      order_status: [
        "draft",
        "awaiting_payment",
        "paid",
        "processing",
        "completed",
        "cancelled",
        "refunded",
      ],
      payment_status: [
        "created",
        "pending",
        "processing",
        "paid",
        "failed",
        "cancelled",
        "refunded",
      ],
      project_status: [
        "queued",
        "active",
        "review",
        "delivered",
        "completed",
        "blocked",
        "cancelled",
      ],
    },
  },
} as const;
