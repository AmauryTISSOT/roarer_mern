const Bouton = ({ onClick, label, children, className }) => {
  return (
    <div>
      <button className={className} onClick={onClick}>
        {children}
        {label}
      </button>
    </div>
  );
};

export default Bouton;
