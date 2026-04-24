import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { createCapturedCell, initialCells } from '../shared/cells';
import type { CellItem } from '../shared/cells';

type CellStyle = CSSProperties & {
  '--x': string;
  '--y': string;
  '--energy': string;
};

export function MainWindow() {
  const [cells, setCells] = useState<CellItem[]>(initialCells);
  const [selectedCell, setSelectedCell] = useState<CellItem | null>(null);

  const activeCells = useMemo(
    () => cells.filter((cell) => cell.energy >= 65).length,
    [cells],
  );

  useEffect(() => {
    return window.cellDesktop.onCapturedCell((payload) => {
      setCells((currentCells) => {
        const nextCell = createCapturedCell(payload.content, currentCells.length);

        setSelectedCell(nextCell);
        return [nextCell, ...currentCells];
      });
    });
  }, []);

  return (
    <main className="main-shell">
      <div className="quiet-bar" aria-label="系统状态">
        <span className="quiet-mark">Cell 母体</span>
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
              <span>检查器</span>
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
          <span className="inspector-rail">检查器</span>
        )}
      </aside>
    </main>
  );
}
