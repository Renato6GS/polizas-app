import { useEffect, useState } from 'react';

export const useWatch = ({ watch, id }) => {
  const [isClientExist, setIsClientExist] = useState(false);
  const watchNoCliente = watch(id);
  useEffect(() => {
    async function fetchData() {
      if (watchNoCliente === '') return;
      try {
        const result = await fetch(`/api/queryClientExist?noClient=${watchNoCliente ?? 1}`);
        const res = await result.json();
        const { results } = res;
        const { rowsAffected } = results;
        const [value] = rowsAffected;
        const exist = value !== 0;
        setIsClientExist(exist);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [watchNoCliente]);

  return { isClientExist };
};
