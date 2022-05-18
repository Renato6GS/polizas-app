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
import {
  DOCUMENTO_APROBADO,
  DOCUMENTO_CON_CORRECCIONES,
  DOCUMENTO_NO_CONFORME,
  ENVIADO_AL_CLIENTE,
  ENVIADO_A_FACTURAR,
  NO_CONFORME,
} from 'constants/processStates';
import ViewPolicy from 'components/ViewPolicy';

export default function Policy({ idPoliza, informacionGeneral }) {
  const [loading, setLoading] = useState(false);
  const [isNoConforme, setIsNoConforme] = useState(false);
  const [isRevisadoConCorrecciones, setIsRevisadoConCorrecciones] = useState(false);

  const { creador_por_poliza, numero_aseguradora_poliza, email_cliente } = JSON.parse(informacionGeneral)[0];

  const schema = object()
    .shape({
      req_de_cobro: lazy(() =>
        isNoConforme || isRevisadoConCorrecciones
          ? string()
          : string()
              .typeError(messageErrors['mStringTypeError'])
              .max(20, messageErrors['mStringMaxLength'])
              .required(messageErrors['mRequired'])
      ),
      comentario: lazy(() =>
        isNoConforme && isRevisadoConCorrecciones
          ? string()
              .typeError(messageErrors['mStringTypeError'])
              .max(380, messageErrors['mStringMaxLength'])
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
  const handleClickCorrecciones = () => setIsRevisadoConCorrecciones(true);

  const onSubmit = async (values) => {
    setLoading(true);
    if (isNoConforme) {
      console.log('ha');
      const { comentario } = values;
      try {
        await fetch(`/api/updateApprovedDocument?idPoliza=${idPoliza}&idDoc=${DOCUMENTO_NO_CONFORME}`);
        await fetch('/api/updateCheckLog', {
          body: JSON.stringify({
            idEstadoDelProceso: NO_CONFORME,
            comentario,
            idPoliza,
            editadoPor: 'EJE-10',
            usuario: 'renato',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
        // Enviamos correo:
        const message = `La póliza ${numero_aseguradora_poliza} no es conforme. Puede proseguir con la devolución al cliente. Comentario: ${comentario}`;
        const subject = `Póliza ${numero_aseguradora_poliza} revisada`;
        const fullname = 'Revisor';
        sendToRegister({ registerEmail: creador_por_poliza, message, subject, fullname });
        alert('Comentario enviado');
      } catch (error) {
        console.error;
      }
    } else if (isRevisadoConCorrecciones) {
      console.log('revisaod con correcciones');
      // Primer fetch: Registramos el requerimiento de cobro
      const { comentario, req_de_cobro } = values;
      if (comentario.length === 0 && req_de_cobro.length === 0)
        alert('Error: Debe llenar ambos campos para esta opción');
      const res = await fetch(`/api/updateReqCobro?idPoliza=${idPoliza}&reqCobro=${req_de_cobro}`);
      const { results } = await res.json();
      const { rowsAffected } = results;
      if (rowsAffected[0]) {
        alert('Revisado con correcciones correctamente.');

        // Aprobamos el documento:
        await fetch(`/api/updateApprovedDocument?idPoliza=${idPoliza}&idDoc=${DOCUMENTO_CON_CORRECCIONES}`);

        // Segundo fetch: Actualizamos la bitácora
        await fetch('/api/updateCheckLog', {
          body: JSON.stringify({
            idEstadoDelProceso: ENVIADO_AL_CLIENTE,
            comentario: `El documento ha sido revisado por un ejecutivo de cuenta y aprobado con correcciones. ${comentario}`,
            idPoliza,
            editadoPor: 'EJE-10',
            usuario: 'renato',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
        await fetch('/api/updateCheckLog', {
          body: JSON.stringify({
            idEstadoDelProceso: ENVIADO_A_FACTURAR,
            comentario:
              'El documento está esperando a ser asignado a un facturador para ser facturado. (generado automáticamente)',
            idPoliza,
            editadoPor: 'EJE-10',
            usuario: 'renato',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
        // Enviamos correo:
        const message = `Se ha finalizado con la revisión de la póliza ${numero_aseguradora_poliza} ha sido revisada, ha sido aprobado con correcciones y ahora está esperando a un facturador. Debe rectificar lo siguiente ${comentario}`;
        const subject = `Póliza ${numero_aseguradora_poliza} aprobada con correcciones`;
        const fullname = 'Ejecutivo de cuenta';
        // Tercer fetch: Enviamos los correos
        sendToRegister({ registerEmail: creador_por_poliza, message, subject, fullname });
        sendToRegister({ registerEmail: 'lrenatogo1t@gmail.com', message, subject, fullname });
        sendToRegister({ registerEmail: email_cliente, message, subject, fullname });
      } else {
        alert('Hubo un error, por favor revise el log de errores.');
      }
    } else {
      try {
        console.log('ha presionado revisado');
        const { req_de_cobro } = values;
        // Primer fetch: Registramos el requerimiento de cobro
        const res = await fetch(`/api/updateReqCobro?idPoliza=${idPoliza}&reqCobro=${req_de_cobro}`);
        const { results } = await res.json();
        const { rowsAffected } = results;
        if (rowsAffected[0]) {
          alert('Revisado correctamente.');

          // Aprobamos el documento:
          await fetch(`/api/updateApprovedDocument?idPoliza=${idPoliza}&idDoc=${DOCUMENTO_APROBADO}`);

          // Segundo fetch: Actualizamos la bitácora
          await fetch('/api/updateCheckLog', {
            body: JSON.stringify({
              idEstadoDelProceso: ENVIADO_AL_CLIENTE,
              comentario:
                'El documento ha sido revisado por un ejecutivo de cuenta y aprobado. (generado automáticamente)',
              idPoliza,
              editadoPor: 'EJE-10',
              usuario: 'renato',
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          });
          await fetch('/api/updateCheckLog', {
            body: JSON.stringify({
              idEstadoDelProceso: ENVIADO_A_FACTURAR,
              comentario:
                'El documento está esperando a ser asignado a un facturador para ser facturado. (generado automáticamente)',
              idPoliza,
              editadoPor: 'EJE-10',
              usuario: 'renato',
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          });
          // Enviamos correo:
          const message = `Se ha finalizado con la revisión de la póliza ${numero_aseguradora_poliza} ha sido revisada, el documento ha sido aprobado y ahora está esperando a un facturador.`;
          const subject = `Póliza ${numero_aseguradora_poliza} aprobada`;
          const fullname = 'Ejecutivo de cuenta';
          // Tercer fetch: Enviamos los correos
          sendToRegister({ registerEmail: creador_por_poliza, message, subject, fullname });
          sendToRegister({ registerEmail: 'lrenatogo1t@gmail.com', message, subject, fullname });
          sendToRegister({ registerEmail: email_cliente, message, subject, fullname });
        } else {
          alert('Hubo un error, por favor revise el log de errores.');
        }
      } catch (error) {
        console.log(error);
      }
    }
    setIsNoConforme(false);
    setIsRevisadoConCorrecciones(false);
    setLoading(false);
  };

  return (
    <Layout>
      {loading && <Loader />}
      <ViewPolicy
        informacionGeneral={informacionGeneral}
        idPoliza={idPoliza}
        title={'Vista: ejecutivo de cuenta'}
        subTitle={'Revisando la póliza'}
        description={
          'Revise los siguientes datos proporcionados. Luego de haber revisado, tendrá varias opciones al final del documento.'
        }
      />
      <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputsContainer}>
          <p className='description'>
            Si todos los datos son correctos, especifique el &quot;Requerimiento de cobro&quot; y de click en
            &quot;Revisado&quot;.
          </p>
          <p className='description'>
            En caso de que los datos proporcionados no lo sean, puede seleccionar la opción de &quot;No conforme&quot; o
            &quot;Revisado con correcciones&quot; según sea el caso. En ambos casos tendrá que ingresar un comentario
            detallando el porqué.
          </p>
          <p className='description'>
            En caso de que presione &quot;Revisado con correcciones&quot; se le enviará un correo al cliente
            especificando los errores que debe de rectificar.
          </p>
          <p className='description'>
            Si presiona &quot;Revisado&quot;, se le enviará un correo al cliente informando que su documento ha sido
            aprobado (se le enviará una copia a usted como ejecutivo) y otro correo a quien registró la póliza para que
            le asigne un facturador.
          </p>
          <p className='description'>
            Si presiona &quot;No conforme&quot;, podrá proseguir con un registro de devolución al cliente.
          </p>
          <FieldForm
            id={'req_de_cobro'}
            label={'Requirimientos de cobro'}
            placeholder={'Ej.: 12000'}
            register={register}
            errors={errors}
          />
          <FieldForm
            id={'comentario'}
            label={'Especifique porque es "No Conforme" o que debe de rectificar'}
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
          <button className='btn btn-empty' onClick={handleClickCorrecciones}>
            Revisado con correcciones
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
