import Layout from 'components/Layout/Layout';
import { useRouter } from 'next/router';

import styles from './styles.module.css';
import { queryConsultarBitacora } from 'db/queries/queryConsultarBitacora';
import { queryConsultarPoliza } from 'db/queries/queryConsultarPoliza';
import FieldReport from 'components/FieldReport';

export default function Checklog({ idPoliza, results, informacionGeneral }) {
  const router = useRouter();
  const resultsParse = JSON.parse(results);
  const {
    no_cliente,
    fecha_de_creacion_poliza,
    creador_por_poliza,
    nombre_cliente,
    apellidos_cliente,
    email_cliente,
    numero_aseguradora_poliza,
    numero_aseguradora_endoso_poliza,
    documento_aprobado,
    numero_solicitud_numero_endoso_en_acs_poliza: acs,
    asunto_del_endoso,
    desc_documento,
    desc_aseguradora,
    desc_grupo_economico,
    desc_ramo_de_seguro,
    revision_snc_poliza,
    req_de_cobro_poliza,
  } = JSON.parse(informacionGeneral)[0];

  const handleGoBack = () => router.back();

  return (
    <Layout>
      <h2 className='title'>Bitácora</h2>
      <h2 className='sub-title'>Bitácora de {idPoliza}</h2>
      <div className={styles.subtitleContainer}>
        <p className='description'>
          Con esta bitácora podrá conocer com ova el proceso de la póliza y como ha ido cambiando de esatdo, además de
          conocer quien ha efectuado cambios y cuando sucedió.
        </p>
        <button className='btn btn-empty' onClick={handleGoBack}>
          Regresar
        </button>
      </div>
      <div className='line-horizontal'></div>

      <h2 className={styles.subTitle}>INFORMACIÓN GENERAL:</h2>
      <section className='result-fields-section'>
        <FieldReport label={'No. cliente'} description={no_cliente} />
        <FieldReport label={'Fecha de creación'} description={fecha_de_creacion_poliza.slice(0, 10)} />
        <FieldReport label={'Registrado por'} description={creador_por_poliza} />
        <FieldReport label={'Nombre cliente'} description={nombre_cliente} />
        <FieldReport label={'Apellidos cliente'} description={apellidos_cliente} />
        <FieldReport label={'Email del cliente'} description={email_cliente} />
        <FieldReport label={'No. de póliza'} description={numero_aseguradora_poliza} />
        <FieldReport label={'Documento aprobado'} description={documento_aprobado} />
        <FieldReport label={'Tipo de documento'} description={desc_documento} />
        <FieldReport label={'No. endoso aseguradora'} description={numero_aseguradora_endoso_poliza ?? '---'} />
        <FieldReport label={'No. No. Solicitud / No. Endoso en ACS'} description={acs ?? '---'} />
        <FieldReport label={'Asunto del endoso'} description={asunto_del_endoso ?? '---'} />
        <FieldReport label={'Aseguradora'} description={desc_aseguradora} />
        <FieldReport label={'Ramo de seguro'} description={desc_ramo_de_seguro} />
        <FieldReport label={'Grupo económico'} description={desc_grupo_economico} />
        <FieldReport label={'Revisión snc'} description={revision_snc_poliza ?? '---'} />
        <FieldReport label={'Req. de cobro'} description={req_de_cobro_poliza ?? '---'} />
      </section>

      <div className='line-horizontal'></div>

      {/* bitácora */}
      {resultsParse.map((el, id) => {
        const {
          comentario_bitacora: comentario,
          editado_por_bitacora,
          fecha_de_actualizacion_bitacora: fecha,
          hora_commit: hora,
          desc_estado_del_proceso: estado_proceso,
        } = el;
        return (
          <section key={`esatdo${id}`} className='result-fields-section'>
            <h3 className={styles.labelTitle}>{`Estado ${id + 1}`}</h3>
            <FieldReport label={'Estado'} description={estado_proceso} />
            <FieldReport label={'Editado por'} description={editado_por_bitacora} />
            <FieldReport label={'Fecha de actualización'} description={fecha.slice(0, 10)} />
            <FieldReport label={'Hora de actualización'} description={hora.slice(11, 19)} />
            <FieldReport label={'Comentario'} description={comentario ?? 'Sin comentarios'} />
            <div className='line-horizontal'></div>
          </section>
        );
      })}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const { id: idPoliza } = params;
  const res = await queryConsultarBitacora({ idPoliza });
  const { recordset } = res;
  const resPoliza = await queryConsultarPoliza({ idPoliza });
  const { recordset: informacionGeneral } = resPoliza;

  return {
    props: {
      idPoliza,
      results: JSON.stringify(recordset),
      informacionGeneral: JSON.stringify(informacionGeneral),
    },
  };
}
