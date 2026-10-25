import { Container } from "@mantine/core";
import { useTranslation } from "react-i18next";
import location_1 from "../../assets/img/locations/location_1.webp";
import location_2 from "../../assets/img/locations/location_2.webp";
import location_3 from "../../assets/img/locations/location_3.webp";
import location_4 from "../../assets/img/locations/location_4.webp";
import location_5 from "../../assets/img/locations/location_5.webp";
import location_7 from "../../assets/img/locations/location_7.webp";
import location_9 from "../../assets/img/locations/location_9.webp";
import location_10 from "../../assets/img/locations/location_10.webp";
import location_11 from "../../assets/img/locations/location_11.webp";
import location_12 from "../../assets/img/locations/location_12.webp";
import location_14 from "../../assets/img/locations/location_14.webp";
import location_15 from "../../assets/img/locations/location_15.webp";
import location_16 from "../../assets/img/locations/location_16.webp";
import location_17 from "../../assets/img/locations/location_17.webp";
import location_20 from "../../assets/img/locations/location_20.webp";
import location_21 from "../../assets/img/locations/location_21.webp";
import location_22 from "../../assets/img/locations/location_22.webp";
import location_26 from "../../assets/img/locations/location_26.webp";
import location_27 from "../../assets/img/locations/location_27.webp";
import location_28 from "../../assets/img/locations/location_28.webp";
import location_29 from "../../assets/img/locations/location_29.webp";
import location_30 from "../../assets/img/locations/location_30.webp";
import location_31 from "../../assets/img/locations/location_31.webp";
import location_32 from "../../assets/img/locations/location_32.webp";
import location_33 from "../../assets/img/locations/location_33.webp";
import location_34 from "../../assets/img/locations/location_34.webp";
import location_35 from "../../assets/img/locations/location_35.webp";
import location_36 from "../../assets/img/locations/location_36.webp";
import location_37 from "../../assets/img/locations/location_37.webp";
import location_38 from "../../assets/img/locations/location_38.webp";
import location_39 from "../../assets/img/locations/location_39.webp";
import location_40 from "../../assets/img/locations/location_40.webp";
import location_41 from "../../assets/img/locations/location_41.webp";
import location_42 from "../../assets/img/locations/location_42.webp";
import location_43 from "../../assets/img/room/view_2.webp";
import location_44 from "../../assets/img/room/view_3.webp";
import room_1 from "../../assets/img/room/room_1.webp";
import room_2 from "../../assets/img/room/room_2.webp";
import room_4 from "../../assets/img/room/room_4.webp";
import room_5 from "../../assets/img/room/room_5.webp";
import room_7 from "../../assets/img/room/room_7.webp";
import location_45 from "../../assets/img/locations/location_45.webp";
import location_46 from "../../assets/img/locations/location_46.webp";
import SectionTitle from "../common/SectionTitle";
import PhotoGallery from "../common/PhotoGallery";

const photos = [
  location_26,
  location_14,
  location_32,
  location_31,
  location_28,
  location_41,
  location_27,
  location_29,
  location_1,
  location_2,
  location_42,
  location_12,
  location_43,
  location_3,
  location_7,
  location_20,
  location_10,
  location_9,
  location_22,
  location_44,
  room_1,
  room_2,
  room_4,
  room_5,
  room_7,
  location_4,
  location_11,
  location_17,
  location_35,
  location_16,
  location_15,
  location_5,
  location_21,
  location_30,
  location_33,
  location_34,
  location_36,
  location_40,
  location_37,
  location_39,
  location_38,
  location_45,
  location_46,
];

const Photos = () => {
  const { t } = useTranslation();

  return (
    <Container size="xl" className="section">
      <SectionTitle
        align="center"
        eyebrow={t("photos.title")}
        title={t("photos.subtitle")}
      >
        <p>{t("photos.description")}</p>
        <p>{t("photos.sub_description")}</p>
      </SectionTitle>
      <PhotoGallery photos={photos} columns={4} />
    </Container>
  );
};

export default Photos;
