export interface Group {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  is_private: boolean;
} 