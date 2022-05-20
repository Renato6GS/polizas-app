import { Controller } from 'react-hook-form';
import FieldForm from 'components/FieldForm';
import ComboBoxForm from 'components/ComboBoxForm';

import styles from './styles.module.css';
import { FACTURADORES } from 'constants/facturadoresCombo';
import { EJECUTIVOS } from 'constants/ejecutivoDeCuentaCombo';
import { ESTADOS_DEl_PROCESO } from 'constants/proccessStatesCombo';
import { ESTADOS_DEL_DOCUMENTO } from 'constants/estadosDelDocumentoCombo';

export default function FourthStepForm({ register, errors, title, control }) {
  return (
    <>
      <h2 className={styles.subTitle}>{title}</h2>
      <section className={styles.comoBoxSection}>
        <label className='label'>Cambiar ejecutivo de cuenta</label>
        <div className={styles.comboBoxesContainer}>
          <Controller
            control={control}
            name='comboEjecutivos'
            render={({ field: { onChange, value } }) => (
              <ComboBoxForm onChange={onChange} optionValues={EJECUTIVOS} prevValue={value} />
            )}
          />
        </div>
      </section>
      <section className={styles.comoBoxSection}>
        <label className='label'>Cambiar facturador</label>
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
      <section className={styles.comoBoxSection}>
        <label className='label'>Cambiar estado del proceso</label>
        <div className={styles.comboBoxesContainer}>
          <Controller
            control={control}
            name='comboEstadoProceso'
            render={({ field: { onChange, value } }) => (
              <ComboBoxForm onChange={onChange} optionValues={ESTADOS_DEl_PROCESO} prevValue={value} />
            )}
          />
        </div>
      </section>
      <section className={styles.comoBoxSection}>
        <label className='label'>Cambiar estado del documento</label>
        <div className={styles.comboBoxesContainer}>
          <Controller
            control={control}
            name='comboEstadoDocumento'
            render={({ field: { onChange, value } }) => (
              <ComboBoxForm onChange={onChange} optionValues={ESTADOS_DEL_DOCUMENTO} prevValue={value} />
            )}
          />
        </div>
      </section>
      <FieldForm
        id={'revSNC'}
        label={'Revisión SNC'}
        placeholder={'Responda con un sí o no'}
        register={register}
        errors={errors}
      />
      <FieldForm
        id={'reqDeCobro'}
        label={'Requerimientos de cobro'}
        placeholder={'Ej.: 3000'}
        register={register}
        errors={errors}
      />
      <FieldForm
        id={'comentario'}
        label={'Comentario'}
        placeholder={'Escriba un breve comentario de los cambios...'}
        register={register}
        errors={errors}
      />
      <FieldForm
        id={'editadoPor'}
        label={'Editado por'}
        placeholder={'Escriba su correo'}
        register={register}
        errors={errors}
      />
    </>
  );
}
