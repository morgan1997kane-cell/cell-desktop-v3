import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { createCapturedCell, initialCells } from '../shared/cells';
import type { CellItem } from '../shared/cells';

type CellStyle = CSSProperties & {
  '--x': string;
  '--y': string;
  '--energy': string;
};

type DragState = {
  cellId: number;
  pointerId: number;
  didMove: boolean;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function MainWindow() {
  const fieldRef = useRef<HTMLElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const [cells, setCells] = useState<CellItem[]>(initialCells);
  const [selectedCellId, setSelectedCellId] = useState<number | null>(null);
  const [draggingCellId, setDraggingCellId] = useState<number | null>(null);

  const selectedCell = useMemo(
    () => cells.find((cell) => cell.id === selectedCellId) ?? null,
    [cells, selectedCellId],
  );

  const activeCells = useMemo(
    () => cells.filter((cell) => cell.energy >= 65).length,
    [cells],
  );

  useEffect(() => {
    return window.cellDesktop.onCapturedCell((payload) => {
      setCells((currentCells) => {
        const nextCell = createCapturedCell(payload.content, currentCells.length);

        setSelectedCellId(nextCell.id);
        return [nextCell, ...currentCells];
      });
    });
  }, []);

  const updateCellPosition = (cellId: number, clientX: number, clientY: number) => {
    const field = fieldRef.current;

    if (!field) {
      return;
    }

    const rect = field.getBoundingClientRect();
    const nextX = clamp(((clientX - rect.left) / rect.width) * 100, 8, 92);
    const nextY = clamp(((clientY - rect.top) / rect.height) * 100, 12, 88);

    setCells((currentCells) =>
      currentCells.map((cell) =>
        cell.id === cellId ? { ...cell, x: nextX, y: nextY } : cell,
      ),
    );
  };

  const handleCellPointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
    cell: CellItem,
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      cellId: cell.id,
      pointerId: event.pointerId,
      didMove: false,
    };
    setDraggingCellId(cell.id);
    setSelectedCellId(cell.id);
  };

  const handleCellPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    dragState.didMove = true;
    updateCellPosition(dragState.cellId, event.clientX, event.clientY);
  };

  const finishCellDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
    dragStateRef.current = null;
    setDraggingCellId(null);
  };

  const updateSelectedCell = (updater: (cell: CellItem) => CellItem) => {
    if (!selectedCellId) {
      return;
    }

    setCells((currentCells) =>
      currentCells.map((cell) =>
        cell.id === selectedCellId ? updater(cell) : cell,
      ),
    );
  };

  const togglePinned = () => {
    updateSelectedCell((cell) => ({
      ...cell,
      pinned: !cell.pinned,
      status: cell.pinned ? '待整理' : '已固定',
    }));
  };

  const markPending = () => {
    updateSelectedCell((cell) => ({
      ...cell,
      pinned: false,
      status: '待整理',
    }));
  };

  const deleteSelectedCell = () => {
    if (!selectedCellId) {
      return;
    }

    setCells((currentCells) =>
      currentCells.filter((cell) => cell.id !== selectedCellId),
    );
    setSelectedCellId(null);
  };

  return (
    <main className="main-shell">
      <div className="quiet-bar" aria-label="系统状态">
        <span className="quiet-mark">Cell 母体</span>
        <span>{cells.length} cells</span>
        <span>{activeCells} active</span>
      </div>

      <section
        className="organism-field"
        ref={fieldRef}
        aria-label="Cell 母体空间"
      >
        <div className="field-grid" />
        <div className="field-haze" />
        <div className="field-core" aria-hidden="true">
          <span />
        </div>

        {cells.map((cell) => (
          <button
            className={`cell-node ${
              selectedCellId === cell.id ? 'is-selected' : ''
            } ${draggingCellId === cell.id ? 'is-dragging' : ''} ${
              cell.pinned ? 'is-pinned' : ''
            }`}
            key={cell.id}
            onPointerDown={(event) => handleCellPointerDown(event, cell)}
            onPointerMove={handleCellPointerMove}
            onPointerUp={finishCellDrag}
            onPointerCancel={finishCellDrag}
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
              {cell.tag} / {cell.status}
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
              <button onClick={() => setSelectedCellId(null)} type="button">
                收起
              </button>
            </div>
            <h2>{selectedCell.title}</h2>
            <p>{selectedCell.content}</p>
            <div className="meta-panel">
              <div>
                <span>时间</span>
                <strong>{selectedCell.time}</strong>
              </div>
              <div>
                <span>类型</span>
                <strong>{selectedCell.tag}</strong>
              </div>
              <div>
                <span>状态</span>
                <strong>{selectedCell.status}</strong>
              </div>
              <div>
                <span>位置</span>
                <strong>
                  {Math.round(selectedCell.x)} / {Math.round(selectedCell.y)}
                </strong>
              </div>
            </div>
            <div className="inspector-actions" aria-label="整理动作">
              <button onClick={togglePinned} type="button">
                {selectedCell.pinned ? '取消固定' : '固定'}
              </button>
              <button onClick={markPending} type="button">
                标记待整理
              </button>
              <button onClick={deleteSelectedCell} type="button">
                删除
              </button>
            </div>
            <div className="organize-band">
              <span>备注</span>
              <p>{selectedCell.note}</p>
            </div>
          </>
        ) : (
          <span className="inspector-rail">检查器</span>
        )}
      </aside>
    </main>
  );
}
