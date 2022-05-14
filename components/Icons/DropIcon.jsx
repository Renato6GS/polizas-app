import * as React from 'react';

const SvgComponent = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={24}
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    className='feather feather-chevron-down'
    {...props}>
    <path d='m6 9 6 6 6-6' />
  </svg>
);

export default SvgComponent;
