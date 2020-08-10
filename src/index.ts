require('dotenv').config();

import * as Discord from 'discord.js';

// const clientOptions: Discord.ClientOptions = {
//   ws: {
//     intents: [Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_VOICE_STATES]
//   }
// }

const client = new Discord.Client();
let voiceConnection: Discord.VoiceConnection;

if (
  !process.env.DISCORD_TOKEN ||
  !process.env.USER_ID
) {
  throw new Error('You must provide DISCORD_TOKEN and USER_ID in .env');
}

const config = {
  token: process.env.DISCORD_TOKEN,
  userId: process.env.USER_ID
}

// First, let's register a termination handler so we can tidy up after ourselves:
process.on('SIGINT', () => {
  console.log('\nTermination requested, logging out...\n');
  client.destroy();
  process.exit();
});

const onNewVoiceConnection = (connection: Discord.VoiceConnection) => {
  voiceConnection = connection;

  connection.voice.setSelfMute(true);
  connection.on('speaking', (user, speaking) => {
    if (user) {
      console.log(`${user.username} ${speaking.has('SPEAKING') ? 'started' : 'stopped'} speaking`);
    }
  });
}

client.on('ready', async () => {
  if (client.user) {
    console.log(`Logged in as ${client.user.tag}`);
  }

  const fetchedUser = await client.users.fetch(config.userId);

  console.log({ fetchedUser });

  // const guilds = client.guilds;
  // const channels = guilds.cache.map(guild => guild.channels).filter();
  // console.log(channels);

  const channels = client.channels;
  const voiceChannels = channels.cache.filter(channel => channel.type === 'voice');
  console.log(voiceChannels);
});

// Some helpers to get useful info
client.on('message', message => {
  // If the message is "what is my avatar"
  if (message.content === 'what is my avatar') {
    // Send the user's avatar URL
    message.reply(message.author.displayAvatarURL());
  } else if (message.content === 'what is my id') {
    message.reply(message.author.id);
  } else if (message.content.toLowerCase().includes('ping')) {
    console.log(`pinged, sending pong to ${message.author.username}`);
    message.reply('pong');
  }
});

client.on('voiceStateUpdate', (oldState, newState) => {
  console.log('voiceStateUpdate');

  if (!newState.member) return;

  if (voiceConnection && newState.channel?.id === voiceConnection.channel?.id) {
    // this is a user doin shit in the same channel as us
    console.log({
      old: oldState.toJSON(),
      new: newState.toJSON()
    });
  }

  if (newState.member.id === config.userId) {
    console.log('OMG ITS BEN!');

    console.log({newState});
    if (!newState.channel && voiceConnection) {
      voiceConnection.disconnect();
      return;
    }

    if (voiceConnection && voiceConnection.channel.id !== newState.channelID) {
      voiceConnection.disconnect();
    }

    if (newState.channel) {
      // Just connect
      newState.channel.join().then(onNewVoiceConnection);
    }
  }

  // My ID is 179233155973120001

  // If not in same voice channel as me, do nothing
  // Otherwise, we want to catch and do stuff for certain events:

  // - User joins channel
  // - User leaves channel
  // - User is muted
  // - User is unmuted
  // - User is deafened
  // basically everything in newState needs to be pushed to FE
});

if (process.env.DISCORD_TOKEN) {
  client.login(config.token);
} else {
  console.warn("You must provide a .env file containing DISCORD_TOKEN to use the bot");
}

