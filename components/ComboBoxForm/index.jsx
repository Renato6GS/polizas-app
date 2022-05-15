/* eslint-disable indent */
import { Fragment, useState, useEffect } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import styles from './styles.module.css';
import DropIcon from 'components/Icons/DropIcon';

export default function ComboBoxForm({ onChange, optionValues, prevValue = { id: '0' } }) {
  let idNumber = 0;
  idNumber = Number(prevValue.id.slice(3));
  const initialValue = idNumber === 0 ? idNumber : idNumber - 1;
  const [selected, setSelected] = useState(optionValues[initialValue]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    onChange(optionValues[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredOptionValues =
    query === ''
      ? optionValues
      : optionValues.filter((person) =>
          person.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <Combobox
      value={selected}
      onChange={(e) => {
        onChange(e);
        setSelected(e);
      }}>
      <div className={styles.comboBoxContainer}>
        <div className={styles.subSubContainer}>
          <Combobox.Input
            className={styles.comboInput}
            displayValue={(person) => person.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className={styles.comboSelector}>
            <DropIcon />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
          afterLeave={() => setQuery('')}>
          <Combobox.Options className={styles.comboOptionContainer}>
            {filteredOptionValues.length === 0 && query !== '' ? (
              <div className={styles.nothingFound}>Sin resultados.</div>
            ) : (
              filteredOptionValues.map((person) => (
                <Combobox.Option
                  key={person.id}
                  className={({ active }) =>
                    `${styles.noSelectedStyles} ${active ? styles.selectedStyles : styles.noSelected}`
                  }
                  value={person}>
                  {({ selected }) => (
                    <>
                      <span className={`${selected && styles.optionActive}`}>{person.name}</span>
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
