export interface ServerOptions {
  open?: boolean;
  port?: number;
}
export interface UserConfig {
  server?: ServerOptions;
}

export const defineConfig = (config: UserConfig): UserConfig => {
  return config;
};

export const initConfig = defineConfig({
  server: {
    port: 8888,
  },
});
