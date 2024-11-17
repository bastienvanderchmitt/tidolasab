import React from "react";
import {
  priceHightSeason,
  priceLowSeason,
  touristTax,
} from "../../../helpers/env";
import { useBookingContext } from "../../../contexts/BookingContext";
import { getFrenchDate } from "../../../helpers/dates";
import { useTranslation } from "react-i18next";
import { Input, InputGroup, InputGroupText } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEuro } from "@fortawesome/free-solid-svg-icons";

const Price = ({ withParticipants, isAdmin }) => {
  const { t } = useTranslation();
  const {
    total,
    setTotal,
    days,
    daysHighSeason,
    daysLowSeason,
    discount,
    selectedDates,
    adults,
    child,
    type,
  } = useBookingContext();
  return (
    <>
      {days && (
        <>
          <div className="content-detail">
            <span className="title-total">{t("price.nights")}</span>
            <span className="total">{days}</span>
          </div>
          <div className="content-total">
            <span className="title-sub-total">
              {t("price.from")} {getFrenchDate(selectedDates[0])}{" "}
              {t("price.to")} {getFrenchDate(selectedDates[1], true)}
            </span>
          </div>
        </>
      )}
      {withParticipants && (
        <>
          <div className="content-detail">
            <span className="title-sub-total text-capitalize">
              {t("price.adult")}
              {+adults > 1 && "s"} :
            </span>
            <span className="sub-total">
              {adults} {t("price.adult")}
              {+adults > 1 && "s"}
            </span>
          </div>
          {child ? (
            <div className="content-detail">
              <span className="title-sub-total text-capitalize">
                {+child > 1 ? t("price.child") : t("price.children")} :
              </span>
              <span className="sub-total">
                {child} {+child > 1 ? t("price.child") : t("price.children")}
              </span>
            </div>
          ) : null}
        </>
      )}
      {type === "Classique" ? (
        <>
          {daysHighSeason ? (
            <div className="content-total">
              <span className="title-sub-total">
                {t("price.high_season_price")} ({priceHightSeason} €) x{" "}
                {daysHighSeason} {t("common.days")} :
              </span>
              <span className="sub-total">
                {daysHighSeason * priceHightSeason + " €"}
              </span>
            </div>
          ) : null}
          {daysLowSeason ? (
            <div className="content-total">
              <span className="title-sub-total">
                {t("price.low_season_price")} ({priceLowSeason} €) x{" "}
                {daysLowSeason} {t("common.days")} :
              </span>
              <span className="sub-total">
                {daysLowSeason * priceLowSeason + " €"}
              </span>
            </div>
          ) : null}
          {days && (
            <div className="content-detail">
              <span className="title-sub-total">{t("price.tax")}</span>
              <span className="sub-total">{days * adults * touristTax} €</span>
            </div>
          )}
          {discount ? (
            <div className="content-detail text-success">
              <span className="title-sub-total">{t("price.discount")}</span>
              <span className="sub-total">- {discount} €</span>
            </div>
          ) : null}
        </>
      ) : null}
      {type !== "Fermeture" && (
        <div className="content-total">
          <span className="title-total">{t("price.total")}</span>
          {isAdmin ? (
            <InputGroup className="total" style={{ width: "150px" }}>
              <Input
                type="number"
                onChange={(e) => setTotal(e.currentTarget.value)}
                value={total}
              />
              <InputGroupText>
                <FontAwesomeIcon icon={faEuro} />
              </InputGroupText>
            </InputGroup>
          ) : (
            <span className="total">{total ? total + " €" : ""}</span>
          )}
        </div>
      )}
    </>
  );
};

export default Price;
