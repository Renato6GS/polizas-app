/* eslint-disable indent */
import { queryConsultarPoliza } from 'db/queries/queryConsultarPoliza';
import Layout from 'components/Layout/Layout';

import ViewPolicy from 'components/ViewPolicy';

export default function Policy({ idPoliza, informacionGeneral }) {
  return (
    <Layout>
      <ViewPolicy
        informacionGeneral={informacionGeneral}
        idPoliza={idPoliza}
        title={'Póliza'}
        subTitle={'Póliza No. '}
        description={'Toda la información sobre esta póliza la puede encontrar aquí.'}
      />
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
