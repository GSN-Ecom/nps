import { Dropdown } from "primereact/dropdown";
import styles from "./SelectFilter.module.css";

export default function SelectFilter({ options, valueCurr, changeValue }) {
  return (
    <div className="card flex justify-content-center">
      <Dropdown
        key={valueCurr}
        disabled={options.length > 0 ? false : true}
        value={valueCurr}
        onChange={(e) => changeValue(e.value)}
        options={options}
        optionLabel="name"
        placeholder={valueCurr}
        appendTo={document.body}
        className={`${"w-full md:w-14rem"} ${styles.dropdown}`}
      />
    </div>
  );
}
