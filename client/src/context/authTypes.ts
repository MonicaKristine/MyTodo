export type User = {
  id: number;
  email: string;
  name: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};
