const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
  
    // Add user's question to the conversation immediately
    setConversation((prev) => [
      ...prev,
      { role: 'user', content: question }
    ]);
    setQuestion('');
  
    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question }),
      });
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
  
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
  
        // Decode the chunk of data
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
  
        // Update the conversation progressively with the streamed response
        setConversation((prev) => [
          ...prev.filter((msg) => msg.role !== 'assistant'), // Remove the old partial assistant response
          { role: 'assistant', content: fullText }
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };
  