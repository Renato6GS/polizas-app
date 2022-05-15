import { Controller } from 'react-hook-form';
import FieldForm from 'components/FieldForm';
import ComboBoxForm from 'components/ComboBoxForm';
import { BRANCHES } from 'constants/branchesCombo';
import { ECONOMIC_GROUPS } from 'constants/economicGroupsCombo';
import { INSURERS } from 'constants/insurersCombo.js';

import styles from './styles.module.css';

export default function ThirdStepForm({ register, errors, title, control }) {
  return (
    <>
      <h2 className={styles.subTitle}>{title}</h2>
      <section className={styles.comoBoxSection}>
        <label className='label'>Aseguradora</label>
        <div className={styles.comboBoxesContainer}>
          <Controller
            control={control}
            name='comboInsurers'
            reules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <ComboBoxForm onChange={onChange} optionValues={INSURERS} prevValue={value} />
            )}
          />
        </div>
      </section>
      <section className={styles.comoBoxSection}>
        <label className='label'>Ramo de seguro</label>
        <div className={styles.comboBoxesContainer}>
          <Controller
            control={control}
            name='comboBranches'
            reules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <ComboBoxForm onChange={onChange} optionValues={BRANCHES} prevValue={value} />
            )}
          />
        </div>
      </section>
      <section className={styles.comoBoxSection}>
        <label className='label'>Grupo económico</label>
        <div className={styles.comboBoxesContainer}>
          <Controller
            control={control}
            name='comboEconomicGroups'
            reules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <ComboBoxForm onChange={onChange} optionValues={ECONOMIC_GROUPS} prevValue={value} />
            )}
          />
        </div>
      </section>
      <FieldForm id={'price'} label={'Precio'} placeholder={'Ej.: 3000'} register={register} errors={errors} />
    </>
  );
}
