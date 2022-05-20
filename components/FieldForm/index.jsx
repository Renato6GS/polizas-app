import styles from './styles.module.css';

export default function FieldForm({ id, label, placeholder, register, errors, typeInput = 'text', disabled = false }) {
  return (
    <div className={styles.fieldContainer}>
      <label className='label' htmlFor={id}>
        {label}
      </label>
      <input
        className='input'
        type={typeInput}
        id={id}
        disabled={disabled}
        placeholder={placeholder}
        {...register(id, { required: true })}
      />
      {errors[id]?.message && <p className={styles.messageError}>{errors[id].message}</p>}
    </div>
  );
}
