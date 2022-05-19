/* eslint-disable indent */
import { useState } from 'react';
import { queryConsultarPoliza } from 'db/queries/queryConsultarPoliza';
import Layout from 'components/Layout/Layout';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import styles from './styles.module.css';
import FieldForm from 'components/FieldForm';
import { object, string, lazy } from 'yup';
import { messageErrors } from 'constants/messageErros';
import Loader from 'components/Loader';
import { FACTURADO, NO_CONFORME } from 'constants/processStates';
import ViewPolicy from 'components/ViewPolicy';
import { sendToEjecutivo } from 'db/emails/sendToEjecutivo';
import { sendToArchivador } from 'db/emails/sendToArchivador';

export default function Policy({ idPoliza, informacionGeneral }) {
  const [loading, setLoading] = useState(false);
  const [isNoConforme, setIsNoConforme] = useState(false);
  const {
    numero_aseguradora_poliza: no_registro,
    id_ejecutivo_de_cuenta: idEjecutivo,
    no_cliente,
    nombre_cliente,
    apellidos_cliente,
    id_archivador: idArchivador,
    desc_documento,
    desc_aseguradora,
    asunto_del_endoso,
    numero_solicitud_numero_endoso_en_acs_poliza: acs,
  } = JSON.parse(informacionGeneral)[0];

  const schema = object()
    .shape({
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

  const handleClickNoConforme = (value) => setIsNoConforme(value);

  const onSubmit = async (values) => {
    setLoading(true);
    console.log({ isNoConforme });
    if (isNoConforme) {
      const { comentario } = values;
      try {
        console.log('es no conforme');
        await fetch('/api/updateCheckLog', {
          body: JSON.stringify({
            idEstadoDelProceso: NO_CONFORME,
            comentario,
            idPoliza,
            editadoPor: 'FAC-7',
            usuario: 'renato',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
        // Enviamos correo al ejecutivo:
        await sendToEjecutivo({
          idPoliza,
          idEjecutivo,
          no_cliente,
          nombre_cliente,
          apellidos_cliente,
          comentario,
          no_registro,
        });
        alert('Comentario enviado');
      } catch (error) {
        console.error;
      }
    } else {
      // Se ha presionado el "Revisado"
      try {
        console.log('es para ser facturado');
        await fetch('/api/updateCheckLog', {
          body: JSON.stringify({
            idEstadoDelProceso: FACTURADO,
            comentario: 'El documento ha sido facturado. (generado automáticamente)',
            idPoliza,
            editadoPor: 'FAC-7',
            usuario: 'renato',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
        //   /Enviamos correo al archivador:
        await sendToArchivador({
          idArchivador,
          no_cliente,
          nombre_cliente,
          apellidos_cliente,
          no_registro,
          desc_documento,
          no_aseguradora: no_registro,
          desc_aseguradora,
          asunto_del_endoso,
          acs,
        });
        alert('Facturado correctamente');
      } catch (error) {
        alert('Hubo un error');
        console.log(error);
      }
    }
    setIsNoConforme(false);
    setLoading(false);
  };

  return (
    <Layout>
      {loading && <Loader />}
      <ViewPolicy
        informacionGeneral={informacionGeneral}
        idPoliza={idPoliza}
        title={'Póliza'}
        subTitle={'Revisando la póliza'}
        description={
          'Revise los siguientes datos proporcionados. Luego de haber revisado, tendrá varias opciones al final del documento.'
        }
      />
      <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputsContainer}>
          <p className='description'>
            Si todos los datos son correcto de click en &quot;Facturar&quot;. Se le enviará un correo al archivador
            informando sobre la facturación de esta póliza.
          </p>
          <p className='description'>
            Si presiona &quot;No conforme&quot; tendrá que escribir un comentario del porqué la póliza no cumple para
            ser facturada. Se le enviará un correo al ejecutivo de cuenta para que tome las acciones correctivas. El
            estado de la póliza cambiará a &quot;No conforme&quot; y ya no podrá revertir la operación.
          </p>
          <FieldForm
            id={'comentario'}
            label={'Comentario'}
            placeholder={'Ej.: El precio especificado no cumple con el precio acordado...'}
            register={register}
            errors={errors}
          />
        </div>

        <div className='line-horizontal'></div>

        <div className={styles.buttonsContainer}>
          <button className='btn btn-empty' onClick={() => handleClickNoConforme(true)}>
            No conforme
          </button>
          <button type='submit' className='btn' onClick={() => handleClickNoConforme(false)}>
            Facturar
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
