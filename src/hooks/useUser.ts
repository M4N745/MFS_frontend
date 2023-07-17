import useSWR from 'swr';
import { isAxiosError } from 'axios';
import { Requests, ApiList } from '@settings';
import { UserResponse } from '@custom_types/api';
import Cookie from 'universal-cookie';

const cookies = new Cookie();

const getToken = () => {
  if (cookies.get('token')) {
    return `Bearer ${cookies.get('token')}`;
  }
  return null;
};

const userFetcher = async (url: string) => {
  try {
    const data = await Requests
      .get<UserResponse>(
      url,
      {
        headers: {
          Authorization: getToken(),
        },
      },
    );
    return data;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 401) {
      return null;
    }
    throw e;
  }
};

export default function useUser() {
  const { data: userInfo, error: userError, mutate } = useSWR(
    getToken() ? ApiList.auth : null,
    userFetcher,
  );

  return {
    userInfo,
    userError,
    mutate,
  };
}
