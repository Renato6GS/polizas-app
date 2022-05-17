import React from 'react';

export default function Policy({ results }) {
  return (
    <div>
      <h1>hola policy {results}</h1>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  // const results = await getDetail({ id });

  return {
    props: {
      results: id,
    },
  };
}
