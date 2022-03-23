import { Chat } from "../../components/Chat/Chat";
import { ChatList } from "../../components/ChatsList/ChatsList";

export function ChatContainer() {
  return (
    <>
      {window.innerWidth < 1024 ? (
        <main>
          <ChatList />
        </main>
      ) : (
        <>
          <ChatList />
          <Chat type="new" />
        </>
      )}
    </>
  );
}
