import React from 'react';

import { VoiceList } from './components/voicelist';
import { UserProps } from './components/user';
import { socket } from './service/socket';

function App() {
  const [ voiceUsersState, setVoiceUsersState ] = React.useState<UserProps[]>([]);

  React.useEffect(() => {
    socket.on('channelchange', (voiceUsers: UserProps[]) => {
      setVoiceUsersState(voiceUsers);
    });
  }, []);

  return <VoiceList users={voiceUsersState} />;
}

export default App;
