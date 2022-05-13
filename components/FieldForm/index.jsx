import styles from './styles.module.css';

export default function FieldForm({ id, label, placeholder, register, errors }) {
  return (
    <div className={styles.fieldContainer}>
      <label className='label' htmlFor={id}>
        {label}
      </label>
      <input
        className='input'
        type='text'
        id={id}
        placeholder={placeholder}
        {...register(id, { required: true, maxLength: 50 })}
      />
      {errors[id]?.message && <p className={styles.messageError}>{errors[id].message}</p>}
    </div>
  );
}
