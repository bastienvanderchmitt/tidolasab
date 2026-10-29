import Reveal from "./Reveal";
import classes from "./SectionTitle.module.css";

// Sur-titre, titre et chapô d'une section
const SectionTitle = ({ eyebrow, title, children, align = "left" }) => (
  <Reveal className={classes.root} data-align={align}>
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    {title && <h2 className={classes.title}>{title}</h2>}
    {children && <div className={classes.text}>{children}</div>}
  </Reveal>
);

export default SectionTitle;
