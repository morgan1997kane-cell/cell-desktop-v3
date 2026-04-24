export type CellStatus = '待整理' | '生长中' | '已固定';

export type CellItem = {
  id: number;
  title: string;
  content: string;
  note: string;
  tag: string;
  time: string;
  status: CellStatus;
  pinned: boolean;
  energy: number;
  x: number;
  y: number;
};

export const initialCells: CellItem[] = [
  {
    id: 1,
    title: '把碎片想法先养起来',
    content: '把碎片想法先养起来，不要急着分类。',
    note: '不要急着分类，让它先在母体里保持微弱活性。',
    tag: '方法',
    time: '刚刚',
    status: '生长中',
    pinned: false,
    energy: 82,
    x: 24,
    y: 33,
  },
  {
    id: 2,
    title: '入口要像呼吸',
    content: '快速捕捉一直在场，但不打断母体空间。',
    note: '快速捕捉一直在场，但不打断母体空间。',
    tag: '交互',
    time: '12 分钟前',
    status: '待整理',
    pinned: false,
    energy: 68,
    x: 61,
    y: 26,
  },
  {
    id: 3,
    title: '整理从场域上浮',
    content: '详情和归纳应当像检查器，而不是新页面。',
    note: '详情和归纳应当像检查器，而不是新页面。',
    tag: '结构',
    time: '今天 16:20',
    status: '生长中',
    pinned: true,
    energy: 74,
    x: 44,
    y: 61,
  },
  {
    id: 4,
    title: '细胞之间需要暗线',
    content: '关系感比列表更重要，像正在生成的组织。',
    note: '关系感比列表更重要，像正在生成的组织。',
    tag: '视觉',
    time: '今天 15:43',
    status: '待整理',
    pinned: false,
    energy: 57,
    x: 75,
    y: 58,
  },
];

export const createCapturedCell = (content: string, index: number): CellItem => {
  const title = content.length > 22 ? `${content.slice(0, 22)}...` : content;

  return {
    id: Date.now(),
    title,
    content,
    note: '来自捕捉窗口，尚未整理。',
    tag: '捕捉',
    time: '刚刚',
    status: '待整理',
    pinned: false,
    energy: 62,
    x: 28 + (index % 5) * 11,
    y: 34 + (index % 4) * 9,
  };
};
