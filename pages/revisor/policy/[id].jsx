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
import { sendToRegister } from 'db/emails/sendToRegister';
import { NO_CONFORME, REVISADO } from 'constants/processStates';
import ViewPolicy from 'components/ViewPolicy';

export default function Policy({ idPoliza, informacionGeneral }) {
  const [loading, setLoading] = useState(false);
  const [isNoConforme, setIsNoConforme] = useState(false);
  const { creador_por_poliza, numero_aseguradora_poliza } = JSON.parse(informacionGeneral)[0];

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
        sendToRegister({ registerEmail: creador_por_poliza, message, subject, fullname });
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
          sendToRegister({ registerEmail: creador_por_poliza, message, subject, fullname });
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
