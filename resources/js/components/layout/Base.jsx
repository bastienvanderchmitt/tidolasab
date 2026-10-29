import { Outlet, ScrollRestoration, useMatches } from "react-router-dom";
import Header from "./Header";
import Hero from "./Hero";
import Footer from "./Footer";
import QuickBookingBar from "../booking/QuickBookingBar";
import { pages } from "../../helpers/pages";

const Base = () => {
  const matches = useMatches();
  const page = matches.findLast((match) => match.handle)?.handle ?? pages.home;

  return (
    <>
      <ScrollRestoration />
      <Header />
      {/* Clé par page : la bannière rejoue son entrée à chaque navigation */}
      <Hero key={page.title} page={page} />
      {!page.hideQuickBooking && <QuickBookingBar />}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Base;
