const NUMBER_ROWS = 8;
const NUMBER_COLUMNS = 8;
const A_CHAR_CODE_INDEX = 65;
const URL = 'ws://127.0.0.1:3000/';

const socket = new WebSocket(URL);
const table = document.querySelector('.table');

socket.onmessage = function (message) {
  const data = JSON.parse(message.data);
  const { value, row, column } = data;

  const targetInput = document.querySelector(`input[data-row="${row}"][data-column="${column}"]`);

  if (targetInput) {
    targetInput.setAttribute('value', value);
  }
};

function sendMessage(message) {
  let data = message;

  if (typeof data !== 'string') {
    data = JSON.stringify(data);
  }
  socket.send(data);
}

function getCharByCode(code) {
  return String.fromCharCode(code);
}

function createThead() {

  let ths = '<th scope="col">#</th>';

  for (let i = 0; i < NUMBER_ROWS; i++) {
        ths = ths.concat(`<th scope="col">${ getCharByCode( A_CHAR_CODE_INDEX + i) }</th>`)
  }

  return `<thead><tr>${ths}</tr></thead>`;
}

function createTbody() {

  let result = '';

  for (let i = 0; i < NUMBER_ROWS + 1; i++) {

    let row = `<th scope="row">${i}</th>`;

    for (let j = 0; j < NUMBER_COLUMNS; j++) {
      row = row.concat(`
          <td>
            <input type="text" class="form-control" data-row="${i}" data-column="${getCharByCode(A_CHAR_CODE_INDEX + j)}">
          </td>`)
    }

    result = result.concat(`<tr>${row}</tr>`)
  }


  return `<tbody>${result}</tbody>`
}

table.insertAdjacentHTML("afterbegin", `${createThead()}${createTbody()}`);
table.addEventListener('input', ({target}) => {
  const message = { ...target.dataset, value: target.value };
  sendMessage(message);
});
