import FieldReport from 'components/FieldReport';
import React from 'react';
import { calculateAge } from 'utils/calculateAge';
import { useRouter } from 'next/router';

import styles from './styles.module.css';

export default function ViewPolicy({ informacionGeneral, idPoliza, title, subTitle, description }) {
  const router = useRouter();
  const {
    no_cliente,
    fecha_de_creacion_poliza,
    creador_por_poliza,
    nombre_cliente,
    apellidos_cliente,
    fecha_de_nacimiento_cliente: fecNac,
    email_cliente,
    desc_sexo,
    telefonos,
    numero_aseguradora_poliza,
    numero_aseguradora_endoso_poliza,
    numero_solicitud_numero_endoso_en_acs_poliza: acs,
    desc_documento,
    asunto_del_endoso,
    desc_aseguradora,
    desc_ramo_de_seguro,
    desc_grupo_economico,
    precio_poliza,
  } = JSON.parse(informacionGeneral)[0];
  const { age } = calculateAge({ date: fecNac });

  const handleGoBack = () => router.back();

  return (
    <>
      <h2 className='title'>{title}</h2>
      <h2 className='sub-title'>
        {subTitle} {idPoliza}
      </h2>
      <div className={styles.subtitleContainer}>
        <p className='description'>{description}</p>
        <button className='btn btn-empty' onClick={handleGoBack}>
          Regresar
        </button>
      </div>
      <div className='line-horizontal'></div>

      <h2 className={styles.subTitle}>DATOS DEL CLIENTE</h2>
      <section className='result-fields-section'>
        <FieldReport label={'No. cliente'} description={no_cliente} />
        <FieldReport label={'Fecha de creación'} description={fecha_de_creacion_poliza.slice(0, 10)} />
        <FieldReport label={'Registrado por'} description={creador_por_poliza} />
        <FieldReport label={'Nombre cliente'} description={nombre_cliente} />
        <FieldReport label={'Apellidos cliente'} description={apellidos_cliente} />
        <FieldReport label={'Email del cliente'} description={email_cliente} />
        <FieldReport label={'Fecha de nacimiento'} description={fecNac.slice(0, 10)} />
        <FieldReport label={'Edad'} description={age} />
        <FieldReport label={'Género'} description={desc_sexo} />
        <FieldReport label={'No. de teléfono'} description={telefonos} />
      </section>
      <div className='line-horizontal'></div>

      <h2 className={styles.subTitle}>DATOS SOBRE LA PÓLIZA</h2>
      <section className='result-fields-section'>
        <FieldReport label={'No. de póliza'} description={numero_aseguradora_poliza} />
        <FieldReport label={'Tipo de documento'} description={desc_documento} />
        <FieldReport label={'No. endoso aseguradora'} description={numero_aseguradora_endoso_poliza ?? '---'} />
        <FieldReport label={'No. No. Solicitud / No. Endoso en ACS'} description={acs ?? '---'} />
        <FieldReport label={'Asunto del endoso'} description={asunto_del_endoso ?? '---'} />
      </section>
      <div className='line-horizontal'></div>

      <h2 className={styles.subTitle}>DATOS SOBRE LA ASEGURADORA</h2>
      <section className='result-fields-section'>
        <FieldReport label={'Aseguradora'} description={desc_aseguradora} />
        <FieldReport label={'Ramo de seguro'} description={desc_ramo_de_seguro} />
        <FieldReport label={'Grupo económico'} description={desc_grupo_economico} />
        <FieldReport
          label={'Precio de la póliza'}
          description={new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(precio_poliza)}
        />
      </section>
      <div className='line-horizontal'></div>
    </>
  );
}
