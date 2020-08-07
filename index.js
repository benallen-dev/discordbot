const Discord = require('discord.js');
const client = new Discord.Client();

let voiceConnection;

// First, let's register a termination handler so we can tidy up after ourselves:
process.on('SIGINT', () => {
  console.log('Termination requested, logging out...');
  client.destroy();
  process.exit();
});

const onNewVoiceConnection = connection => {
  voiceConnection = connection;

  connection.voice.setSelfMute(true);
  connection.on('speaking', (user, speaking) => {
    if (user) {
      console.log(`${user ? user.username : 'A ghost'} ${speaking.has('SPEAKING') ? 'started' : 'stopped'} speaking`);
    }
  });
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  // TODO: Find out if I am in voice channel and join it
});

// Ping
client.on('message', msg => {

});

// Some helpers to get useful info
client.on('message', message => {
  // If the message is "what is my avatar"
  if (message.content === 'what is my avatar') {
    // Send the user's avatar URL
    message.reply(message.author.displayAvatarURL());
  } else if (message.content === 'what is my id') {
    message.reply(message.author.id);
  } else if (message.content.toLowerCase().startsWith('ping')) {
    console.log(`pinged, sending pong to ${message.author.username}`);
    message.reply('pong');
  }
});

client.on('voiceStateUpdate', (oldState, newState) => {
  console.log('voiceStateUpdate');

  if (newState.member.id === '179233155973120001') {
    console.log('OMG ITS BEN!');

    if (!newState.channel && voiceConnection) {
      voiceConnection.disconnect();
      return;
    }

    if (voiceConnection && voiceConnection.channelID !== newState.channelID) {
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

client.login('NzQwNDg0Mjc2OTc3NDAxODU3.XypruQ.PpE6R7_4HH3GhHHD3ptkZP_A3wo');
