import Layout from 'components/Layout/Layout';
import { useForm, Controller } from 'react-hook-form';
import ComboBoxForm from 'components/ComboBoxForm';
import { FACTURADORES } from 'constants/facturadoresCombo.js';
import { sendToFacturador } from 'db/emails/sendToFacturador.js';

import styles from './styles.module.css';
import { queryConsultarFacturadorDePoliza } from 'db/queries/queryConsultarFacturadorDePoliza';

export default function AsignarFacturador({ idPoliza, id_facturador }) {
  const onSubmit = async (values) => {
    console.log(values);
    const { idDB } = values['comboFacturador'];
    console.log(idDB);
    const comentario = 'El documento ha sido enviado a facturar.';
    const editadoPor = `FAC-${idDB}`;
    const usuario = 'renato';
    // idPoliza, idFacturador, comentario, editadoPor, usuario
    try {
      await fetch(
        `/api/insertAssignBiller?idPoliza=${idPoliza}&idFacturador=${idDB}&comentario=${comentario}&editadoPor=${editadoPor}&usuario=${usuario}`
      );
      alert('Se ha asignado correctamente.');

      // Le enviamos correo al facturador asignado
      await sendToFacturador({ idPoliza });
    } catch (error) {
      alert('Error en la asignación.');
      console.error;
    }
  };

  const { handleSubmit, control } = useForm();

  return (
    <Layout>
      <h2 className='title'>Asignar facturador</h2>

      <h2 className='sub-title'>Facturador</h2>

      <p className='description'>Seleccione a un facturador para que facture esta póliza.</p>
      <p className='description'>Se le enviará un correo al facturador seleccionado.</p>
      <div className='line-horizontal'></div>

      {id_facturador !== null ? (
        <p>Esta póliza ya cuenta con un facturador.</p>
      ) : (
        <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputsContainer}>
            <section className={styles.comoBoxSection}>
              <label className='label'>Facturador</label>
              <div className={styles.comboBoxesContainer}>
                <Controller
                  control={control}
                  name='comboFacturador'
                  render={({ field: { onChange, value } }) => (
                    <ComboBoxForm onChange={onChange} optionValues={FACTURADORES} prevValue={value} />
                  )}
                />
              </div>
            </section>
          </div>

          <div className={styles.buttonContainer}>
            <button type='input' className='btn'>
              Asignar
            </button>
          </div>

          <div className='line-horizontal'></div>
        </form>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const { id: idPoliza } = params;
  // La consultar habrá que ponerle si tiene el documento aprobado
  const resPoliza = await queryConsultarFacturadorDePoliza({ idPoliza });
  const { recordset } = resPoliza;
  const { id_facturador } = recordset[0];
  console.log(id_facturador);

  return {
    props: {
      idPoliza,
      id_facturador,
    },
  };
}
