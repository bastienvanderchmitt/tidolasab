/**
 * Montant d'une ligne de CA (année, mois ou type) selon les options d'affichage.
 * Une ligne contient : confirmed, draft, tax_confirmed, tax_draft.
 *
 * @param {object} row
 * @param {{ withDrafts: boolean, withTax: boolean }} options
 */
export const revenueAmount = (row, { withDrafts, withTax }) => {
  if (!row) return 0;

  const amount = row.confirmed + (withDrafts ? row.draft : 0);
  const tax = row.tax_confirmed + (withDrafts ? row.tax_draft : 0);

  return Math.round((withTax ? amount : amount - tax) * 100) / 100;
};
