import api from './axios';

export const getUsuario = async () => {
  const repost = await api.get('/usuario');
  return repost.data;
};

export const criarUsuario = async (id: string) => {
  const response = await api.post('/usuario', {
    id,
  });
  return response.data;
}