import API from './api';

export const submitQuiz = async ({ score, total }) => {
  const { data } = await API.post('/quiz-results', { score, total });
  return data;
};

export const fetchQuizHistory = async () => {
  const { data } = await API.get('/quiz-results');
  return data;
};
