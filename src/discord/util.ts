import * as Discord from 'discord.js';

export const channelToUserList = (channel: Discord.VoiceChannel) => channel.members.map(
  member => ({
    id:           member.id,
    avatarUrl:    member.user.displayAvatarURL(),
    displayName:  member.displayName,
    speaking:     member.voice.speaking,
    muted:        member.voice.mute || member.voice.selfMute,
    deafened:     member.voice.deaf || member.voice.selfDeaf,
  })
);

export const addSpeakingInfo = (channel: Discord.VoiceChannel, speakerId: string, speaking?: boolean) => channel.members.map(
  member => ({
    id:           member.id,
    avatarUrl:    member.user.displayAvatarURL(),
    displayName:  member.displayName,
    speaking:     member.id === speakerId && speaking,
    muted:        member.voice.mute || member.voice.selfMute,
    deafened:     member.voice.deaf || member.voice.selfDeaf,
  })
);

