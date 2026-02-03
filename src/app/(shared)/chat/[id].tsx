import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/screen';
import { Avatar } from '../../../components/ui';
import { MessageBubble, ChatInput } from '../../../components/chat';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';
import { Message } from '../../../types/chat';
import { MOCK_CHAT_PARTICIPANT, MOCK_MESSAGES } from '../../../mocks';

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const currentUserId = 'me'; // In real app, get from auth store

  const handleSend = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      chatId: id as string,
      senderId: currentUserId,
      content,
      type: 'text',
      createdAt: new Date(),
      read: false,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble message={item} isOwn={item.senderId === currentUserId} />
  );

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outline },
          ]}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={{ color: theme.colors.primary, fontSize: 24 }}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.participantInfo}>
            <View style={styles.avatarContainer}>
              <Avatar name={MOCK_CHAT_PARTICIPANT.name} size="small" />
              {MOCK_CHAT_PARTICIPANT.isOnline && (
                <View
                  style={[styles.onlineIndicator, { backgroundColor: theme.colors.success }]}
                />
              )}
            </View>
            <View>
              <Text style={[styles.participantName, { color: theme.colors.text }]}>
                {MOCK_CHAT_PARTICIPANT.name}
              </Text>
              <Text style={[styles.status, { color: theme.colors.textMuted }]}>
                {MOCK_CHAT_PARTICIPANT.isOnline ? 'En ligne' : 'Hors ligne'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={{ color: theme.colors.textMuted, fontSize: 20 }}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input */}
        <ChatInput onSend={handleSend} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: SPACING.s,
    marginRight: SPACING.s,
  },
  participantInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.s,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#1a1a2e',
  },
  participantName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  status: {
    ...TYPOGRAPHY.caption,
  },
  menuButton: {
    padding: SPACING.s,
  },
  messagesList: {
    paddingVertical: SPACING.m,
  },
});
