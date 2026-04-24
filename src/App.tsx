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

const initialCells: CellItem[] = [
  {
    id: 1,
    title: '把碎片想法先养起来',
    note: '不要急着分类，让它先在母体里保持微弱活性。',
    tag: '方法',
    time: '刚刚',
    energy: 82,
    x: 22,
    y: 30,
  },
  {
    id: 2,
    title: '桌面入口要像呼吸',
    note: '快速捕捉应该一直在，但不要抢主工作区的注意力。',
    tag: '交互',
    time: '12 分钟前',
    energy: 68,
    x: 58,
    y: 24,
  },
  {
    id: 3,
    title: '整理不是页面，而是浮层',
    note: '详情、归档、合并都应该从母体空间上浮出来。',
    tag: '结构',
    time: '今天 16:20',
    energy: 74,
    x: 42,
    y: 58,
  },
  {
    id: 4,
    title: '细胞之间需要暗线',
    note: '关系感比看板列更重要，像一片正在生成的组织。',
    tag: '视觉',
    time: '今天 15:43',
    energy: 57,
    x: 72,
    y: 64,
  },
];

export function App() {
  const [cells, setCells] = useState<CellItem[]>(initialCells);
  const [selectedCell, setSelectedCell] = useState<CellItem>(initialCells[0]);
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
      x: 34 + (cells.length % 4) * 12,
      y: 38 + (cells.length % 3) * 10,
    };

    setCells((currentCells) => [nextCell, ...currentCells]);
    setSelectedCell(nextCell);
    setCaptureText('');
    setCaptureOpen(false);
  };

  return (
    <main className="cell-shell">
      <section className="workspace" aria-label="Cell 母体空间">
        <header className="topbar">
          <div>
            <p className="eyebrow">Cell / 桌面捕捉原型</p>
            <h1>母体空间</h1>
          </div>
          <div className="status-strip" aria-label="当前状态">
            <span>{cells.length} 个细胞</span>
            <span>{activeCells} 个活跃</span>
            <span>本地原型</span>
          </div>
        </header>

        <div className="organism-field">
          <div className="field-grid" />
          <div className="field-core">
            <span>Cell</span>
          </div>
          {cells.map((cell) => (
            <button
              className={`cell-node ${
                selectedCell.id === cell.id ? 'is-selected' : ''
              }`}
              key={cell.id}
              onClick={() => setSelectedCell(cell)}
              style={
                {
                  '--x': `${cell.x}%`,
                  '--y': `${cell.y}%`,
                  '--energy': `${cell.energy}%`,
                } as CSSProperties
              }
              type="button"
            >
              <span className="cell-node__signal" />
              <span className="cell-node__tag">{cell.tag}</span>
              <strong>{cell.title}</strong>
              <small>{cell.time}</small>
            </button>
          ))}
        </div>
      </section>

      <aside className="detail-layer" aria-label="灵感详情浮层">
        <div className="layer-head">
          <span>详情浮层</span>
          <button type="button">整理</button>
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
      </aside>

      <section
        className={`capture-dock ${captureOpen ? 'is-open' : ''}`}
        aria-label="快速捕捉"
      >
        {captureOpen ? (
          <>
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
          </>
        ) : (
          <button
            className="capture-trigger"
            onClick={() => setCaptureOpen(true)}
            type="button"
          >
            <span>+</span>
            快速捕捉
          </button>
        )}
      </section>
    </main>
  );
}
