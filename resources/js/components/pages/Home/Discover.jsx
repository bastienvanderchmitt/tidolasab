import { Link } from "react-router-dom";
import { Button, Container, SimpleGrid } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import mg_beach from "../../../assets/img/locations/location_4.webp";
import SectionTitle from "../../common/SectionTitle";
import classes from "./Home.module.css";

const Discover = () => {
  const { t } = useTranslation();

  return (
    <section className={`section ${classes.tinted}`}>
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={56} className={classes.split}>
          <div>
            <SectionTitle eyebrow={t("discover.title")} title={t("discover.image_title")}>
              <p>{t("discover.description")}</p>
            </SectionTitle>
            <Button
              component={Link}
              to="/activities"
              variant="outline"
              color="lagon.8"
              rightSection={<IconArrowRight size={18} />}
            >
              {t("discover.see")}
            </Button>
          </div>
          <Link to="/activities" className={classes.photo}>
            <img src={mg_beach} alt="" loading="lazy" />
          </Link>
        </SimpleGrid>
      </Container>
    </section>
  );
};

export default Discover;
