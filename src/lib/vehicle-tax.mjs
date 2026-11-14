const dzveliAccizisTarifebi = [1.5, 1.5, 1.5, 1.4, 1.2, 1.0, 0.8, 0.8, 0.8, 0.9, 1.1, 1.3, 1.5, 1.8, 2.1, 2.4];

/**
 * @param {{
 *   manufactureYear: number,
 *   declarationYear: number,
 *   engineCc: number,
 *   steering: string,
 *   hybrid: boolean,
 *   classicCar: boolean,
 *   isElectric: boolean,
 *   preAprilRegime: boolean
 * }} input
 * @returns {{
 *   age: number,
 *   eligibleYear: boolean,
 *   validEngine: boolean,
 *   validVehicleType: boolean,
 *   rate: number,
 *   excise: number,
 *   importDuty: number
 * }}
 */
export function calculateVehicleTaxes({
  manufactureYear: gamoSvebisWeli,
  declarationYear: deklaraciisWeli,
  engineCc: dzravisCc,
  steering: sachisMdebareoba,
  hybrid: hibridia,
  classicCar: klasikuria,
  isElectric: eleqtrulia,
  preAprilRegime: dzveliRegimi
}) {
  const asaki = deklaraciisWeli - gamoSvebisWeli;
  const weliSworia = asaki >= 0;
  const dzraviSworia = eleqtrulia || (Number.isFinite(dzravisCc) && dzravisCc > 0);
  const manqanaSworia = !klasikuria || asaki > 30;
  const asakiTarifistvis = Math.max(0, asaki);

  let tarifi = 0;

  if (dzveliRegimi) {
    const tarifikisIndexi = Math.min(asakiTarifistvis, dzveliAccizisTarifebi.length - 1);
    tarifi = dzveliAccizisTarifebi[tarifikisIndexi];
  } else if (asakiTarifistvis <= 6) {
    tarifi = 1.5;
  } else {
    tarifi = 4.5;
  }

  if (klasikuria && asakiTarifistvis > 30) {
    tarifi = 1;
  }

  if (!eleqtrulia && !klasikuria) {
    if (sachisMdebareoba === "right") {
      tarifi *= 3;
    } else if (hibridia && asakiTarifistvis <= 6) {
      tarifi *= 0.4;
    }
  }

  let accizi = 0;

  if (weliSworia && dzraviSworia && manqanaSworia) {
    if (eleqtrulia) {
      if (sachisMdebareoba === "right") {
        accizi = dzveliRegimi ? tarifi * 2000 : 3000;
      }
    } else if (klasikuria && asakiTarifistvis > 30) {
      accizi = dzravisCc;
    } else {
      accizi = dzravisCc * tarifi;
    }
  }

  let importisGadasaxadi = 0;

  if (weliSworia && dzraviSworia && manqanaSworia && !eleqtrulia) {
    importisGadasaxadi = dzravisCc * 0.05 * (1 + asakiTarifistvis * 0.05);
  }

  return {
    age: asaki,
    eligibleYear: weliSworia,
    validEngine: dzraviSworia,
    validVehicleType: manqanaSworia,
    rate: tarifi,
    excise: accizi,
    importDuty: importisGadasaxadi
  };
}
