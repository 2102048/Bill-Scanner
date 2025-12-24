import { useState } from 'react';
import UploadBill from './components/UploadBill';
import People from './components/People';
import Items from './components/Items';
import Summary from './components/Summary';

function App() {
    const [step, setStep] = useState(0); 
    
    const [state, setState] = useState({
        people: [],         
        items: [],         
        tax: 0,
        tip: 0, 
    });

    const goNext = () => setStep(prev => prev + 1);
    const goBack = () => setStep(prev => prev - 1);

    // Function to restart the app and clear all data
    const resetApp = () => {
        setStep(0);
        setState({
            people: [],
            items: [],
            tax: 0,
            tip: 0,
        });
    };

    const setInitialData = ({ scannedItems, detectedTax }) => {
        const defaultSharedItems = scannedItems.map(item => ({
            ...item,
            sharedBy: state.people.map(p => p.name) 
        }));

        setState(prevState => ({
            ...prevState,
            items: defaultSharedItems,
            tax: detectedTax,
            tip: 0, 
        }));
        setStep(2); 
    };

    const updatePeople = (newPeople) => {
        setState(prevState => {
            const newPeopleNames = newPeople.map(p => p.name);
            const updatedItems = prevState.items.map(item => {
                let updatedSharedBy = item.sharedBy.filter(name => newPeopleNames.includes(name));
                if (updatedSharedBy.length === 0 && newPeopleNames.length > 0) {
                     updatedSharedBy = newPeopleNames;
                }
                return { ...item, sharedBy: updatedSharedBy };
            });

            return {
                ...prevState,
                people: newPeople,
                items: updatedItems,
            };
        });
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return <UploadBill setInitialData={setInitialData} />;
            case 1:
                return <People state={state} setState={updatePeople} goNext={goNext} />;
            case 2:
                return <Items state={state} setState={setState} goBack={goBack} goNext={goNext} />;
            case 3:
                return <Summary state={state} goBack={goBack} onRestart={resetApp} />;
            default:
                return <UploadBill setInitialData={setInitialData} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <header className="text-center mb-6">
                <h1 className="text-4xl font-extrabold text-gray-800">Bill Splitter</h1>
                <p className="text-sm text-gray-500 mt-1">Split the bill effortlessly.</p>
            </header>
            <main className="max-w-xl mx-auto">
                {renderStep()}
            </main>
        </div>
    );
}

export default App;