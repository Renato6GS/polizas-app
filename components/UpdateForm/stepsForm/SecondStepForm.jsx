import FieldForm from 'components/FieldForm';
import ComboBoxForm from 'components/ComboBoxForm';
import { Controller } from 'react-hook-form';
import { DOCUMENTS } from 'constants/documentCombo';

import styles from './styles.module.css';

export default function SecondStepForm({ register, errors, title, control }) {
  return (
    <>
      <h2 className={styles.subTitle}>{title}</h2>
      <FieldForm
        id={'numero_de_poliza'}
        label={'Número de póliza aseguradora'}
        placeholder={'Ej.: 29391'}
        register={register}
        errors={errors}
      />
      <section className={styles.comoBoxSection}>
        <label className='label'>Tipo de documento</label>
        <div className={styles.comboBoxesContainer}>
          <Controller
            control={control}
            name='comboDocument'
            render={({ field: { onChange, value } }) => (
              <ComboBoxForm onChange={onChange} optionValues={DOCUMENTS} prevValue={value} />
            )}
          />
        </div>
      </section>
      <FieldForm
        id={'numero_endoso_aseguradora'}
        label={'Número de endoso aseguradora'}
        placeholder={'Ej.: 39131'}
        register={register}
        errors={errors}
      />
      <FieldForm
        id={'no_solicitud_acs'}
        label={'No. Solicitud / No. Endoso en ACS'}
        placeholder={'Ej.: 31381'}
        register={register}
        errors={errors}
      />
      <FieldForm
        id={'asunto_endoso'}
        label={'Asunto del endoso'}
        placeholder={'Ej.: Cobertura de cristales y...'}
        register={register}
        errors={errors}
      />
    </>
  );
}
