declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string;
      NEXT_PUBLIC_BASE_URL: string;
      API_GATEWAY_URL: string;
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PWD: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
