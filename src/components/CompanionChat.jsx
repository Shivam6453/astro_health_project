// src/components/CompanionChat.jsx

import React, { useState } from 'react';
import { sendCompanionMessage } from '../api/companionApi';

function CompanionChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'yrr kya chal raha hai, bata na aaj ka scene 😄'
    }
  ]);
  const [input, setInput] = useState('');

  async function handleSend(e) {
    e.preventDefault();
    const userText = input.trim();
    if (!userText) return;

    const newHistory = [...messages, { role: 'user', content: userText }];
    setMessages(newHistory);
    setInput('');

    try {
      const reply = await sendCompanionMessage(newHistory);
      setMessages([...newHistory, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="companion-chat">
      <div className="messages">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={m.role === 'user' ? 'msg user' : 'msg bot'}
          >
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="kuch bol yrr..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default CompanionChat;
