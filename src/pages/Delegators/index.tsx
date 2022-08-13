import React, { FC, useEffect, useState } from 'react';

import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

import Heading from 'components/Heading';

import useGlobalData from '../../hooks/useGlobalData';

import styles from './styles.module.scss';
import DelegatorsList from '../../components/DelegatorsList';

const Delegators: FC = () => {
  const { address } = useGetAccountInfo();
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const handleRedirect = () =>
    Boolean(address) ? setLoading(false) : navigate('/unlock');

  useEffect(handleRedirect, [address]);
  useGlobalData();

  if (loading) {
    return (
      <div
        style={{ fontSize: '30px' }}
        className='d-flex align-items-center justify-content-center text-white flex-fill'
      >
        <FontAwesomeIcon
          icon={faSpinner}
          size='2x'
          spin={true}
          className='mr-3'
        />
        Loading...
      </div>
    );
  }

  return (
    <div className={styles.delegators}>
      <Heading />

      <DelegatorsList />
    </div>
  );
};

export default Delegators;
