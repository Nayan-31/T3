'use client';

import { useEffect, useRef, useState } from 'react';

// Empty chat mein dikhne wale example questions.
const starters = [
  'Usne bola “I need some space.” Main kya reply karu?',
  'How can I express interest without putting pressure on her?',
  'Humari argument hui thi. Conversation kaise start karu?',
];

export default function Home() {
  // Bookshelf aur selected document ka state.
  const [docs, setDocs] = useState([]);
  const [config, setConfig] = useState(null);
  const [selected, setSelected] = useState('');

  // Current conversation aur message request ka state.
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);

  // Upload aur user feedback ka state.
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const input = useRef(null);
  const bottom = useRef(null);

  // Bookshelf aur configuration status backend se load karo.
  async function refresh() {
    const res = await fetch('/api/documents'),
      data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setDocs(data.documents);
    setConfig(data.configuration);
  }

  useEffect(() => {
    refresh().catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  // Selected PDF backend ko bhejo, phir bookshelf refresh karo.
  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    setNotice('');

    try {
      if (file.size > 25 * 1024 * 1024)
        throw new Error('Choose a PDF smaller than 25 MB.');

      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/documents', { method: 'POST', body: form }),
        data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed. Please retry.');
      await refresh();
      setNotice(
        data.duplicate
          ? 'This PDF is already in your library.'
          : `${data.document.name} is ready. ${data.document.chunks} passages indexed.`,
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  // User message bhejo aur answer ko current conversation mein add karo.
  async function send(event) {
    event.preventDefault();
    if (!draft.trim() || busy) return;

    const message = draft.trim(),
      history = messages.map((m) => ({ role: m.role, content: m.content }));
    setDraft('');
    setBusy(true);
    setError('');
    setMessages((prev) => [...prev, { role: 'user', content: message }]);

    try {
      const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, history, documentId: selected || undefined }),
        }),
        data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not generate a reply.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer,
          sources: data.sources,
          grounded: data.grounded,
        },
      ]);
    } catch (e) {
      setMessages((prev) => prev.slice(0, -1));
      setDraft(message);
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="shell">
      <aside>
        <a className="brand" href="/">
          <span className="logo">r.</span>replyroom<span className="asterisk">✳</span>
        </a>
        <div className="workspace">YOUR PERSONAL SPACE</div>
        <button
          className="new-chat"
          disabled={busy}
          onClick={() => {
            setMessages([]);
            setDraft('');
          }}
        >
          ＋ &nbsp; New conversation
        </button>
        <div className="library-title">
          <h2>Your bookshelf</h2>
          <span>{docs.length}</span>
        </div>
        <p className="muted small">The reading behind your replies.</p>
        <div className="documents">
          {docs.length ? (
            docs.map((doc) => (
              <div className="document" key={doc.id}>
                <span className="pdf">PDF</span>
                <div>
                  <strong title={doc.name}>{doc.name}</strong>
                  <small>
                    {doc.pages} pages · {doc.chunks} passages
                  </small>
                </div>
              </div>
            ))
          ) : (
            <div className="empty">
              <span>▤</span>
              <p>
                A little wisdom goes a long way.
                <br />
                Add your first PDF below.
              </p>
            </div>
          )}
        </div>
        <input
          ref={input}
          hidden
          type="file"
          accept=".pdf,application/pdf"
          onChange={upload}
          disabled={uploading || !config?.ready}
        />
        <button
          className="upload"
          onClick={() => input.current?.click()}
          disabled={uploading || !config?.ready}
        >
          {uploading ? '◌ Reading & indexing…' : '＋ Add a PDF'}
        </button>
        <p className="file-note">Text PDFs · up to 25 MB each</p>
        {uploading && (
          <p className="small" role="status">
            Large books take a few minutes. Keep this tab open.
          </p>
        )}
        <div className="aside-bottom">
          ● &nbsp; Personal library <span>LOCAL</span>
        </div>
      </aside>
      <main>
        <header>
          <div>
            <span className="muted">Your space</span>
            <span className="slash">/</span>Conversation
          </div>
          <span className="language">✦ English + Hinglish</span>
        </header>
        <div className="conversation">
          {!config && !error && (
            <div className="banner" role="status">
              Loading your bookshelf…
            </div>
          )}
          {config && !config.ready && (
            <div className="banner">
              <strong>Connect your library</strong>
              <p>
                Add your chat provider, Mistral embedding and Pinecone settings to{' '}
                <code>.env.local</code>, then restart the app.
              </p>
              <small>Missing: {config.missing.join(', ')}</small>
            </div>
          )}
          {notice && (
            <div className="banner" role="status">
              {notice}
            </div>
          )}
          {error && (
            <div className="banner error" role="alert">
              {error}
              <button onClick={() => setError('')} aria-label="Dismiss error">
                ×
              </button>
            </div>
          )}
          {!messages.length ? (
            <section className="welcome">
              <div className="eyebrow">● &nbsp; A LITTLE CLARITY, BEFORE YOU REPLY</div>
              <h1>
                Good conversations
                <br />
                start with <em>understanding.</em>
              </h1>
              <p className="intro">
                Share what happened. Find a thoughtful way to respond,
                <br className="desktop" /> with perspective from your own reading.
              </p>
              <div className="note">
                <span>✳</span>
                <p>
                  Type how you talk.
                  <br />
                  <strong>Hinglish mein bolo, Hinglish mein jawab milega.</strong>
                </p>
              </div>
              <div className="starter-label">A PLACE TO START</div>
              <div className="starters">
                {starters.map((text, i) => (
                  <button key={text} onClick={() => setDraft(text)}>
                    <span className="number">0{i + 1}</span>
                    <span>{text}</span>
                    <span className="arrow">↗</span>
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <div className="messages" aria-live="polite">
              {messages.map((m, i) => (
                <article className={`message ${m.role}`} key={i}>
                  <div className="message-label">
                    {m.role === 'user' ? 'YOU' : '✳ REPLYROOM'}
                  </div>
                  <div className="message-content">{m.content}</div>
                  {m.sources?.length > 0 && (
                    <details className="sources">
                      <summary>From your bookshelf · {m.sources.length} sources</summary>
                      {m.sources.map((s) => (
                        <div className="source" key={s.number}>
                          <strong>
                            [{s.number}] {s.name} · p. {s.page}
                          </strong>
                          <p>{s.excerpt}</p>
                        </div>
                      ))}
                    </details>
                  )}
                  {m.role === 'assistant' && !m.grounded && (
                    <div className="ungrounded">
                      General guidance · no relevant PDF evidence found
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
          {busy && (
            <div className="thinking" role="status">
              ✳ Looking through your reading and finding the words…
            </div>
          )}
          <div ref={bottom} />
        </div>
        <div className="composer-wrap">
          <form className="composer" onSubmit={send}>
            <label className="sr-only" htmlFor="message">
              Describe your situation
            </label>
            <textarea
              id="message"
              rows={3}
              maxLength={4000}
              value={draft}
              disabled={busy}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Kya hua? Tell me the situation…"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  e.currentTarget.form.requestSubmit();
                }
              }}
            />
            <div className="composer-bottom">
              <label className="scope">
                ▤{' '}
                <select
                  aria-label="Choose reference documents"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  disabled={busy}
                >
                  <option value="">All your reading</option>
                  {docs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="send"
                aria-label="Send message"
                disabled={!config?.ready || !docs.length || busy || !draft.trim()}
              >
                ↑
              </button>
            </div>
          </form>
          <p className="footer-note">
            {!docs.length ? 'Add a PDF to start. ' : ''}Perspective, not mind-reading.
            Every person is different.
          </p>
        </div>
      </main>
    </div>
  );
}
