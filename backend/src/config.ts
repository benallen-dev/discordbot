interface BotConfig {
  token: string;
  userId: string;
  startChromium: boolean;
  port: number;
}

export const buildConfig = () => {
  if (
    !process.env.DISCORD_TOKEN ||
    !process.env.USER_ID
  ) {
    throw new Error('You must provide DISCORD_TOKEN and USER_ID in .env');
  }

  const token = process.env.DISCORD_TOKEN;
  const userId = process.env.USER_ID;

  const startChromium = process.env.START_CHROMIUM === 'true' ? true : false;
  const port = (process.env.WEB_PORT && !isNaN(parseInt(process.env.WEB_PORT))) ? parseInt(process.env.WEB_PORT) : 3000;

  const config: BotConfig = {
    token,
    userId,
    startChromium,
    port
  };

  return config;
};