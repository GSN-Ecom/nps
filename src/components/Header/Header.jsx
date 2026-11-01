import styles from './Header.module.css';
import { logo } from '../../assets/imgs/logo/logo';
import { NavLink } from 'react-router-dom';
import ChangeBusiness from '../../assets/icons/IconChangeBusiness';
import { useGlobal } from '../../hooks/useGlobal';
import { normalizeDateVerb } from '../../services/normalizeDate';

export default function Header() {
  const {
    setTypeBusiness,
    typeBusiness,
    setSelectedStore,
    setSelectedRating,
    setSelectedDelivery,
    date,
  } = useGlobal();

  return (
    <nav className={`${styles.navBar} ${'navBar'}`}>
      <div className="contentRow">
        <NavLink to="/" end>
          <img
            className={styles.logo}
            src={
              typeBusiness !== 'LojaF'
                ? logo.apoioEntrega.img
                : logo.apoioMineiro.img
            }
            alt={
              typeBusiness !== 'LojaF'
                ? logo.apoioEntrega.alt
                : logo.apoioMineiro.alt
            }
            title={
              typeBusiness !== 'LojaF'
                ? logo.apoioEntrega.title
                : logo.apoioMineiro.title
            }
          />
        </NavLink>
        <div className={styles.selectStore}></div>
      </div>
      <div className={styles.listLinks}>
        <NavLink to="/detratores" className={styles.link}>
          <p className="textDefault">Detratores</p>
        </NavLink>
        <NavLink to="/respostas" className={styles.link}>
          <p className="textDefault">Respostas</p>
        </NavLink>
        {typeBusiness !== 'LojaF' && (
          <NavLink to="/corte-substituicao" className={styles.link}>
            <p className="textDefault">Corte x Substituição</p>
          </NavLink>
        )}
        <NavLink
          to=""
          className={`${styles.link} ${styles.changeReport} ${'noPrint'}`}
          onClick={() => {
            const isEcom = typeBusiness === 'Ecom';
            setTypeBusiness(isEcom ? 'LojaF' : 'Ecom');
            setSelectedStore({
              nroempresa: true,
              name: 'Todas as lojas',
            });
            setSelectedDelivery({
              name: 'Todas',
            });
            setSelectedRating({
              name: 'Todas',
            });
          }}>
          <ChangeBusiness
            className="icon"
            width="16px"
            height="16px"
            color="#ce2b43"
          />
          <p className="textDefault">
            {typeBusiness !== 'LojaF' ? 'Mudar > Loja F.' : 'Mudar > Ecom'}
          </p>
        </NavLink>
        <div className={`${styles.printView} ${'date'}`}>
          <p className="textSmall">
            Relatório referente ao período {normalizeDateVerb(date.inicio)} até{' '}
            {normalizeDateVerb(date.fim)}
          </p>
        </div>
      </div>
    </nav>
  );
}
