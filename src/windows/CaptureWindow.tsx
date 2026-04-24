import { useState } from 'react';

export function CaptureWindow() {
  const [content, setContent] = useState('');

  const submitCapture = () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    window.cellDesktop.submitCapture(trimmedContent);
    setContent('');
  };

  return (
    <main className="capture-shell">
      <header className="capture-header">
        <div>
          <span>Cell 捕捉</span>
          <p>把碎片先存入母体。</p>
        </div>
        <button onClick={window.cellDesktop.openMainWindow} type="button">
          打开母体
        </button>
      </header>

      <section className="capture-console" aria-label="快速捕捉输入">
        <div className="capture-core" aria-hidden="true" />
        <textarea
          autoFocus
          onChange={(event) => setContent(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              submitCapture();
            }
          }}
          placeholder="输入一个想法..."
          value={content}
        />
      </section>

      <footer className="capture-footer">
        <div className="capture-placeholders" aria-label="预留输入方式">
          <button type="button">语音占位</button>
          <button type="button">图片拖入</button>
        </div>
        <button className="store-button" onClick={submitCapture} type="button">
          存入母体
        </button>
      </footer>
    </main>
  );
}
