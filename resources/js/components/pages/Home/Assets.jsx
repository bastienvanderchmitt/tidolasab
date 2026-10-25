import {
  IconAirConditioning,
  IconBabyCarriage,
  IconBath,
  IconBed,
  IconHome,
  IconParking,
  IconPool,
  IconUsers,
  IconWifi,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import classes from "./Assets.module.css";

const assets = [
  { icon: IconUsers, label: "assets.people" },
  { icon: IconPool, label: "assets.pool" },
  { icon: IconAirConditioning, label: "assets.clim" },
  { icon: IconBed, label: "assets.bed" },
  { icon: IconBath, label: "assets.bathroom" },
  { icon: IconHome, label: "assets.front" },
  { icon: IconWifi, label: "assets.wifi" },
  { icon: IconParking, label: "assets.parking" },
  { icon: IconBabyCarriage, label: "assets.baby" },
];

// Points forts du logement, en pastilles
const Assets = () => {
  const { t } = useTranslation();

  return (
    <ul className={classes.list}>
      {assets.map(({ icon: Icon, label }) => (
        <li key={label} className={classes.item}>
          <Icon size={18} stroke={1.6} />
          <span>{t(label)}</span>
        </li>
      ))}
    </ul>
  );
};

export default Assets;
