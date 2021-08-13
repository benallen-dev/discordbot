import * as Discord from 'discord.js';
import { EventEmitter } from 'events';

interface DiscordBotConfig {
  userId: string;
  token: string;
}

export const initialiseBot = (config: DiscordBotConfig) => {
  const client = new Discord.Client();
  let voiceConnection: Discord.VoiceConnection;

  const discordBot = new EventEmitter();

  // First, let's register a termination handler so we can tidy up after ourselves:
  process.on('SIGINT', () => {
    discordBot.emit('logout');
    client.destroy();
    process.exit();
  });

  if (process.env.DISCORD_TOKEN) {
    client.login(config.token);
  } else {
    console.warn("You must provide a .env file containing DISCORD_TOKEN to use the bot");
    process.exit(-1);
  }

  client.on('ready', async () => {
    if (client.user) {
      discordBot.emit('login', client.user);
      console.log(`Logged in as ${client.user.tag}`);
    }

    const channels = client.channels;
    const voiceChannels = channels.cache.filter(channel => channel.type === 'voice');

    debugger;
  });

  // // Some helpers to get useful info
  // client.on('message', message => {
  //   // If the message is "what is my avatar"
  //   if (message.content === 'what is my avatar') {
  //     // Send the user's avatar URL
  //     message.reply(message.author.displayAvatarURL());
  //   } else if (message.content === 'what is my id') {
  //     message.reply(message.author.id);
  //   } else if (message.content.toLowerCase().includes('ping')) {
  //     console.log(`pinged, sending pong to ${message.author.username}`);
  //     message.reply('pong');
  //   }
  // });

  const onNewVoiceConnection = (connection: Discord.VoiceConnection) => {
    if (voiceConnection) {
      voiceConnection.removeAllListeners();
    }

    voiceConnection = connection;

    connection.voice.setSelfMute(true);
    connection.on('speaking', (user, speaking) => {
      if (user) {
        console.log(`${user.username} ${speaking.has('SPEAKING') ? 'started' : 'stopped'} speaking`);
        discordBot.emit('speakingChange', {
          speakerId: user.id,
          speaking: speaking.has('SPEAKING'),
          channel: user.presence.member?.voice.channel
        });
      }
    });
  }

  client.on('voiceStateUpdate', (oldState, newState) => {
    console.log('voiceStateUpdate');

    if (!newState.member) return;

    if (voiceConnection && newState.channel?.id === voiceConnection.channel?.id) {
      discordBot.emit('channelchange', newState.channel);
    }

    if (newState.member.id === config.userId) {
      console.log(`It's me, emitting channelchange event`);
      discordBot.emit('channelchange', newState.channel);

      if (!newState.channel && voiceConnection) {
        voiceConnection.removeAllListeners();
        voiceConnection.disconnect();

        return;
      }

      if (voiceConnection && voiceConnection.channel.id !== newState.channelID) {
        voiceConnection.removeAllListeners();
        voiceConnection.disconnect();
      }

      if (newState.channel) {
        newState.channel.join().then(onNewVoiceConnection);
      }
    }
  });

  return discordBot;
};

export * from './util';