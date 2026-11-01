import { useEffect, useState } from 'react';
import { npsStore } from '../../services/tableNpsStore/npsStore';
// estilizacao
import styles from './TableNPS.module.css';
import { growthNps } from './growthNps';
import { HeaderTableNps } from './HeaderTableNps';
import { sumByRespType } from '../../services/tableNpsStore/sumByRespType';
import { detractorsByStore } from '../../services/tableNpsStore/detractorsByStore';
import useModal from '../../hooks/useModal';
import Modal from '../Modal/Modal';
import { TableStoreNpsModal } from './TableStoreNpsModal';
import { useGlobal } from '../../hooks/useGlobal';

const TableNpsStore = ({ dados }) => {
  const [resultado, setResultado] = useState({
    range: [],
    before: [],
  });
  const { typeBusiness } = useGlobal();
  const { isOpen, openModal, closeModal } = useModal();
  const [storeModal, setStoreModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const styleCell = `${'textDefault'} ${styles.cell} ${'printCell'}`;
  const styleCellMob = `${'textDefault'} ${styles.mobileView} ${styles.cell} ${'printCell'}`;

  useEffect(() => {
    let ativo = true;

    const buscarDados = async () => {
      setLoading(true);
      setErro(null);

      try {
        const resposta = await npsStore(dados, typeBusiness);

        if (ativo) {
          setResultado(resposta);
        }
      } catch (error) {
        if (ativo) {
          setErro(error);
          console.error('Erro ao buscar NPS:', error);
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    };

    buscarDados();

    return () => {
      ativo = false;
    };
  }, [dados.inicio, dados.fim, dados, typeBusiness]);

  if (loading) return <p>Carregando dados...</p>;
  if (erro) return <p>Erro ao carregar os dados.</p>;

  const npsBefore = (numStore) => {
    return (
      resultado.before.find((item) => item.nroempresa === numStore)?.npsCalc ??
      '-'
    );
  };

  return (
    <>
      <div className={`${styles.rankingTable} ${'printTableStore'}`}>
        <HeaderTableNps />
        {loading}
        {!loading &&
          resultado.range.map((store, i) => {
            return (
              <div
                onClick={() => {
                  if (!store.detractorsResult.microResult?.length) return;
                  openModal();
                  setStoreModal(store);
                }}
                key={store.nroempresa}
                className={`${styles.rowTable} ${styles.rowRnkStores} ${'printRowTable'} ${i % 2 !== 0 ? styles.rowBg : ''}`}>
                <p className={styleCell}>
                  <b>{store.nroempresa}</b>
                </p>
                <p className={styleCell}>{store.storeName}</p>
                <p className={styleCell}>
                  <b>{store.npsCalc}</b>
                </p>
                {growthNps(store.npsCalc, npsBefore(store.nroempresa))}
                <p className={styleCell}>{npsBefore(store.nroempresa)}</p>
                <p className={styleCell}>
                  {store.nps.reduce((acc, value) => acc + value, 0)}
                </p>
                {store.nps.map((e, i) => {
                  return (
                    <p
                      key={i}
                      className={`${'textDefault'} ${styles.deskView} ${styles.cell} ${'printCell'}`}>
                      {e}
                    </p>
                  );
                })}
                <p className={styleCellMob}>{sumByRespType(0, 7, store)}</p>
                <p className={styleCellMob}>{sumByRespType(7, 9, store)}</p>
                <p className={styleCellMob}>{sumByRespType(9, 11, store)}</p>
                <p className={styleCell}>
                  {detractorsByStore(store.detractorsResult)}
                </p>
              </div>
            );
          })}
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        content={
          storeModal ? (
            <TableStoreNpsModal store={storeModal} />
          ) : (
            <p>Não há registros para a loja selecionada</p>
          )
        }
      />
    </>
  );
};

export default TableNpsStore;
