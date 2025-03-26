type DataItem = {
  label: string;
  total_population: number;
  percentage?: string;
};

const calculatePercentage = (items: DataItem[]): DataItem[] => {
  const total = items.reduce((sum, item) => sum + item.total_population, 0);
  return items.map((item) => ({
    ...item,
    percentage: ((item.total_population / total) * 100).toFixed(2) + "%",
  }));
};

export default calculatePercentage;
