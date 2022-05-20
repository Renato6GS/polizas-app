import { useMemo } from 'react';
import Layout from 'components/Layout/Layout';
import React from 'react';
import { useTable } from 'react-table';
import Link from 'next/link';

import styles from './styles.module.css';
import { queryListadoArchivadores } from 'db/queries/queryListadoArchivadores';
import { sendToEjecutivoWithoutData } from 'db/emails/sendToEjecutivo';
import { ARCHIVADO } from 'constants/processStates';

export default function Archivador({ results }) {
  // Con el memo nos aseguramos que solo se renderice una sola vez entre renderizados
  const handleClickArchivar = async (idPoliza) => {
    console.log(idPoliza);

    try {
      // Actualizamos bitácora con el estado "archivado"
      await fetch('/api/updateCheckLog', {
        body: JSON.stringify({
          idEstadoDelProceso: ARCHIVADO,
          comentario: 'El documento ha sido archivado correctamente. (generado automáticamente)',
          idPoliza,
          editadoPor: 'ARC-4',
          usuario: 'renato',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      // Guardamos la fecha de archivado en la tabla pólizas
      await fetch(`/api/insertAssignArchivedDate?idPoliza=${idPoliza}`);

      // Guardamos el id del archivador dentro de la póliza:
      await fetch(`/api/insertAssignArchivist?idPoliza=${idPoliza}&idArchivador=3`);

      // Enviamos correo
      await sendToEjecutivoWithoutData({ idPoliza });
      alert('Archivado correctamente');
    } catch (error) {
      alert('No se pudo archivar');
      console.error(error);
    }
  };

  const resultsParse = JSON.parse(results);
  const data = useMemo(
    () =>
      resultsParse.map((element) => {
        return {
          col1: element['id_poliza'],
          col2: element['no_cliente'],
          col3: element['fec_creacion'].slice(0, 10),
          col4: element['desc_documento'],
          col5: element['id_ejecutivo_de_cuenta'],
          col6: element['ultimo_editor'],
          col7: (
            <Link href={`/checklog/${element['id_poliza']}`}>
              <a className='btn btn-empty'>Ver bitácora</a>
            </Link>
          ),
          col8: (
            <button className='btn' onClick={() => handleClickArchivar(element['id_poliza'])}>
              Archivar
            </button>
          ),
        };
      }),
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Poliza',
        accessor: 'col1', // accessor is the "key" in the data
      },
      {
        Header: 'No. Cliente',
        accessor: 'col2',
      },
      {
        Header: 'Fec. de Creación',
        accessor: 'col3',
      },
      {
        Header: 'Tipo de doc.',
        accessor: 'col4',
      },
      {
        Header: 'Ejecutivo de cuenta',
        accessor: 'col5',
      },
      {
        Header: 'Último editor',
        accessor: 'col6',
      },
      {
        Header: 'Bitácora',
        accessor: 'col7',
      },
      {
        Header: 'Póliza',
        accessor: 'col8',
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <Layout>
      <h2 className='title'>Panel Archivador</h2>
      <h2 className='sub-title'>Listado de pólizas esperando a ser archivadas</h2>
      <p className='description'>
        Revise el siguiente listado de pólizas a ser archivadas. Una vez archivadas, se terminará el proceso para el
        documento y se informará al ejecutivo de cuenta por correo.
      </p>
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
  const res = await queryListadoArchivadores();
  const { recordset } = res;

  return {
    props: {
      results: JSON.stringify(recordset),
    },
  };
}
