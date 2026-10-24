/**
 * Librairies CommonJS dont l'export par défaut arrive enveloppé sous Vite
 * ({ default: Composant } au lieu du composant) : on récupère le vrai composant.
 */
import SlickSlider from "react-slick";
import ApexChart from "react-apexcharts";

const unwrap = (mod) => mod?.default ?? mod;

export const Slider = unwrap(SlickSlider);
export const Chart = unwrap(ApexChart);
