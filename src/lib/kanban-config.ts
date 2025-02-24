export const BoardConfig = { title: { max: 50, min: 1 } } as const;

export const ColumnConfig = { title: { max: 50, min: 1 } } as const;

export const TaskConfig = {
  title: { max: 100, min: 1 },
  desc: { max: 1000 },
} as const;
