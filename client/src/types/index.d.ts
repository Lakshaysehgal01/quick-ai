interface Creation {
  id: number;
  user_id: string;
  prompt: string;
  content: string;
  type: string;
  publish: boolean;
  likes: never[];
  created_at: string;
  updated_at: string;
}

interface SidebarProps {
  sidebar: boolean;
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Community {
  id: number;
  user_id: string;
  prompt: string;
  content: string; // ← this will now correctly accept the imported PNG
  type: string;
  publish: boolean;
  likes: string[];
  created_at: string;
  updated_at: string;
}
