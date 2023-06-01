import { EncounterDatabase } from 'data/storage';

export interface PageProps {
  data: EncounterDatabase;
}

export const randomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const createAggStringList = (list: string[]) => {
  const agg = list.reduce(
    (arr, templateId) => {
      const obj = arr.find(t => t.id === templateId);
      if (obj) {
        obj.count++;
        return arr;
      }
      arr.push({
        id: templateId,
        count: 1,
      });
      return arr;
    },
    [] as {
      id: string;
      count: number;
    }[]
  );
  return agg;
};

export const sortByDate = (
  a: unknown & { lastUpdated: number },
  b: unknown & { lastUpdated: number }
) => {
  return a.lastUpdated < b.lastUpdated ? 1 : -1;
};

export const downloadObjectAsJson = (exportObj: Object, exportName: string) => {
  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(exportObj));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName + '.json');
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};
