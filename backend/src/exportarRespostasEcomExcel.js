import ExcelJS from 'exceljs';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { pool } from './db.js';
import { exportarRespostasEcomPorPeriodo } from './repositories/exportarRespostasEcom.js';

function validarData(data) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return false;
  }

  const [ano, mes, dia] = data.split('-').map(Number);
  const dataValida = new Date(Date.UTC(ano, mes - 1, dia));

  return (
    dataValida.getUTCFullYear() === ano &&
    dataValida.getUTCMonth() === mes - 1 &&
    dataValida.getUTCDate() === dia
  );
}

async function gerarExcel() {
  const rl = createInterface({ input: stdin, output: stdout });

  try {
    // Recebe as datas pelo terminal
    const dataInicial = await rl.question(
      'Informe a data inicial (AAAA-MM-DD): ',
    );

    const dataFinal = await rl.question('Informe a data final (AAAA-MM-DD): ');

    // Valida as datas
    if (!validarData(dataInicial) || !validarData(dataFinal)) {
      console.log('\nInforme datas válidas no formato AAAA-MM-DD.');
      return;
    }

    if (dataInicial > dataFinal) {
      console.log('\nA data inicial não pode ser maior que a data final.');
      return;
    }

    console.log('\nConsultando respostas...');

    const respostas = await exportarRespostasEcomPorPeriodo(
      dataInicial,
      dataFinal,
    );

    if (respostas.length === 0) {
      console.log('\nNenhuma resposta encontrada nesse período.');
      return;
    }

    // Cria o Excel
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Dashboard NPS Supernosso';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('NPS_SN_allTime');

    worksheet.columns = [
      { header: 'data', key: 'data', width: 15 },
      ...Array.from({ length: 11 }, (_, nota) => ({
        header: String(nota),
        key: String(nota),
        width: 10,
      })),
    ];

    // Adiciona uma linha para cada resposta
    respostas.forEach((resposta) => {
      const dataFormatada = new Date(resposta.data).toLocaleDateString(
        'pt-BR',
        {
          timeZone: 'America/Sao_Paulo',
        },
      );

      const linha = {
        data: dataFormatada,
      };

      for (let nota = 0; nota <= 10; nota++) {
        linha[String(nota)] = resposta[String(nota)];
      }

      worksheet.addRow(linha);
    });

    // Formatação
    worksheet.getRow(1).font = { bold: true };

    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    // Nome do arquivo
    const caminhoArquivo = `./dados_nps_ecom_${dataInicial}_a_${dataFinal}.xlsx`;

    await workbook.xlsx.writeFile(caminhoArquivo);

    console.log('\nExcel gerado com sucesso!');
    console.log('Arquivo:', caminhoArquivo);
    console.log('Período:', dataInicial, 'até', dataFinal);
    console.log('Total de respostas:', respostas.length);
  } catch (error) {
    console.error('\nErro ao gerar Excel:', error);
  } finally {
    rl.close();
    await pool.end();
  }
}

gerarExcel();
