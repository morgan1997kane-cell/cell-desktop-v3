import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

type CellItem = {
  id: number;
  title: string;
  note: string;
  tag: string;
  time: string;
  energy: number;
  x: number;
  y: number;
};

type CellStyle = CSSProperties & {
  '--x': string;
  '--y': string;
  '--energy': string;
};

const initialCells: CellItem[] = [
  {
    id: 1,
    title: '把碎片想法先养起来',
    note: '不要急着分类，让它先在母体里保持微弱活性。',
    tag: '方法',
    time: '刚刚',
    energy: 82,
    x: 24,
    y: 33,
  },
  {
    id: 2,
    title: '入口要像呼吸',
    note: '快速捕捉一直在场，但不打断母体空间。',
    tag: '交互',
    time: '12 分钟前',
    energy: 68,
    x: 61,
    y: 26,
  },
  {
    id: 3,
    title: '整理从场域上浮',
    note: '详情和归纳应当像检查器，而不是新页面。',
    tag: '结构',
    time: '今天 16:20',
    energy: 74,
    x: 44,
    y: 61,
  },
  {
    id: 4,
    title: '细胞之间需要暗线',
    note: '关系感比列表更重要，像正在生成的组织。',
    tag: '视觉',
    time: '今天 15:43',
    energy: 57,
    x: 75,
    y: 58,
  },
];

export function App() {
  const [cells, setCells] = useState<CellItem[]>(initialCells);
  const [selectedCell, setSelectedCell] = useState<CellItem | null>(null);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [captureText, setCaptureText] = useState('');

  const activeCells = useMemo(
    () => cells.filter((cell) => cell.energy >= 65).length,
    [cells],
  );

  const handleCapture = () => {
    const trimmedText = captureText.trim();

    if (!trimmedText) {
      setCaptureOpen(false);
      return;
    }

    const nextCell: CellItem = {
      id: Date.now(),
      title: trimmedText,
      note: '还没有整理，先进入母体空间保持活性。',
      tag: '捕捉',
      time: '刚刚',
      energy: 61,
      x: 28 + (cells.length % 5) * 11,
      y: 34 + (cells.length % 4) * 9,
    };

    setCells((currentCells) => [nextCell, ...currentCells]);
    setSelectedCell(nextCell);
    setCaptureText('');
    setCaptureOpen(false);
  };

  return (
    <main className="cell-shell">
      <div className="quiet-bar" aria-label="系统状态">
        <span className="quiet-mark">Cell</span>
        <span>{cells.length} cells</span>
        <span>{activeCells} active</span>
      </div>

      <section className="organism-field" aria-label="Cell 母体空间">
        <div className="field-grid" />
        <div className="field-haze" />
        <div className="field-core" aria-hidden="true">
          <span />
        </div>

        {cells.map((cell) => (
          <button
            className={`cell-node ${
              selectedCell?.id === cell.id ? 'is-selected' : ''
            }`}
            key={cell.id}
            onClick={() => setSelectedCell(cell)}
            style={
              {
                '--x': `${cell.x}%`,
                '--y': `${cell.y}%`,
                '--energy': `${cell.energy}%`,
              } as CellStyle
            }
            type="button"
          >
            <span className="cell-node__signal" />
            <strong>{cell.title}</strong>
            <small>
              {cell.tag} / {cell.time}
            </small>
          </button>
        ))}
      </section>

      <aside
        className={`detail-layer ${selectedCell ? 'is-open' : ''}`}
        aria-label="灵感检查器"
      >
        {selectedCell ? (
          <>
            <div className="layer-head">
              <span>Inspector</span>
              <button onClick={() => setSelectedCell(null)} type="button">
                关闭
              </button>
            </div>
            <h2>{selectedCell.title}</h2>
            <p>{selectedCell.note}</p>
            <div className="meta-panel">
              <div>
                <span>能量</span>
                <strong>{selectedCell.energy}%</strong>
              </div>
              <div>
                <span>类型</span>
                <strong>{selectedCell.tag}</strong>
              </div>
              <div>
                <span>时间</span>
                <strong>{selectedCell.time}</strong>
              </div>
            </div>
            <div className="organize-band">
              <span>整理建议</span>
              <p>保留为母体节点，等待更多关联想法后再合并。</p>
            </div>
          </>
        ) : (
          <span className="inspector-rail">Inspector</span>
        )}
      </aside>

      <section
        className={`capture-dock ${captureOpen ? 'is-open' : ''}`}
        aria-label="快速捕捉"
      >
        {captureOpen ? (
          <div className="capture-terminal">
            <div className="capture-pulse" />
            <textarea
              autoFocus
              onChange={(event) => setCaptureText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                  handleCapture();
                }
              }}
              placeholder="捕捉一个正在发光的碎片..."
              value={captureText}
            />
            <div className="capture-actions">
              <button onClick={() => setCaptureOpen(false)} type="button">
                收起
              </button>
              <button onClick={handleCapture} type="button">
                存入母体
              </button>
            </div>
          </div>
        ) : (
          <button
            className="capture-trigger"
            onClick={() => setCaptureOpen(true)}
            type="button"
          >
            <span className="capture-orb" />
            <span className="capture-label">快速捕捉</span>
          </button>
        )}
      </section>
    </main>
  );
}
