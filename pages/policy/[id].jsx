/* eslint-disable indent */
import { useState } from 'react';
import { queryConsultarPoliza } from 'db/queries/queryConsultarPoliza';
import Layout from 'components/Layout/Layout';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import styles from './styles.module.css';
import FieldReport from 'components/FieldReport';
import { calculateAge } from 'utils/calculateAge';
import FieldForm from 'components/FieldForm';
import { object, string, lazy } from 'yup';
import { messageErrors } from 'constants/messageErros';
import Loader from 'components/Loader';
import { sendMail } from 'utils/sendMail';
import { sendToRegister } from 'db/emails/sendToRegister';
import { NO_CONFORME, REVISADO } from 'constants/processStates';

export default function Policy({ idPoliza, informacionGeneral }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isNoConforme, setIsNoConforme] = useState(false);

  const schema = object()
    .shape({
      revision_en_snc: lazy(() =>
        isNoConforme
          ? string()
          : string()
              .typeError(messageErrors['mStringTypeError'])
              .max(3, messageErrors['mStringMaxLength'])
              .required(messageErrors['mRequired'])
      ),
      comentario: lazy(() =>
        isNoConforme
          ? string()
              .typeError(messageErrors['mStringTypeError'])
              .max(450, messageErrors['mStringMaxLength'])
              .required(messageErrors['mRequired'])
          : string()
      ),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

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
  const handleClickNoConforme = () => setIsNoConforme(true);

  const onSubmit = async (values) => {
    setLoading(true);
    if (isNoConforme) {
      const { comentario } = values;
      try {
        await fetch('/api/updateCheckLog', {
          body: JSON.stringify({
            idEstadoDelProceso: NO_CONFORME,
            comentario,
            idPoliza,
            editadoPor: 'REV-5',
            usuario: 'renato',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
        // Enviamos correo:
        const message = `La póliza ${numero_aseguradora_poliza} ha sido revisada, sin embargo no cumple con algunos requerimientos. ${comentario}`;
        const subject = `Póliza ${numero_aseguradora_poliza} revisada`;
        const fullname = 'Revisor';
        // sendToRegister({ registerEmail: creador_por_poliza, message, subject, fullname });
        alert('Comentario enviado');
      } catch (error) {
        console.error;
      }
    } else {
      // Se ha presionado el "Revisado"
      const { revision_en_snc } = values;
      try {
        const res = await fetch(`/api/updateSNC?idPoliza=${idPoliza}&snc=${revision_en_snc}`);
        const { results } = await res.json();
        const { rowsAffected } = results;
        if (rowsAffected[0]) {
          alert('Revisado correctamente.');
          await fetch('/api/updateCheckLog', {
            body: JSON.stringify({
              idEstadoDelProceso: REVISADO,
              comentario: 'El documento ha sido revisado. (generado automáticamente)',
              idPoliza,
              editadoPor: 'REV-5',
              usuario: 'renato',
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          });
          // Enviamos correo:
          const message = `La póliza ${numero_aseguradora_poliza} ha sido revisada y ahora ha sido enviado al ejecutivo de cuenta para que pueda aprobar el documento.`;
          const subject = `Póliza ${numero_aseguradora_poliza} revisada`;
          const fullname = 'Revisor';
          // sendToRegister({ registerEmail: creador_por_poliza, message, subject, fullname });
        } else {
          alert('Hubo un error, por favor revise el log de errores.');
        }
        console.log(revision_en_snc);
      } catch (error) {
        console.log(error);
      }
    }
    setIsNoConforme(false);
    setLoading(false);
  };

  return (
    <Layout>
      {loading && <Loader />}
      <h2 className='title'>Póliza</h2>
      <h2 className='sub-title'>Revisando la póliza {idPoliza}</h2>
      <div className={styles.subtitleContainer}>
        <p className='description'>
          Revise los siguientes datos proporcionados. Luego de haber revisado, tendrá varias opciones al final del
          documento.
        </p>
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

      <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputsContainer}>
          <p className='description'>
            Si todos los datos son correctos, especifique la &quot;Revisión en SNC&quot; y de click en
            &quot;Revisado&quot;. De lo contrario, especifique un comentario del porqué los datos no cumplen con los
            esperados y de click en &quot;No conforme&quot;.
          </p>
          <p className='description'>
            Si presiona &quot;Revisado&quot;, se le enviará un correo a quien registró esta póliza informando que la
            póliza ha sido enviado a un ejecutivo de cuenta para que sea revisada y apruebe el documento.
          </p>
          <p className='description'>
            Si presiona &quot;No conforme&quot;, igualmente se le enviará un correo a quien registró esta póliza para
            que pueda corregir los datos con el cliente lo más pronto posible.
          </p>
          <FieldForm
            id={'revision_en_snc'}
            label={'Revisión en SNC'}
            placeholder={'Responda con un sí o con un no'}
            register={register}
            errors={errors}
          />
          <FieldForm
            id={'comentario'}
            label={'Especifique porque es "No Conforme"'}
            placeholder={'Ej.: El precio especificado no cumple con el precio acordado...'}
            register={register}
            errors={errors}
          />
        </div>

        <div className='line-horizontal'></div>

        <div className={styles.buttonsContainer}>
          <button className='btn btn-empty' onClick={handleClickNoConforme}>
            No conforme
          </button>
          <button type='submit' className='btn'>
            Revisado
          </button>
        </div>
      </form>
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
