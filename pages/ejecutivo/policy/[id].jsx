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
import { DOCUMENTO_APROBADO, ENVIADO_AL_CLIENTE, ENVIADO_A_FACTURAR, NO_CONFORME } from 'constants/processStates';
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
  const handleClickCorrecciones = () => setIsRevisadoConCorrecciones(true);

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
    } else if (isRevisadoConCorrecciones) {
      console.log('revisado con correcciones');
    } else {
      const { req_de_cobro } = values;
      try {
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
            Si presiona &quot;No conforme&quot;, se generará un registro de devolución al cliente.
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

// COSAS A HACER:
// Cuando se presiona que está revisado sucede que:

// listo
// 1. Se le envía un correo a quien registró el documento para
// asignarle un facturador. El mensaje del correo dirá:
// "Se ha finalizado con la revisión del registro (número de registro);
// proceda a asignarle un facturador"
// Al mismo tiempo, se enviará un correo al cliente y una copia al ejecutivo
// contando lo mismo (en principio)
// En la bitácora se guardará el estado "Enviado al cliente"

// Me falta el aprobar y lo de abajo xd
// LISTO
// El estado del documento será "Sí" aprobado

// 2. Le llega el correo a quien lo registró y en un pequeño formulario,
// se le pide que asigne un facturador para mandarlo a facturar.
// Será un combobox.
// Una vez asignado y enviado, se actualizará la bitácora con el nombre:
// "Enviado a facturar"

// Si es no conforme:

// 1. Se le envía un correo a quien registró la póliza para que genere una
// devolución o que haga algo para corregir los errores.
// La bitácora dira "No conforme"

// Si es Revisado con correcciones:

// 1. Se le enviará un correo al cliente que debe de rectificar.
// El estado del documeento se guarda como "Sí con correcciones"
// El estado del proceso será "Enviado al cliente"

// Creo que deberemos de generar un listado para aquellos documentos que tengan el estado "Sí con correcciones"
// para que se pueda editar los datos y guardarlos.

// CREO QUE ME FALTA EL DE SÍ EL DOCUMENTO HA SIDO APROBADO O NO dentro del checklog XD

// // Para el facturador:
// 1. El facturador recibe un correo con el mensaje que dice en el excel.
// Igualmente, podrá ver la póliza y si todo está bien, dará click en Enviar,
// y se guardará la fecha de facturado. El estado en la bitácora será ahora
// "Facturado"
