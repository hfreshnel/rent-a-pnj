import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme';
import { Screen } from '../../../components/layout/screen';
import { Avatar, Badge } from '../../../components/ui';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';
import { MOCK_CHAT_LIST, MockChatListItem } from '../../../mocks';

export default function ChatsListScreen() {
  const theme = useTheme();
  const router = useRouter();

  const renderChat = ({ item }: { item: MockChatListItem }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(shared)/chat/${item.id}`)}
      style={[styles.chatItem, { borderBottomColor: theme.colors.outline }]}
    >
      <View style={styles.avatarContainer}>
        <Avatar name={item.participantName} size="medium" />
        {item.isOnline && (
          <View style={[styles.onlineIndicator, { backgroundColor: theme.colors.success }]} />
        )}
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={[styles.participantName, { color: theme.colors.text }]}>
            {item.participantName}
          </Text>
          <Text style={[styles.time, { color: theme.colors.textMuted }]}>
            {item.lastMessageTime}
          </Text>
        </View>
        <View style={styles.chatFooter}>
          <Text
            style={[
              styles.lastMessage,
              {
                color: item.unreadCount > 0 ? theme.colors.text : theme.colors.textMuted,
                fontWeight: item.unreadCount > 0 ? '600' : '400',
              },
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Messages 💬
          </Text>
        </View>

        {/* Chat List */}
        {MOCK_CHAT_LIST.length > 0 ? (
          <FlatList
            data={MOCK_CHAT_LIST}
            renderItem={renderChat}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              Pas de messages
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textMuted }]}>
              Tes conversations apparaîtront ici
            </Text>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: SPACING.l,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#0f0f1a',
  },
  chatInfo: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  participantName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  time: {
    ...TYPOGRAPHY.caption,
  },
  chatFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    ...TYPOGRAPHY.body,
    flex: 1,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: SPACING.s,
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.m,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
  },
});
