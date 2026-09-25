const microMacro = {
  det_atendimento: "atendimento",
  det_pagamento: "pagamento",
  det_siteApp: "siteApp",
  det_retirada: "retirada",
  det_entrega: "entrega",
  det_preco: "preco",
  det_produto: "produto",
};

// contabilizar detratores
export default function calcVerb(dados, arrDetrList) {
  const contador = {};

  dados.forEach((resp) => {
    arrDetrList.forEach((campo) => {
      const texto = resp[campo];

      if (!texto) return;

      const macro = microMacro[campo];

      const textos = texto
        .split(/[,;]/)
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      textos.forEach((t) => {
        const chave = `${macro}-${t}`;

        if (!contador[chave]) {
          contador[chave] = {
            texto: t,
            quantidade: 0,
            macro,
          };
        }

        contador[chave].quantidade++;
      });
    });
  });

  return Object.values(contador);
}
