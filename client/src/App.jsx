import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(transactions => {setTransactions(transactions)});
  }, [transactions])

  async function getTransactions() {
    const url = import.meta.env.VITE_API_URL + '/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = import.meta.env.VITE_API_URL + '/transaction';
    fetch(url, {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({
        price,
        name, 
        description, 
        datetime})
    }).then(response => {
      response.json().then(json => {
        setName('');
        setDatetime('');
        setDescription('');
        setPrice('');
      });
    });
  }

  let balance = 0;
  for(const transaction of transactions) {
    balance = balance + transaction.price;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];
  return (
    <main className='bg-slate-800 text-white min-h-screen p-12 px-20'>
      <h1 className={'text-center text-6xl ' + (balance < 0 ? 'red' :'green')}>${balance}<span>{fraction}</span></h1>
        <form  className="mt-10 "
               onSubmit={addNewTransaction}>
          <div className='flex justify-center'>
            <div className='basic inline-grid grid-rows-3 grid-cols-3 gap-4 mx-auto'>
              <input className='rounded-md col-span-1 px-2 border-4 border-gray-400 bg-slate-800' 
                     type="number" 
                     value={price}
                     onChange={ev => setPrice(ev.target.value)}
                     placeholder="+/-  200"/>
              <input className='rounded-md col-span-2 px-2 border-4 border-gray-400 bg-slate-800' 
                     type="text" 
                     value={name}
                     onChange={ev => setName(ev.target.value)}
                     placeholder=" income/bill heading"/>
              <input className='rounded-md col-span-1 px-2 border-4 border-gray-400 bg-slate-800 text-gray-400  ' 
                     type="datetime-local"
                     value={datetime}
                     onChange={ev => setDatetime(ev.target.value)} />
              <input className='rounded-md col-span-2 px-2 border-4 border-gray-400 bg-slate-800' 
                     type="text" 
                     value={description}
                     onChange={ev => setDescription(ev.target.value)}
                     placeholder={' income/bill description'}/>
              <button className='rounded-md col-span-3 bg-gray-400 p-2 border-1 border-gray-500 cursor-pointer' 
                      type="submit">Add new transaction</button>
            </div>
          </div> 
        </form>

        <div className="transactions text-xl mt-8 max-w-screen-md mx-auto">
          {transactions.length > 0 && transactions.map((transaction, index) => (
            <div key={index} className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div className={"price " + (transaction.price > 0 ? 'green' : 'red')}>{transaction.price}</div>
                <div className="datetime">{new Date(transaction.datetime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                })}</div>
              </div>
            </div>
          ))}
        </div> 
    </main>
  )
}

export default App
