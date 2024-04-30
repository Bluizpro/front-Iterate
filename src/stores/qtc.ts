interface QtcStorage {
  data: Date;
  hora: string;
  conjunto: number;
  usuario: string;
  paciente: string;
  informacoes: string;
}

let qtcInfors: QtcStorage[] = [];

function salvarInfor(qtcInfor: QtcStorage) {
  qtcInfors.push(qtcInfor);
  localStorage.setItem('qtcInfors', JSON.stringify(qtcInfors));
}

function carregarInfors() {
  const savedInfors = localStorage.getItem('qtcInfors');

  if (savedInfors) {
    qtcInfors = JSON.parse(savedInfors);
  }
}
