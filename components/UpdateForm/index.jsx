import { useEffect } from 'react';
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
import FourthStepForm from './stepsForm/FourthStepForm.jsx';
import { obtenerDatosParaActualizacionDePoliza } from 'db/form/obtenerDatosParaActualizacionDePoliza.js';

export default function UpdateForm({ idPoliza, informacionGeneral }) {
  const [formStep, setFormStep] = useState(0);
  const [isSure, setIsSure] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    no_cliente,
    creador_por_poliza,
    nombre_cliente,
    apellidos_cliente,
    email_cliente,
    direccion_cliente,
    telefonos,
    numero_aseguradora_poliza,
    numero_aseguradora_endoso_poliza,
    numero_solicitud_numero_endoso_en_acs_poliza: acs,
    asunto_del_endoso,
    precio_poliza,
    revision_snc_poliza,
    req_de_cobro_poliza,
  } = JSON.parse(informacionGeneral)[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  useEffect(() => {
    setValue('no_cliente', no_cliente);
    setValue('nombre_cliente', nombre_cliente);
    setValue('apellidos_cliente', apellidos_cliente);
    setValue('correo_cliente', email_cliente);
    setValue('direccion_cliente', direccion_cliente);
    setValue('numero_de_tel_cliente', telefonos.replace(/\s/g, ''));
    setValue('numero_de_poliza', numero_aseguradora_poliza);
    setValue('numero_endoso_aseguradora', numero_aseguradora_endoso_poliza ?? '');
    setValue('no_solicitud_acs', acs ?? '');
    setValue('asunto_endoso', asunto_del_endoso ?? '');
    setValue('price', precio_poliza);
    setValue('created_by', creador_por_poliza);
    setValue('revSNC', revision_snc_poliza);
    setValue('reqDeCobro', req_de_cobro_poliza);
    console.log('el dato es');
    console.log(asunto_del_endoso);
  }, [setValue]);

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
    console.log(values);
    obtenerDatosParaActualizacionDePoliza({ values, vIdPoliza: idPoliza });
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
          {formStep === 3 && (
            <FourthStepForm register={register} errors={errors} control={control} title='Datos de control' />
          )}
        </div>

        <div className='line-horizontal'></div>

        <div className={styles.buttonsContainer}>
          {formStep > 0 && (
            <button onClick={previousStep} className='btn btn-empty'>
              Regresar
            </button>
          )}
          {formStep === 3 ? (
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
