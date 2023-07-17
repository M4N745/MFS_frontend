import { MovieType, ListResponse } from '@custom_types/api';
import { Dict } from '@custom_types/utils';
import { Requests, ApiList } from '@settings';

type FileType = { id: number; url: string } | null;

async function fetchFiles(fileIds: number[]) {
  const fetchPromises = fileIds.map((fileId: number) => {
    const url = `${ApiList.get_file}/${fileId}`;
    return Requests.get(url, { responseType: 'arraybuffer' })
      .then((data) => {
        const fileBlob = new Blob([data as unknown as BlobPart]);
        const fileUrl = URL.createObjectURL(fileBlob);
        return { id: fileId, url: fileUrl };
      })
      .catch(() => null);
  });
  try {
    const files = await Promise.all(fetchPromises);
    return files.filter((file) => file !== null);
  } catch (error) {
    return [];
  }
}

export const moviesFetcher = async ([url, params]: [ApiList, Dict]) => {
  const request: ListResponse = await Requests.get(url, { params });

  const fileIds = request.items.flatMap((item: Dict) => item.cover_id);
  const files = await fetchFiles(fileIds);

  const newData = { ...request };
  const newFiles = newData.items.map((obj: Dict) => {
    const matchingItem = files.find((item: FileType) => item && item.id === obj.cover_id);
    if (matchingItem) {
      return { ...obj, url: matchingItem.url } as MovieType;
    }
    return { ...obj, url: '' } as MovieType;
  });

  return { ...newData, items: newFiles };
};
export const specificMovieFetcher = async (url: string) => {
  const request: MovieType = await Requests.get(url);

  const files = await fetchFiles([request.cover_id]);

  const newData = { ...request };

  return { ...newData, url: files[0]?.url ?? null };
};
