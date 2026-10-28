import { Badge, Container, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { IconHome, IconMapPin, IconWheelchair } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import air_conditioning from "../../../assets/img/icons/air_conditioning.png";
import breakfast from "../../../assets/img/icons/breakfast.png";
import coffee_machine from "../../../assets/img/icons/coffee_machine.png";
import douche from "../../../assets/img/icons/douche.png";
import electric_kettle from "../../../assets/img/icons/electric_kettle.png";
import fridge from "../../../assets/img/icons/fridge.png";
import microwave from "../../../assets/img/icons/microwave.png";
import serviette from "../../../assets/img/icons/serviette.png";
import stove from "../../../assets/img/icons/stove.png";
import toaster from "../../../assets/img/icons/toaster.png";
import toilets from "../../../assets/img/icons/toilets.png";
import wifi_signal from "../../../assets/img/icons/wifi_signal.png";
import speaker from "../../../assets/img/icons/speaker.png";
import cooking_robot from "../../../assets/img/icons/cooking_robot.png";
import room_1 from "../../../assets/img/room/room_1.webp";
import room_2 from "../../../assets/img/room/room_2.webp";
import room_4 from "../../../assets/img/room/room_4.webp";
import room_5 from "../../../assets/img/room/room_5.webp";
import room_7 from "../../../assets/img/room/room_7.webp";
import view_2 from "../../../assets/img/room/view_2.webp";
import view_3 from "../../../assets/img/room/view_3.webp";
import Assets from "../Home/Assets";
import PhotoGallery from "../../common/PhotoGallery";
import classes from "./Room.module.css";

const beaches = [
  "Folle Anse",
  "Anse Bambou",
  "Anse de Mays",
  "Anse Canot",
  "Vieux Fort",
  "Grand-Bourg",
  "la Feuillère et petite Anse",
];

// Ordre pensé pour la mosaïque : grande photo, deux petites, puis les larges
const photos = [view_2, room_2, room_7, view_3, room_5, room_4, room_1];

/**
 * Présentation du logement, sous le module de réservation.
 */
const Room = () => {
  const { t } = useTranslation();

  const amenities = [
    { icon: wifi_signal, text: t("amenities.wifi") },
    { icon: air_conditioning, text: t("amenities.clim") },
    { icon: stove, text: t("amenities.hob") },
    { icon: microwave, text: t("amenities.micro-wave") },
    { icon: coffee_machine, text: t("amenities.coffee") },
    { icon: fridge, text: t("amenities.fridge") },
    { icon: toaster, text: t("amenities.toaster") },
    { icon: electric_kettle, text: t("amenities.kettle") },
    { icon: breakfast, text: t("amenities.dishes") },
    { icon: douche, text: t("amenities.shower") },
    { icon: toilets, text: t("amenities.wc") },
    { icon: serviette, text: t("amenities.towels") },
    { icon: speaker, text: t("amenities.speaker") },
    { icon: cooking_robot, text: t("amenities.robot") },
  ];

  return (
    <Container size="lg" className="section">
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={56}>
        <Stack gap="lg">
          <div>
            <Text className="eyebrow">{t("accommodation.breadcrumb")}</Text>
            <h2 className={classes.title}>Case Ti' Dola Sab</h2>
          </div>
          <Assets />
          <Group gap={8} c="dimmed">
            <IconWheelchair size={18} />
            <Text size="sm" fs="italic">
              {t("accommodation.pmr")}
            </Text>
          </Group>
        </Stack>

        <Stack gap="sm" className={classes.text}>
          <h3 className={classes.subtitle}>
            <IconHome size={20} /> {t("room.accommodation")}
          </h3>
          <p>{t("room.description_1")}</p>
          <p>
            {t("room.description_2_1")}
            <sup>2</sup>
            {t("room.description_2_2")}
          </p>
          <p>{t("room.description_3")}</p>
          <p>{t("room.description_4")}</p>
          <h3 className={classes.subtitle}>
            <IconMapPin size={20} /> {t("room.access_title")}
          </h3>
          <p>{t("room.access_description")}</p>
        </Stack>
      </SimpleGrid>

      <div className={classes.block}>
        <PhotoGallery photos={photos} mosaic />
      </div>

      <div className={classes.block}>
        <p className={`${classes.handTitle} handwritten`}>{t("room.beaches")}</p>
        <Group gap="xs">
          {beaches.map((beach) => (
            <Badge key={beach} size="lg" variant="light" color="lagon" c="lagon.8" radius="xl" tt="none">
              {beach}
            </Badge>
          ))}
        </Group>
      </div>

      <div className={classes.block}>
        <h2 className={classes.title}>{t("room.equipments")}</h2>
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md" mt="lg">
          {amenities.map((amenity) => (
            <div key={amenity.text} className={classes.amenity}>
              <img src={amenity.icon} alt="" loading="lazy" />
              <span>{amenity.text}</span>
            </div>
          ))}
        </SimpleGrid>
      </div>
    </Container>
  );
};

export default Room;
