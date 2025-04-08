import { useState } from "react";
import style from "./BarreRecherche.module.css";

const BarreRecherche = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };
  return (
    <div className={style.recherche}>
      <input
        type="text"
        placeholder="Rechercher"
        value={query}
        onChange={handleChange}
        className={style.inputRecherche}
      />
    </div>
  );
};

export default BarreRecherche;
