import { useState } from "react";
import styles from "./Filters.module.css";
import SelectFilter from "../SelectFilter/SelectFilter";
import { Calendar } from "primereact/calendar";
import { useGlobal } from "../../hooks/useGlobal";
import Modal from "../Modal/Modal";
import useModal from "../../hooks/useModal";
import { Button } from "primereact/button";

import IconFilter from "../../assets/icons/IconFilter";

const FiltersVerb = () => {
  const {
    date,
    setDate,
    stores,
    filter,
    selectedStore,
    setSelectedStore,
    selectedDelivery,
    setSelectedDelivery,
    selectedRating,
    setSelectedRating,
    detrList,
    selectedDetr,
    setSelectedDetr,
  } = useGlobal();

  const [feedback, setFeedback] = useState(null);
  const [modalValues, setModalValues] = useState({
    loja: null,
    rating: null,
    delivery: null,
    dataInicio: null,
    dataFim: null,
  });

  // modal filtros
  const { isOpen, openModal, closeModal } = useModal();

  // inserindo lojas ativas dentro do filtro (select)
  const activeStores = [
    { nroempresa: true, name: "Todas as lojas" },
    ...stores
      .filter((loja) => filter.lojas.includes(Number(loja.numStore)))
      .map((loja) => ({
        nroempresa: loja.numStore,
        name: `${loja.name} (${loja.numStore})`,
      })),
  ];

  // inserindo modalidades de entrega ativas dentro do filtro (select)
  const activeDelivery = [
    {
      name: "Todas",
    },
    ...filter.entrega
      .filter((delivery) => delivery !== "")
      .map((delivery) => ({ name: delivery })),
  ];

  // inserindo os tipos de avaliação dentro do filtro (select)
  const activeRating = [
    { name: "Todas" },
    ...filter.reviews.map((review) => ({ name: review })),
  ];

  let dataFormatada = (value) => {
    return value.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  function applyFilters(filters) {
    const hasFilters =
      filters.loja !== null ||
      filters.rating !== null ||
      filters.delivery !== null ||
      filters.dataInicio !== null ||
      filters.dataFim !== null;

    if (!hasFilters) return;

    setSelectedStore(filters.loja);
    setSelectedRating(filters.rating);
    setSelectedDelivery(filters.delivery);

    setFeedback(() => {
      let text = "";

      if (filters.loja && filters.loja.name) text += `${filters.loja.name}. `;
      if (filters.rating && filters.rating.name)
        text += `${filters.rating.name}. `;
      if (filters.delivery && filters.delivery.name)
        text += `${filters.delivery.name}.`;
      if (date.inicio && date.fim)
        text += `${dataFormatada(date.inicio)} até ${dataFormatada(date.fim)}.`;

      return text;
    });

    setModalValues({
      loja: null,
      rating: null,
      delivery: null,
      dataInicio: null,
      dataFim: null,
    });
  }
  // conteúdo do modal
  const modalFilters = (
    <div className={styles.modalFilters}>
      <p className="textLarger">
        <b>Filtrar por:</b>
      </p>
      <div className={styles.rowFilters}>
        {/* seletores de data */}
        <div className={styles.slot}>
          <label htmlFor="dataInicioModal" className="textDefault">
            Data inicial:
          </label>
          <Calendar
            id="dataInicioModal"
            className={styles.calendar}
            value={date.inicio}
            onChange={(e) => {
              setDate({ ...date, inicio: e.value });
              setModalValues((current) => ({
                ...current,
                dataInicio: e.value,
              }));
            }}
            showIcon
            dateFormat="dd/mm/yy"
            appendTo="self"
          />
        </div>
        <div className={styles.slot}>
          <label htmlFor="dataFimModal" className="textDefault">
            Data final:
          </label>
          <Calendar
            id="dataFimModal"
            className={styles.calendar}
            value={date.fim}
            onChange={(e) => {
              setDate({ ...date, fim: e.value });
              setModalValues((current) => ({
                ...current,
                dataFim: e.value,
              }));
            }}
            showIcon
            dateFormat="dd/mm/yy"
            appendTo="self"
          />
        </div>
        {/* seletores de loja, avaliação e modalidade de entrega */}
        <div className={styles.slot}>
          <p className="textDefault">Lojas:</p>
          <SelectFilter
            options={activeStores}
            valueCurr={modalValues.loja || "Todas as lojas"}
            changeValue={(event) =>
              setModalValues((current) => ({
                ...current,
                loja: event,
              }))
            }
          />
        </div>
        <div className={styles.slot}>
          <p className="textDefault">Tipo de avaliação:</p>
          <SelectFilter
            options={activeRating}
            valueCurr={modalValues.rating || "Todas as avaliações"}
            changeValue={(event) =>
              setModalValues((current) => ({
                ...current,
                rating: event,
              }))
            }
          />
        </div>
        <div className={styles.slot}>
          <p className="textDefault">Entrega:</p>
          <SelectFilter
            options={activeDelivery}
            valueCurr={modalValues.delivery || "Todos os tipos"}
            changeValue={(event) =>
              setModalValues((current) => ({
                ...current,
                delivery: event,
              }))
            }
          />
        </div>
      </div>
      <div className={styles.btn}>
        <Button
          label="Cancelar"
          severity="secondary"
          outlined
          onClick={() => {
            setModalValues({
              loja: null,
              rating: null,
              delivery: null,
            });
            closeModal();
          }}
        />

        <Button
          className={styles.btnPrimary}
          type="button"
          label="Aplicar"
          disabled={
            modalValues.loja === null &&
            modalValues.rating === null &&
            modalValues.delivery === null &&
            modalValues.dataInicio === null &&
            modalValues.dataFim === null
          }
          onClick={() => {
            applyFilters(modalValues);
            closeModal();
          }}
        />
      </div>
    </div>
  );

  return (
    <>
      <div className={styles.tools}>
        <div className={styles.filters}>
          <div className={styles.rowFilters}>
            <div className={`${styles.slot} ${styles.selectInput}`}>
              <p className="textDefault">Lojas:</p>
              <SelectFilter
                options={activeStores}
                valueCurr={selectedStore}
                changeValue={setSelectedStore}
              />
            </div>
            <div className={`${styles.slot} ${styles.selectInput}`}>
              <p className="textDefault">Tipo de avaliação:</p>
              <SelectFilter
                options={activeRating}
                valueCurr={selectedRating}
                changeValue={setSelectedRating}
              />
            </div>
            <div className={`${styles.slot} ${styles.selectInput}`}>
              <p className="textDefault">Entrega:</p>
              <SelectFilter
                options={activeDelivery}
                valueCurr={selectedDelivery}
                changeValue={setSelectedDelivery}
              />
            </div>
            <div className={`${styles.slot} ${styles.selectInput}`}>
              <label htmlFor="dataInicio" className="textDefault">
                Data inicial:
              </label>
              <Calendar
                id="dataInicio"
                className={styles.calendar}
                value={date.inicio}
                onChange={(e) => {
                  setDate({ ...date, inicio: e.value });
                }}
                showIcon
                dateFormat="dd/mm/yy"
              />
            </div>
            <div className={`${styles.slot} ${styles.selectInput}`}>
              <label htmlFor="dataFim" className="textDefault">
                Data final:
              </label>
              <Calendar
                id="dataFim"
                className={styles.calendar}
                value={date.fim}
                onChange={(e) => {
                  setDate({ ...date, fim: e.value });
                }}
                showIcon
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>
        </div>
        <div className={styles.openFilterModal}>
          <p
            onClick={() => {
              openModal();
            }}
            className={`${styles.filterBtn} ${"textDefault"}`}>
            <b>Filtros</b>
            <IconFilter
              className="icon"
              width="20px"
              height="20px"
              color={"var(--ap-primary)"}
            />
          </p>
          {feedback && (
            <p className="textSmall">
              Filtrado por:
              <br /> {feedback}
            </p>
          )}
        </div>
        {detrList.length > 0 && (
          <div className={styles.filters}>
            <p className={`${"textDefault"} ${styles.labelTags}`}>
              <b>Detratores:</b>
            </p>
            <div className={styles.detrTags}>
              <p
                className={`${selectedDetr !== "Todos" ? styles.detrTag : styles.detrTagActive} ${"textDefault"}`}
                onClick={() => {
                  setSelectedDetr("Todas");
                }}>
                Todas
              </p>
              {detrList.map((e) => (
                <p
                  key={e.key}
                  className={`${selectedDetr !== e.name ? styles.detrTag : styles.detrTagActive} ${"textDefault"}`}
                  onClick={() => {
                    setSelectedDetr(e.key);
                  }}>
                  {e.name}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} content={modalFilters} />
    </>
  );
};

export default FiltersVerb;
