import './App.css';
import { useState } from "react";
import axios from "axios";
import reactStringReplace from 'react-string-replace';

function App() {
  const [docName, setDocName] = useState('');
  const [docContent, setDocContent] = useState('');
  const [docTitle, setDocTitle] = useState('');

  const [findWord, setFindWord] = useState('');
  const [coef, setCoef] = useState('');
  const [isFounded, setIsFounded] = useState(false);

  const [text, setText] = useState('');

  const [foundedDocs, setFoundedDocs] = useState([])

  const handleFindDoc = (e) => {
    e.preventDefault();
    axios.get(`http://localhost:3001/documents?word=${findWord}`)
        .then(response => {
          console.log('res: ', response.data)
          if (response.data.length) {
            setFoundedDocs(response.data.map((doc) => ({
              ...doc,
              content: reactStringReplace(doc.content, findWord, (match, i) => <b key={`${match}-${i}`}>{match}</b>),
              key: doc.title,
            })))
            // setFoundDocTitle(response.data.title);
            // setFoundDocContent(response.data.content);
          }
          else {
            // setFoundDocTitle('Не найдено');
            setFoundedDocs([{
              name: 'Поиск не дал результатов!',
              key: 'res-error-2',
              content: ' ',
            }])
          }

          if (!isFounded) {
            setIsFounded(true);
          }
          console.log(response);
        })
        .catch(error => {
          setIsFounded(false);
          setFoundedDocs([{
            name: 'Ошибка соединения!',
            key: 'res-error-1',
            content: ' ',
          }])
          console.log(error);
        });
  }

  return (
    <main>
      <div className='forms-container'>
        <form method={'POST'} className="form">
          <h2>Выполнили:</h2>
          <h3>Клинцов Антон</h3>
          <h3>Нестеров Евгений</h3>
          <h3>Бокитько Антон</h3>
          {/* <input
              name={'name'}
              placeholder={'Название'}
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="form-input"
          />
          <input
              name={'content'}
              value={docContent}
              placeholder={'Содержимое'}
              onChange={(e) => setDocContent(e.target.value)}
              className="form-input"
          />
          <input
              name={'title'}
              placeholder={'Заголовок'}
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="form-input"
          />
          <button
              type={'submit'}
              onClick={handleCreateDoc}
              className="form-button"
          >
            Сохранить
          </button> */}
        </form>
        <form method={'GET'} className="form second-form">
          <h2>Поиск по слову</h2>
          <input
              name={'name'}
              onChange={(e) => setFindWord(e.target.value)}
              className="form-input"
              placeholder={'Поиск...'}
          />
          <button
              type={'submit'}
              onClick={handleFindDoc}
              className="form-button"
          >
            Найти
          </button>
        </form>
      </div>
      <div className='found-document'>
        {
          foundedDocs.map((doc) => (
            <div key={doc.key}>
              <h3>{doc.name}</h3>
              <p>{doc.content}</p>
              <hr />
            </div>
          ))
        }
      </div>
    </main>
  );
}

export default App;
