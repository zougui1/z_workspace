interface User {
  name: string;
  password: string;
  passwordValid: boolean;
  email: string;
  loginHistory: LoginActivity[];
  createdAt: Date;
  updatedAt: Date;
  disabledAt: Date;
}

interface LoginActivity {
  date: Date;
  type: 'login';
  succeeded: boolean;
  tokens: SessionToken[];
  platform: UserPlatform;
}

interface UserPlatform {
  type: 'browser' | 'mobile' | 'desktop';
  userAgent: string;
  deviceName?: string;
  platform?: {
    os: string;
    version: string;
  };
}

interface SessionToken {
  token: string;
  disabled: boolean;
  createdAt: Date;
}

interface Role {
  name: string;
}

/**
 * a user can manage only its own music
 * a user cannot even read another user's music
 * an admin can manage everything
 */
