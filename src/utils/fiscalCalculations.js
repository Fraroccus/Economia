// Calcolo del netto per dipendenti
export const calcolaNettoStipendio = (lordo, irpefAliquota, detrazioni) => {
  const irpef = lordo * (irpefAliquota / 100);
  const detrazioneTotale = detrazioni || 0;
  const netto = lordo - irpef + detrazioneTotale;
  return Math.max(0, netto);
};

// Calcolo del netto per P.IVA Forfettario
export const calcolaNettoForfettario = (lordo, coefficienteRedditivita, aliquotaSostitutiva, contributiInps) => {
  const redditoImponibile = lordo * (coefficienteRedditivita / 100);
  const impostaSostitutiva = redditoImponibile * (aliquotaSostitutiva / 100);
  const contributi = redditoImponibile * ((contributiInps || 26.23) / 100);
  const netto = lordo - impostaSostitutiva - contributi;
  return Math.max(0, netto);
};

// Calcolo del netto per P.IVA Ordinario
export const calcolaNettoOrdinario = (
  lordo,
  aliquoteIrpef,
  addizionaleRegionale,
  addizionaleComunale,
  contributiInps
) => {
  // Scaglioni IRPEF 2024 (default)
  const scaglioni = aliquoteIrpef || [
    { limite: 15000, aliquota: 23 },
    { limite: 28000, aliquota: 25 },
    { limite: 50000, aliquota: 35 },
    { limite: Infinity, aliquota: 43 }
  ];
  
  let irpef = 0;
  let residuo = lordo;
  let precedente = 0;
  
  for (const scaglione of scaglioni) {
    const imponibileScaglione = Math.min(residuo, scaglione.limite - precedente);
    if (imponibileScaglione <= 0) break;
    
    irpef += imponibileScaglione * (scaglione.aliquota / 100);
    residuo -= imponibileScaglione;
    precedente = scaglione.limite;
    
    if (residuo <= 0) break;
  }
  
  const addRegionale = lordo * ((addizionaleRegionale || 0) / 100);
  const addComunale = lordo * ((addizionaleComunale || 0) / 100);
  const contributi = lordo * ((contributiInps || 26.23) / 100);
  
  const netto = lordo - irpef - addRegionale - addComunale - contributi;
  return Math.max(0, netto);
};

// Calcolo del netto in base al regime
export const calcolaNettoEntrata = (lordo, tipoEntrata, userSettings) => {
  if (!userSettings) {
    return lordo; // Se non ci sono impostazioni, ritorna il lordo
  }
  
  // Se il tipo è "Altro", non applicare calcoli fiscali
  if (tipoEntrata === 'Altro') {
    return lordo;
  }
  
  // Se il tipo è "Stipendio", applica i calcoli in base al regime
  switch (userSettings.regime_type) {
    case 'Dipendente':
      return calcolaNettoStipendio(
        lordo,
        userSettings.irpef_aliquota,
        userSettings.detrazioni
      );
      
    case 'P.IVA Forfettario':
      return calcolaNettoForfettario(
        lordo,
        userSettings.coefficiente_redditivita,
        userSettings.aliquota_sostitutiva,
        userSettings.contributi_inps
      );
      
    case 'P.IVA Ordinario':
      return calcolaNettoOrdinario(
        lordo,
        userSettings.aliquote_irpef,
        userSettings.addizionale_regionale,
        userSettings.addizionale_comunale,
        userSettings.contributi_inps
      );
      
    default:
      return lordo; // Per "Altro" regime
  }
};

// Calcolo stima fiscale annuale
export const calcolaStimeFiscaliAnnuali = (ralPrevista, userSettings) => {
  if (!ralPrevista || !userSettings) {
    return null;
  }
  
  let imposte = 0;
  let contributiInps = 0;
  let netto = 0;
  
  switch (userSettings.regime_type) {
    case 'Dipendente':
      imposte = ralPrevista * ((userSettings.irpef_aliquota || 23) / 100);
      netto = ralPrevista - imposte + (userSettings.detrazioni || 0);
      break;
      
    case 'P.IVA Forfettario':
      const redditoImponibile = ralPrevista * ((userSettings.coefficiente_redditivita || 78) / 100);
      imposte = redditoImponibile * ((userSettings.aliquota_sostitutiva || 15) / 100);
      contributiInps = redditoImponibile * ((userSettings.contributi_inps || 26.23) / 100);
      netto = ralPrevista - imposte - contributiInps;
      break;
      
    case 'P.IVA Ordinario':
      const scaglioni = userSettings.aliquote_irpef || [
        { limite: 15000, aliquota: 23 },
        { limite: 28000, aliquota: 25 },
        { limite: 50000, aliquota: 35 },
        { limite: Infinity, aliquota: 43 }
      ];
      
      let irpef = 0;
      let residuo = ralPrevista;
      let precedente = 0;
      
      for (const scaglione of scaglioni) {
        const imponibileScaglione = Math.min(residuo, scaglione.limite - precedente);
        if (imponibileScaglione <= 0) break;
        
        irpef += imponibileScaglione * (scaglione.aliquota / 100);
        residuo -= imponibileScaglione;
        precedente = scaglione.limite;
        
        if (residuo <= 0) break;
      }
      
      const addRegionale = ralPrevista * ((userSettings.addizionale_regionale || 0) / 100);
      const addComunale = ralPrevista * ((userSettings.addizionale_comunale || 0) / 100);
      imposte = irpef + addRegionale + addComunale;
      contributiInps = ralPrevista * ((userSettings.contributi_inps || 26.23) / 100);
      netto = ralPrevista - imposte - contributiInps;
      break;
      
    default:
      netto = ralPrevista;
  }
  
  return {
    imposte: Math.max(0, imposte),
    contributiInps: Math.max(0, contributiInps),
    netto: Math.max(0, netto)
  };
};
