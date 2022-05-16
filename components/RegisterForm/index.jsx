import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './validations.js';

import styles from './styles.module.css';
import FirstStepForm from './stepsForm/firstStepForm.jsx';
import SecondStepForm from './stepsForm/SecondStepForm.jsx';
import ThirdStepForm from './stepsForm/ThirdStepForm.jsx';
import Loader from 'components/Loader';
import { useWatch } from 'hooks/useWatch.js';
import { registerDocument } from 'db/form/registerDocument.js';
import { registerDocumentWithoutClient } from 'db/form/registerDocumentWithoutClient.js';

export default function RegisterForm() {
  const [formStep, setFormStep] = useState(0);
  const [isSure, setIsSure] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const { isClientExist } = useWatch({ watch, id: 'no_cliente' });

  const ImSure = (value) => setIsSure(value);

  const nextStep = () => {
    ImSure(false);
    setFormStep((cur) => cur + 1);
  };

  const previousStep = () => {
    ImSure(false);
    setFormStep((cur) => cur - 1);
  };

  const onSubmit = async (values) => {
    if (!isSure) return false;
    setLoading(true);
    if (isClientExist) registerDocumentWithoutClient({ values });
    else registerDocument({ values });
    setLoading(false);
  };

  return (
    <>
      {loading && <Loader />}
      <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputsContainer}>
          {formStep === 0 && (
            <FirstStepForm
              register={register}
              errors={errors}
              control={control}
              title='Datos sobre el cliente'
              isClientExist={isClientExist}
            />
          )}
          {formStep === 1 && (
            <SecondStepForm register={register} errors={errors} control={control} title='Datos sobre la póliza' />
          )}

          {formStep === 2 && (
            <ThirdStepForm register={register} errors={errors} control={control} title='Datos sobre la aseguradora' />
          )}
        </div>

        <div className='line-horizontal'></div>

        <div className={styles.buttonsContainer}>
          {formStep > 0 && (
            <button onClick={previousStep} className='btn btn-empty'>
              Regresar
            </button>
          )}
          {formStep === 2 ? (
            <button onClick={() => ImSure(true)} type='submit' className='btn'>
              Enviar
            </button>
          ) : (
            <button onClick={nextStep} type='button' className='btn'>
              Siguiente
            </button>
          )}
        </div>
      </form>
    </>
  );
}
