import { useMemo } from 'react';
import Layout from 'components/Layout/Layout.jsx';
import { useTable } from 'react-table';
import { queryConsultarTodasLasPolizas } from 'db/queries/queryConsultarTodasLasPolizas';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home({ results }) {
  const resultsParse = JSON.parse(results);
  const data = useMemo(
    () =>
      resultsParse.map((element) => {
        return {
          col1: element['id_poliza'],
          col2: element['no_cliente'],
          col3: element['fecha_de_creacion_poliza'].slice(0, 10),
          col4: element['numero_aseguradora_poliza'],
          col5: element['desc_estado_del_proceso'],
          col6: (
            <Link href={`/checklog/${element['id_poliza']}`}>
              <a className='btn btn-empty'>Ver bitácora</a>
            </Link>
          ),
          col7: (
            <Link href={`/policy/${element['id_poliza']}`}>
              <a className='btn'>Ver póliza</a>
            </Link>
          ),
        };
      }),
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Poliza',
        accessor: 'col1',
      },
      {
        Header: 'No. Cliente',
        accessor: 'col2',
      },
      {
        Header: 'Fec. de creación',
        accessor: 'col3',
      },
      {
        Header: 'No. Aseguradora.',
        accessor: 'col4',
      },
      {
        Header: 'Esatdo',
        accessor: 'col5',
      },
      {
        Header: 'Bitácora',
        accessor: 'col6',
      },
      {
        Header: 'Póliza',
        accessor: 'col7',
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <Layout>
      <h2 className='title'>Bienvenido al control de pólizas</h2>
      <h2 className='sub-title'>Lista de todas las pólizas</h2>
      <div className='line-horizontal'></div>
      <table {...getTableProps()} className={styles.table}>
        <thead>
          {headerGroups.map((headerGroup, id) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={`tr-header-${id}`}>
              {headerGroup.headers.map((column, id) => (
                <th className={styles.th} key={`th-header-${id}`} {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, id) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={`row-${id}`}>
                {row.cells.map((cell, id) => {
                  return (
                    <td {...cell.getCellProps()} key={`td-${id}`} className={styles.td}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Layout>
  );
}

export async function getServerSideProps() {
  const res = await queryConsultarTodasLasPolizas();
  const { recordset } = res;

  return {
    props: {
      results: JSON.stringify(recordset),
    },
  };
}
