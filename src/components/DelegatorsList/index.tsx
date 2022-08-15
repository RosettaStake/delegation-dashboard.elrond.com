import React, { FC, useCallback, useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { ApiProvider } from '@elrondnetwork/erdjs/out';
import { network } from 'config';
import { Pagination, Table } from 'react-bootstrap';
import { denominated } from '../../helpers/denominate';
import DonutChart from './components/DonutChart.jsx';

interface DelegatorType {
  address: string;
  activeStakeNum: number;
  activeStake: string;
}

const ranges = [
  [0, 50],
  [50, 100],
  [100, 500],
  [500, 0]
];

const DelegatorsList: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [delegators, setDelegators] = useState<Array<DelegatorType>>([]);
  const [delegatorsCount, setDelegatorsCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [data, setData] = useState({});

  const perPage = 50;

  const provider = new ApiProvider(network.apiAddress, { timeout: 5000 });

  const getDelegators = useCallback(
    async (from) => {
      return await provider.doGetGeneric(
        `providers/${network.delegationContract}/delegators?from=${from}&size=${perPage}`,
        (res) => {
          setDelegators(res);
        }
      );
      return () => setLoading(false);
    },
    [currentPage]
  );

  const getDelegatorsCount = useCallback(async () => {
    await provider.doGetGeneric(
      `providers/${network.delegationContract}/delegators/count`,
      (res) => {
        setDelegatorsCount(res);
      }
    );
    return () => setLoading(false);
  }, []);

  const generateData = () => {
    const queries = ranges.map((range) =>
      provider.doGetGeneric(
        `providers/${network.delegationContract}/delegators/count?stakeFrom=${range[0]}&stakeTo=${range[1]}`,
        (res) => res
      )
    );

    let arcs: { date: number; value: any; title: string }[] = [];
    Promise.all(queries).then((values) => {
      arcs = values.map((val, index) => {
        return {
          date: index,
          value: val,
          title: `${val}`
        };
      });

      setData(arcs);
    });

    return arcs;
  };

  useEffect(() => {
    generateData();
  }, [!data]);

  useEffect(() => {
    getDelegators(currentPage * 50);
  }, [currentPage]);

  useEffect(() => {
    getDelegatorsCount();
  }, []);

  const PaginationWrapper = () => (
    <Pagination
      className={`justify-content-end ${styles.pagination}`}
      size='lg'
    >
      <Pagination.First
        onClick={() => setCurrentPage(0)}
        disabled={currentPage === 0}
      />
      <Pagination.Prev
        disabled={currentPage === 0}
        onClick={() => setCurrentPage(currentPage - 1)}
      />
      <Pagination.Item>
        {currentPage + 1} / {Math.ceil(delegatorsCount / perPage)}
      </Pagination.Item>
      <Pagination.Next
        disabled={currentPage === Math.floor(delegatorsCount / perPage)}
        onClick={() => setCurrentPage(currentPage + 1)}
      />
      <Pagination.Last
        disabled={currentPage === Math.floor(delegatorsCount / perPage)}
        onClick={() => setCurrentPage(Math.floor(delegatorsCount / perPage))}
      />
    </Pagination>
  );

  return (
    <div className={`${styles.delegators}`}>
      <div className={styles.heading}>
        <span className={styles.title}>
          Delegators (Total: {delegatorsCount})
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.chart}>
          <DonutChart
            data={data}
            width={400}
            height={400}
            innerRadius={120}
            outerRadius={200}
            ranges={ranges}
          />
        </div>

        <PaginationWrapper />
        <Table striped hover variant='dark'>
          <thead>
            <tr>
              <th>#</th>
              <th>Address</th>
              <th>Staked Amount</th>
            </tr>
          </thead>
          <tbody>
            {delegators.map((delegator, index) => (
              <tr key={'delegator' + index}>
                <td>{index + currentPage * perPage + 1}</td>
                <td>
                  <a
                    target='_blank'
                    rel='noreferrer'
                    href={`${network.explorerAddress}/accounts/${delegator.address}`}
                  >
                    {delegator.address}
                  </a>{' '}
                </td>
                <td>
                  {denominated(delegator.activeStake)} {network.egldLabel}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <PaginationWrapper />
      </div>
    </div>
  );
};

export default DelegatorsList;
