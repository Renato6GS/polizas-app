import Layout from 'components/Layout/Layout.jsx';
import UpdateForm from 'components/UpdateForm';
import { queryConsultarPoliza } from 'db/queries/queryConsultarPoliza';

export default function Register({ idPoliza, informacionGeneral }) {
  return (
    <Layout>
      <h2 className='title'>Actualización de datos</h2>

      <h2 className='sub-title'>Registro {idPoliza}</h2>

      <p className='description'>Puede editar la siguiente información de la póliza y cliente</p>
      <div className='line-horizontal'></div>

      <UpdateForm idPoliza={idPoliza} informacionGeneral={informacionGeneral} />
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const { id: idPoliza } = params;
  const resPoliza = await queryConsultarPoliza({ idPoliza });
  const { recordset: informacionGeneral } = resPoliza;

  return {
    props: {
      idPoliza,
      informacionGeneral: JSON.stringify(informacionGeneral),
    },
  };
}
