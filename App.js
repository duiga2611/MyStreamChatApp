import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { Chat, OverlayProvider, ChannelList,Channel,MessageList,MessageInput} from 'stream-chat-expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useChatClient } from './useChatClient';
import { StreamChat } from 'stream-chat';
import { chatApiKey, chatUserId } from './chatConfig';
import { AppProvider } from "./AppContext";
import {useAppContext} from "./AppContext"

const Stack = createStackNavigator();

const filters = {
  members: {
    '$in': [chatUserId]
  },
};

const sort = {
  last_message_at: -1,
};

const ChannelListScreen = props => {
  const { setChannel } = useAppContext();
  return (
    <ChannelList
    onSelect={(channel) => {
      const { navigation } = props;
      setChannel(channel);
      navigation.navigate('ChannelScreen');
    }}
      filters={filters}
      sort={sort}
    />
  );
};

const ChannelScreen = props => {
  const { channel } = useAppContext();
  return (
    <Channel channel={channel}>
      <MessageList />
      <MessageInput />
    </Channel>
  );
}

const chatClient = StreamChat.getInstance(chatApiKey);

const NavigationStack = () => {
  const { clientIsReady } = useChatClient();

  if (!clientIsReady) {
    return <Text>Loading chat ...</Text>
  }
  return (
    <OverlayProvider>
      <Chat client={chatClient}>
        <Stack.Navigator>
          <Stack.Screen name="ChannelList" component={ChannelListScreen} />
          <Stack.Screen name="ChannelScreen" component={ChannelScreen} />
        </Stack.Navigator>
      </Chat>
    </OverlayProvider>
  );
};

export default () => {
  return (
    <AppProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <NavigationStack />
      </NavigationContainer>
    </SafeAreaView>
    </GestureHandlerRootView>
    </AppProvider>
  );
};
