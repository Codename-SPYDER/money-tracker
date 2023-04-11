import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [reload, setReload] = useState(true);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    getTransactions().then(response => setTransactions(response));
  }, [reload])

  function toggleHelp() {
		setHelp(!help);
	}

  async function getTransactions() {
    const url = import.meta.env.VITE_API_URL + '/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    if (!name || !datetime || !description || !price) {
      alert("Please fill out all fields");
      return;
    } else {
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
          setReload(!reload);
        });
      });
    }
  }

  let balance = 0;
  for(const transaction of transactions) {
    balance = balance + transaction.price;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];
  return (
    <main className='bg-slate-800 text-white min-h-screen px-20'>
      {help ? (
  <div className="fixed w-full h-screen bg-slate-800/60 flex flex-col justify-center items-center z-20 top-0 left-0">
		<p className="bg-slate-400 text-black mb-24 w-1/2 p-8 rounded-md text-lg border-gray-400 border-2">
			Hi, welcome to my money tracker Webapp! <br/><br/> 
      Allow me to provide you with a short tutorial.
			In the first field, make sure to put a positive or negative value. In the second field, enter a heading for your bill or income.
      Next, in the third field below the sum of your bill/income, specify the date when the money will be made available or deducted. 
      In the last field, you can go ahead and write a small description about the transaction.
      Once the form has been filled you can go ahead and click Add new transaction to view your new balance and transaction added to the bottom of the list.<br/><br/> 
			Please feel free to communicate any issues you face when using the application or improvements you would like to see through the Contact Me portion of my profile website.
			Thanks again for stopping by!
			
			</p>
    <button onClick={toggleHelp} className="text-lg w-1/2 text-black py-2 rounded-full bg-gray-300 border-white shadow-md hover:scale-95 ease-in-out duration-500">Back to Site</button>
  </div>
) : null}
      <div className='h-16  w-full text-right pt-12'>
        <button onClick={toggleHelp}
			  className="bg-gray-300 border-2 rounded-md text-black border-gray-700 hover:scale-90 ease-in-out duration-300 p-0.5 mt-0.5">
			  	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[32px] h-[32px]">
  		  		<path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
			  	</svg>
			  </button>
      </div>
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
