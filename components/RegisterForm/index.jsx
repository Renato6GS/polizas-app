import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, number } from 'yup';
import { messageErrors } from 'constants/messageErros';
import { DAYS, MONTHS, YEARS } from 'constants/datesCombo';
import { GENDER } from 'constants/genderCombo.js';
import { INSURERS } from 'constants/insurersCombo.js';

import styles from './styles.module.css';
import FieldForm from 'components/FieldForm';
import ComboBoxForm from 'components/ComboBoxForm';

const schema = object()
  .shape({
    no_cliente: number()
      .typeError(messageErrors['mNumberTypeError'])
      .positive(messageErrors['mPositive'])
      .max(9999999, messageErrors['mStringMaxLength'])
      .integer(messageErrors['mInteger'])
      .required(messageErrors['mRequired']),
    nombre_cliente: string()
      .typeError(messageErrors['mStringTypeError'])
      .max(75, messageErrors['mStringMaxLength'])
      .required(messageErrors['mRequired']),
    apellidos_cliente: string()
      .typeError(messageErrors['mStringTypeError'])
      .max(75, messageErrors['mStringMaxLength'])
      .required(messageErrors['mRequired']),
    numero_de_tel_cliente: string()
      .typeError(messageErrors['mStringTypeError'])
      .min(7, messageErrors['mNumberPhone'])
      .max(75, messageErrors['mStringMaxLength'])
      .required(messageErrors['mRequired']),
  })
  .required();

export default function RegisterForm() {
  const [formStep, setFormStep] = useState(0);
  const [isSure, setIsSure] = useState(false);

  const ImSure = (value) => setIsSure(value);

  const nextStep = () => {
    ImSure(false);
    setFormStep((cur) => cur + 1);
  };

  const previousStep = () => {
    ImSure(false);
    setFormStep((cur) => cur - 1);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const onSubmit = (values) => {
    if (!isSure) return false;
    console.log(values);
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.inputsContainer}>
        {formStep === 0 && (
          <>
            <h2 className={styles.subTitle}>Datos del cliente</h2>
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
            <section className={styles.birthdayDateContainer}>
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
            <section className={styles.birthdayDateContainer}>
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
        )}
        {formStep === 1 && (
          <>
            <FieldForm
              id={'numero_de_poliza'}
              label={'Número de póliza aseguradora'}
              placeholder={'Ej.: 29391.'}
              register={register}
              errors={errors}
            />
          </>
        )}
        {formStep === 2 && (
          <>
            <section className={styles.birthdayDateContainer}>
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
          </>
        )}
      </div>

      <div className='line-horizontal'></div>

      <div className={styles.buttonsContainer}>
        {formStep > 0 && (
          <button onClick={previousStep} className='btn btn-empty'>
            Regresar
          </button>
        )}
        {/* <button type='submit' className='btn'> */}
        {formStep === 2 ? (
          <button onClick={() => ImSure(true)} type='submit' className='btn'>
            Enviar
          </button>
        ) : (
          <button onClick={nextStep} type='button' className='btn'>
            Siguiente
          </button>
        )}
        {/* <button onClick={nextStep} type='button' className='btn'>
          {formStep === 2 ? 'Enviar' : 'Siguiente'}
        </button> */}
      </div>
    </form>
  );
}
