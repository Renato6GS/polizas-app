import React from 'react';

export default function Checklog({ results }) {
  return (
    <div>
      <h1>hola Checklog {results}</h1>
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
