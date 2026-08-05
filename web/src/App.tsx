import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ArchiveIcon from '@mui/icons-material/Archive';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Container, CssBaseline, IconButton, Stack } from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import {
  ChatBox,
  ChatConversation,
  ChatConversationHeader,
  ChatConversationHeaderActions,
  ChatConversationHeaderInfo,
  ChatConversationSubtitle,
  ChatConversationTitle,
  createEchoAdapter,
} from '@mui/x-chat';
import type {
  ChatAdapter,
  ChatConversation as ChatConversationType,
  ChatMessageChunk,
  ChatStreamEnvelope,
  ConversationHeaderActionsOwnerState,
} from '@mui/x-chat/headless';
import React from 'react';

const GradientHeader = styled('header')(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  color: theme.palette.primary.contrastText,
  '& *': { color: 'inherit' },
}));

function CustomHeader(props: any) {
  return (
    <ChatConversationHeader {...props} slots={{ header: GradientHeader }}>
      <Stack direction="row">
        <ChatConversationHeaderInfo>
          <ChatConversationTitle />
          <ChatConversationSubtitle />
        </ChatConversationHeaderInfo>
        <Box sx={{ flex: 1 }} />
        <ChatConversationHeaderActions slots={{ actions: CustomActions }} />
      </Stack>
    </ChatConversationHeader>
  );
}

const CONVERSATION_ID = 'quickstart';

const initialConversations: ChatConversationType[] = [
  { id: CONVERSATION_ID, title: 'Hector', subtitle: 'Agent' },
];

const initialMessages = [
  {
    id: 'welcome',
    conversationId: CONVERSATION_ID,
    role: 'assistant' as const,
    status: 'sent' as const,
    parts: [
      {
        type: 'text' as const,
        text: 'Hello! Send a message to see a response.',
      },
    ],
  },
];

const adapter = createEchoAdapter();

const customAdapter: ChatAdapter = {
  async sendMessage({ message, signal }) {
    const response = await fetch('http://localhost:8000/llm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: message.parts[0]?.type === 'text' ? message.parts[0].text : '',
      }),
      signal,
    });
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    return new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();

        if (done) {
          console.log('Stream finished');
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer
          .split('\\n')
          .filter((line) => line.trim() !== '')
          .map((line) => line.replace(/[*"]/gm, ''));
        console.log('lines...', lines);

        const messageId = `msg-${Date.now()}`;
        controller.enqueue({ type: 'start', messageId });

        for (let i = 0; i < lines.length; i++) {
          if (i % 2 !== 0) {
            printMessage(controller, '', `space-${i}`);
          }
          printMessage(controller, lines[i], `text-${i}`);
        }
        controller.enqueue({ type: 'finish', messageId });
      },
      // async start(controller) {
      //   const response = await fetch('http://localhost:8000/llm', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       text:
      //         message.parts[0]?.type === 'text' ? message.parts[0].text : '',
      //     }),
      //     signal,
      //   });

      //   const reader = response.body!.getReader();
      //   const decoder = new TextDecoder();

      //   try {
      //     while (true) {
      //       const { done, value } = await reader.read();
      //       if (done) break;
      //       let text = decoder.decode(value, { stream: true });
      //       text = text.replace(/"*/g, '');

      //       let messages: string[] = [text];

      //       // checking if we have break lines in the response
      //       if (text.includes('\\n')) {
      //         const chunks = text.split('\\n');
      //         messages = chunks.map((chunk) =>
      //           chunk.replace(/\\n/g, '').trim()
      //         );
      //       }

      //       for (const message of messages) {
      //         printMessage(controller, message);
      //       }
      //     }
      //   } catch (error) {
      //     // controller.enqueue({ type: 'text-end', id: 'text-1' });
      //     // controller.enqueue({ type: 'abort', messageId });
      //   } finally {
      //     controller.close();
      //   }
      // },
    });
  },
};

const printMessage = (
  controller: ReadableStreamDefaultController<
    ChatMessageChunk | ChatStreamEnvelope
  >,
  message: string,
  messageId: string
) => {
  controller.enqueue({ type: 'text-start', id: messageId });
  controller.enqueue({
    type: 'text-delta',
    id: messageId,
    delta: message,
  });
  controller.enqueue({ type: 'text-end', id: messageId });
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      //default: '#142e4c',
    },
  },
});

const CustomActions = React.forwardRef(function CustomActions(
  props: React.HTMLAttributes<HTMLDivElement> & {
    ownerState?: ConversationHeaderActionsOwnerState;
  },
  ref: React.Ref<HTMLDivElement>
) {
  const { ownerState, ...other } = props;
  if (!ownerState?.hasConversation) {
    return null;
  }
  return (
    <div ref={ref} {...other}>
      <IconButton size="small" aria-label="Archive conversation">
        <ArchiveIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" aria-label="More options">
        <MoreVertIcon fontSize="small" />
      </IconButton>
    </div>
  );
});

const TempHeader = () => {
  return (
    <ChatConversation>
      <CustomHeader>
        <Stack direction="row">
          <ChatConversationHeaderInfo>
            <ChatConversationTitle />
            <ChatConversationSubtitle />
          </ChatConversationHeaderInfo>
          <Box sx={{ flex: 1 }} />
          <ChatConversationHeaderActions slots={{ actions: CustomActions }} />
        </Stack>
      </CustomHeader>
    </ChatConversation>
  );
};

const App = (): React.ReactElement => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ maxWidth: '1000px !important' }}>
        <Box sx={{ height: '100vh' }}>
          <ChatBox
            adapter={customAdapter}
            initialConversations={initialConversations}
            initialActiveConversationId={CONVERSATION_ID}
            initialMessages={initialMessages}
            slots={{ conversationHeader: CustomHeader }}
            sx={{
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
            }}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
