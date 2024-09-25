import React from "react";
import {
  priceHightSeason,
  priceLowSeason,
  touristTax,
} from "../../../helpers/env";
import { useBookingContext } from "../../../contexts/BookingContext";
import { getFrenchDate } from "../../../helpers/dates";

const Price = ({ withParticipants }) => {
  const {
    total,
    days,
    daysHighSeason,
    daysLowSeason,
    discount,
    selectedDates,
    adults,
    child,
  } = useBookingContext();
  return (
    <>
      {days && (
        <>
          <div className="content-detail">
            <span className="title-total">Nombre de nuits :</span>
            <span className="total">{days}</span>
          </div>
          <div className="content-total">
            <span className="title-sub-total">
              du {getFrenchDate(selectedDates[0])} au{" "}
              {getFrenchDate(selectedDates[1], true)}
            </span>
          </div>
        </>
      )}
      {withParticipants && (
        <>
          <div className="content-detail">
            <span className="title-sub-total">
              Adulte{+adults > 1 && "s"} :
            </span>
            <span className="sub-total">
              {adults} adulte{+adults > 1 && "s"}
            </span>
          </div>
          {child ? (
            <div className="content-detail">
              <span className="title-sub-total">
                Enfant{+child > 1 && "s"} :
              </span>
              <span className="sub-total">
                {child} enfant{+child > 1 && "s"}
              </span>
            </div>
          ) : null}
        </>
      )}
      {daysHighSeason ? (
        <div className="content-total">
          <span className="title-sub-total">
            Tarif haute saison ({priceHightSeason} €) x {daysHighSeason} jours :
          </span>
          <span className="sub-total">
            {daysHighSeason * priceHightSeason + " €"}
          </span>
        </div>
      ) : null}
      {daysLowSeason ? (
        <div className="content-total">
          <span className="title-sub-total">
            Tarif basse saison ({priceLowSeason} €) x {daysLowSeason} jours :
          </span>
          <span className="sub-total">
            {daysLowSeason * priceLowSeason + " €"}
          </span>
        </div>
      ) : null}
      {days && (
        <div className="content-detail">
          <span className="title-sub-total">Taxe de séjour :</span>
          <span className="sub-total">{days * adults * touristTax} €</span>
        </div>
      )}
      {discount ? (
        <div className="content-detail text-success">
          <span className="title-sub-total">Réduction :</span>
          <span className="sub-total">- {discount} €</span>
        </div>
      ) : null}
      <div className="content-total">
        <span className="title-total">Total :</span>
        <span className="total">{total ? total + " €" : ""}</span>
      </div>
    </>
  );
};

export default Price;
