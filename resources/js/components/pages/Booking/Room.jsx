import { Badge, Container, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import {
  IconAirConditioning,
  IconBlender,
  IconBread,
  IconCoffee,
  IconCooker,
  IconCup,
  IconDeviceSpeaker,
  IconDroplets,
  IconFridge,
  IconHanger,
  IconHome,
  IconMapPin,
  IconMicrowave,
  IconToiletPaper,
  IconToolsKitchen2,
  IconWheelchair,
  IconWifi,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
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
    { icon: IconWifi, text: t("amenities.wifi") },
    { icon: IconAirConditioning, text: t("amenities.clim") },
    { icon: IconCooker, text: t("amenities.hob") },
    { icon: IconMicrowave, text: t("amenities.micro-wave") },
    { icon: IconCoffee, text: t("amenities.coffee") },
    { icon: IconFridge, text: t("amenities.fridge") },
    { icon: IconBread, text: t("amenities.toaster") },
    { icon: IconCup, text: t("amenities.kettle") },
    { icon: IconToolsKitchen2, text: t("amenities.dishes") },
    { icon: IconDroplets, text: t("amenities.shower") },
    { icon: IconToiletPaper, text: t("amenities.wc") },
    { icon: IconHanger, text: t("amenities.towels") },
    { icon: IconDeviceSpeaker, text: t("amenities.speaker") },
    { icon: IconBlender, text: t("amenities.robot") },
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
          <Group gap={8} c="dimmed" wrap="nowrap" align="flex-start">
            <IconWheelchair size={18} style={{ flex: "none", marginTop: 2 }} />
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
          {amenities.map(({ icon: Icon, text }) => (
            <div key={text} className={classes.amenity}>
              <span className={classes.amenityIcon}>
                <Icon size={20} stroke={1.6} />
              </span>
              <span>{text}</span>
            </div>
          ))}
        </SimpleGrid>
      </div>
    </Container>
  );
};

export default Room;
