import { DAYS, MONTHS, YEARS } from 'constants/datesCombo';
import { GENDER } from 'constants/genderCombo.js';
import { Controller } from 'react-hook-form';
import FieldForm from 'components/FieldForm';
import ComboBoxForm from 'components/ComboBoxForm';

import styles from './styles.module.css';

export default function FirstStepForm({ register, errors, title, control }) {
  return (
    <>
      <h2 className={styles.subTitle}>{title}</h2>
      <FieldForm
        id={'no_cliente'}
        label={'Número de cliente'}
        placeholder={'Ej.: 39123'}
        register={register}
        errors={errors}
      />
      <FieldForm
        id={'nombre_cliente'}
        label={'Nombre del cliente'}
        placeholder={'Ej.: Luis Arturo'}
        register={register}
        errors={errors}
      />
      <FieldForm
        id={'apellidos_cliente'}
        label={'Apellidos del cliente'}
        placeholder={'Ej.: Ramírez Salguero'}
        register={register}
        errors={errors}
      />
      <section className={styles.comoBoxSection}>
        <label className='label'>Fecha de nacimiento</label>
        <div className={styles.comboBoxesContainer}>
          <Controller
            control={control}
            name='comboDay'
            render={({ field: { onChange, value } }) => (
              <ComboBoxForm onChange={onChange} optionValues={DAYS} prevValue={value} />
            )}
          />
          <Controller
            control={control}
            name='comboMonth'
            render={({ field: { onChange, value } }) => (
              <ComboBoxForm onChange={onChange} optionValues={MONTHS} prevValue={value} />
            )}
          />
          <Controller
            control={control}
            name='comboYear'
            render={({ field: { onChange, value } }) => (
              <ComboBoxForm onChange={onChange} optionValues={YEARS} prevValue={value} />
            )}
          />
        </div>
      </section>
      <section className={styles.comoBoxSection}>
        <label className='label'>Género</label>
        <div className={styles.comboBoxesContainer}>
          <Controller
            control={control}
            name='comboGender'
            render={({ field: { onChange, value } }) => (
              <ComboBoxForm onChange={onChange} optionValues={GENDER} prevValue={value} />
            )}
          />
        </div>
      </section>
      <FieldForm
        id={'numero_de_tel_cliente'}
        label={'Número de teléfono'}
        placeholder={'Ej.: +502 3918-2928, +502 3913-2022, +502 4201-0219...'}
        register={register}
        errors={errors}
      />
    </>
  );
}
