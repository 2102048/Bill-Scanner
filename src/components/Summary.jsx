function Summary({ state, goBack, onRestart }) {
    const { items, people, tax, tip } = state;

    const initialTotals = people.reduce((acc, person) => {
        acc[person.name] = { 
            name: person.name, 
            itemTotal: 0, 
            taxShare: 0, 
            tipShare: 0, 
            grandTotal: 0 
        };
        return acc;
    }, {});
    
    let totalTaxableAmount = 0; 

    items.forEach(item => {
        const sharers = item.sharedBy.length;
        if (sharers > 0) {
            const individualShare = item.price / sharers;
            totalTaxableAmount += item.price; 
            
            item.sharedBy.forEach(personName => {
                if (initialTotals[personName]) {
                    initialTotals[personName].itemTotal += individualShare;
                }
            });
        }
    });

    if (totalTaxableAmount > 0) {
        Object.keys(initialTotals).forEach(personName => {
            const personItemTotal = initialTotals[personName].itemTotal;
            const proportion = personItemTotal / totalTaxableAmount;
            
            initialTotals[personName].taxShare = tax * proportion;
            initialTotals[personName].tipShare = tip * proportion; 
        });
    }

    const finalTotals = Object.values(initialTotals).map(person => ({
        ...person,
        grandTotal: person.itemTotal + person.taxShare + person.tipShare 
    }));

    const totalSubtotal = items.reduce((sum, item) => sum + item.price, 0);
    const totalGrand = totalSubtotal + tax + tip; 

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">Final Summary & Split</h2>

            <div className="space-y-6">
                {finalTotals.map(person => (
                    <div key={person.name} className="bg-white p-4 rounded-lg shadow-xl border-l-4 border-blue-500">
                        <h3 className="text-xl font-extrabold text-gray-800 mb-2">{person.name}</h3>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex justify-between">
                                <span>Item cost:</span>
                                <span className="font-semibold">${person.itemTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax share:</span>
                                <span className="font-semibold">${person.taxShare.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-green-700">
                                <span>Tip Share:</span>
                                <span className="font-semibold">${person.tipShare.toFixed(2)}</span>
                            </div>
                            <hr className="my-1"/>
                            <div className="flex justify-between text-lg font-bold text-blue-600">
                                <span>TOTAL DUE:</span>
                                <span>${person.grandTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded">
                <h4 className="font-semibold">Overall Bill Summary:</h4>
                <div className="flex justify-between text-sm"><span>Subtotal:</span><span>${totalSubtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span>Total Tax:</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span>Total Tip:</span><span>${tip.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold border-t mt-1 pt-1"><span>Grand Total:</span><span>${totalGrand.toFixed(2)}</span></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between mt-8">
                <button 
                    onClick={goBack} 
                    className="bg-gray-400 text-white py-3 px-6 rounded-lg hover:bg-gray-500 transition font-semibold"
                >
                    &larr; Back to Items
                </button>

                <button 
                    onClick={onRestart} 
                    className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition font-extrabold shadow-lg flex items-center justify-center gap-2"
                >
                    <span>📸</span> Scan New Bill
                </button>
            </div>
        </div>
    );
}

export default Summary;