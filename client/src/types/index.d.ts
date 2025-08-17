interface Creation {
  id: number;
  user_id: string;
  prompt: string;
  content: string;
  type: string;
  publish: boolean;
  likedBy: never[];
  createdAt: string;
  updatedAt: string;
}

interface SidebarProps {
  sidebar: boolean;
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}
interface Community {
  id: number;
  userId: string;
  prompt: string;
  content: string;
  type: string;
  publish: boolean;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
}
