require('dotenv').config();

import { VoiceChannel } from 'discord.js';

import { buildConfig } from './config';
import { initialiseBot, channelToUserList, addSpeakingInfo } from './discord';
import { startWebserver } from './web';

const config = buildConfig();

// Get socketIO connection from webserver
const socket = startWebserver({
  port: config.port,
  startChromium: config.startChromium
});

// Initialise Discord Bot
const bot = initialiseBot({
  userId: config.userId,
  token: config.token
});

// Listen for events from discordbot and send WS packets as appropriate
bot.on('channelchange', (channel) => {
  socket.emit('channelchange', channel ? channelToUserList(channel) : []);
});

bot.on('speakingChange', (event: { speakerId: string; speaking: boolean; channel: VoiceChannel }) => {
  socket.emit('channelchange', addSpeakingInfo(event.channel, event.speakerId, event.speaking));
});
