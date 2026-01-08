import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3001");
function App() {
  const [text, setText] = useState("");
  useEffect(() => {
    socket.on("load-document", (content) => {
      setText(content);
    });
    socket.on("receive-changes", (content) => {
      setText(content);
    });
    return () => {
      socket.off("load-document");
      socket.off("receive-changes");
    };
  }, []);
  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    socket.emit("send-changes", value);
  };
  return (
    <div style={{ padding: "20px" }}>
      <h2>📝 Real-Time Collaborative Editor</h2>
      <textarea
        value={text}
        onChange={handleChange}
        rows={12}
        cols={80}
      />
    </div>
  );
}
export default App;
