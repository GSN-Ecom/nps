import { useLocation } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useGlobal } from '../../hooks/useGlobal';
import { fullAnswers } from '../../services/allAnswers/fullAnswers';
import { countTagDetractors } from '../../services/allAnswers/countTagDetractors';

import styles from './TableNPS.module.css';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import Title from '../Title/Title';
import FiltersVerb from '../Filters/FiltersVerb';
import { TableAnswersHeader } from './TableAnswersHeader';
import Pagination from '../Pagination/Pagination';
import { TableAnswersRows } from './TableAnswersRows';

const ALL_VALUES = [
  'todas',
  'todos',
  'todas as lojas',
  'todas as avaliações',
  'todos os tipos',
  '',
];

const normalize = (value) =>
  String(value ?? '')
    .trim()
    .toLocaleLowerCase('pt-BR');

const isAllOption = (value) =>
  value == null ||
  ALL_VALUES.includes(
    normalize(typeof value === 'object' ? value.name : value),
  );

const getRating = (nps) => {
  const score = Number(nps);

  if (!Number.isFinite(score)) return null;
  if (score <= 6) return 'detrator';
  if (score <= 8) return 'neutro';
  return 'promotor';
};

export const TableAnswers = () => {
  const location = useLocation();

  const {
    typeBusiness,
    date,
    page,
    setPage,
    selectedStore,
    selectedDelivery,
    selectedRating,
    selectedDetr,
  } = useGlobal();

  const [result, setResult] = useState([]);
  const [filterParameters, setFilterParameters] = useState({
    stores: [],
    classification: ['Detrator', 'Neutro', 'Promotor'],
    delivery: ['AGENDADA', 'CLIQUE', 'SUPER_RAPIDA'],
    detractors: [],
  });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Busca os dados da base para o período selecionado.
  useEffect(() => {
    let ativo = true;

    const buscarDados = async () => {
      setLoading(true);
      setErro(null);

      try {
        const answers = await fullAnswers(date, typeBusiness);

        const storesRange = [
          ...new Set(answers.map((item) => item.store)),
        ].sort((a, b) => Number(a) - Number(b));

        const detrRepeticoes = await countTagDetractors(answers);

        if (!ativo) return;

        setResult(answers);
        setFilterParameters({
          stores: storesRange,
          classification: ['Detrator', 'Neutro', 'Promotor'],
          delivery: ['AGENDADA', 'CLIQUE', 'SUPER_RAPIDA'],
          detractors: detrRepeticoes,
        });
      } catch (error) {
        if (!ativo) return;

        setErro(error);
        console.error('Erro ao buscar NPS:', error);
      } finally {
        if (ativo) setLoading(false);
      }
    };

    buscarDados();

    return () => {
      ativo = false;
    };
  }, [date, typeBusiness]);

  // Aplica os filtros sem alterar a base original.
  const filteredResult = useMemo(() => {
    return result.filter((answer) => {
      // Loja
      const storeId =
        typeof selectedStore === 'object' && selectedStore !== null
          ? selectedStore.nroempresa
          : selectedStore;

      if (
        !isAllOption(selectedStore) &&
        storeId != null &&
        storeId !== true &&
        Number(answer.store) !== Number(storeId)
      ) {
        return false;
      }

      // Tipo de avaliação
      if (!isAllOption(selectedRating)) {
        const rating = getRating(answer.nps);

        if (rating !== normalize(selectedRating?.name ?? selectedRating)) {
          return false;
        }
      }

      // Modalidade de entrega
      if (typeBusiness !== 'LojaF' && !isAllOption(selectedDelivery)) {
        const delivery = selectedDelivery?.name ?? selectedDelivery;

        if (normalize(answer.delivery) !== normalize(delivery)) {
          return false;
        }
      }

      // Tag de detrator: macro ou micro
      if (!isAllOption(selectedDetr)) {
        const selectedTag = normalize(selectedDetr);
        const tags = [answer.detrator?.macro, answer.detrator?.micro]
          .filter(Boolean)
          .map(normalize);

        if (
          !tags.some((tag) => tag === selectedTag || tag.includes(selectedTag))
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    result,
    selectedStore,
    selectedRating,
    selectedDelivery,
    selectedDetr,
    typeBusiness,
  ]);

  // Reinicia a página quando os filtros alteram o resultado.
  useEffect(() => {
    setPage((current) => ({
      ...(current ?? {}),
      inicio: 0,
      fim: 10,
      total: filteredResult.length,
    }));
  }, [
    filteredResult.length,
    selectedStore,
    selectedRating,
    selectedDelivery,
    selectedDetr,
    setPage,
  ]);

  const inicio = page?.inicio ?? 0;
  const fim = page?.fim ?? 10;

  const paginatedResult = useMemo(
    () => filteredResult.slice(inicio, fim),
    [filteredResult, inicio, fim],
  );

  if (loading) return <p>Carregando dados...</p>;
  if (erro) return <p>Erro ao carregar os dados.</p>;

  return (
    <div className={`${styles.customerTable} ${styles.verbCustomer}`}>
      <Breadcrumb pathname={location.pathname} />
      <Title
        text={`${typeBusiness === 'Ecom' ? 'Respostas Ecom' : 'Respostas Loja física'}`}
        style={{ fontSize: 'var(--title-default)', width: '100%' }}
      />
      <FiltersVerb
        storesNum={filterParameters.stores}
        deliveryType={filterParameters.delivery}
        ratingType={filterParameters.classification}
        detractorsList={filterParameters.detractors}
      />
      <p className={`${'textDefault'} ${styles.respNumTotal}`}>
        {filteredResult.length} respostas
      </p>
      <TableAnswersHeader
        arr={['Loja', 'Pedido', 'Nota', 'Data', 'Nome', 'Entrega', 'Justif.']}
      />
      <div className={styles.blockTable}>
        <TableAnswersRows dados={paginatedResult} />
      </div>
      <Pagination />
    </div>
  );
};
