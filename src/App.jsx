import React, { useState } from 'react';
import UploadBill from './components/UploadBill';
import People from './components/People';
import Items from './components/Items';
import Summary from './components/Summary';

function App() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState({
    items: [],
    people: [],
    tax: 0,
    tip: 0
  });

  const handleScanData = (data) => {
    setState({
      ...state,
      items: data.scannedItems.map(item => ({ ...item, sharedBy: [] })),
      tax: data.detectedTax
    });
    setStep(2); // Move to People step after scan
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100 p-4">
      {step === 1 && <UploadBill setInitialData={handleScanData} />}
      {step === 2 && (
        <People 
          state={state} 
          setState={(newPeople) => setState({ ...state, people: newPeople })} 
          goNext={() => setStep(3)} 
        />
      )}
      {step === 3 && (
        <Items 
          state={state} 
          setState={setState} 
          goBack={() => setStep(2)} 
          goNext={() => setStep(4)} 
        />
      )}
      {step === 4 && (
        <Summary 
          state={state} 
          goBack={() => setStep(3)} 
          onRestart={() => { setState({ items: [], people: [], tax: 0, tip: 0 }); setStep(1); }} 
        />
      )}
    </div>
  );
}

export default App;