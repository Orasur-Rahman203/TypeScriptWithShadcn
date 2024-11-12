export interface Config {
  apiUrl: string;

  makeApiUrl: (path: string, base?: string) => string; // updated for multiple url support
}

const apiUrl = "http://localhost:50500";

const config: Config = {
  apiUrl,
  makeApiUrl: (path: string, base: string = apiUrl) => {
    return base + path;
  },
};

export default config;
