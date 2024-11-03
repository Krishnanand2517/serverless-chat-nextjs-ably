import { FormEvent, KeyboardEvent, useEffect, useState } from "react";
import { Message } from "ably";
import { useChannel } from "ably/react";
import styles from "./ChatBox.module.css";

export default function ChatBox() {
  const [messageText, setMessageText] = useState<string>("");
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);

  const messageTextIsEmpty = messageText.trim().length === 0;

  let inputBox: HTMLTextAreaElement | null;
  let messageEnd: HTMLDivElement | null;

  useEffect(() => {
    messageEnd?.scrollIntoView({ behavior: "smooth" });
  });

  const { channel, ably } = useChannel(
    "serverless-chat-nextjs-ably",
    (message) => {
      const history = receivedMessages.slice(-199);
      setReceivedMessages([...history, message]);
    }
  );

  const sendChatMessage = (messageText: string) => {
    channel.publish({ name: "chat-message", data: messageText });
    setMessageText("");
    inputBox?.focus();
  };

  const handleFormSubmission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (messageText) sendChatMessage(messageText);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.charCode !== 13 || messageTextIsEmpty) return;

    if (messageText) sendChatMessage(messageText);

    event.preventDefault();
  };

  const messages = receivedMessages.map((message, index) => {
    const author = message.connectionId === ably.connection.id ? "me" : "other";

    return (
      <span key={index} className={styles.message} data-author={author}>
        {message.data}
      </span>
    );
  });

  return (
    <div className={styles.chatHolder}>
      <div className={styles.chatText}>
        {messages}
        <div
          ref={(element) => {
            messageEnd = element;
          }}
        ></div>
      </div>

      <form onSubmit={handleFormSubmission} className={styles.form}>
        <textarea
          ref={(element) => {
            inputBox = element;
          }}
          value={messageText}
          placeholder="Type a message..."
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.textarea}
        ></textarea>

        <button
          type="submit"
          className={styles.button}
          disabled={messageTextIsEmpty}
        >
          Send
        </button>
      </form>
    </div>
  );
}
