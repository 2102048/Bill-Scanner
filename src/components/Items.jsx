import { useState } from 'react';

function Items({ state, setState, goBack, goNext }) {
    const { items, tax, people, tip } = state; 
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');


    const handleShareToggle = (itemIndex, personName) => {
        const updatedItems = items.map((item, i) => {
            if (i === itemIndex) {
                const isShared = item.sharedBy.includes(personName);
                let newSharedBy;

                if (isShared) {
                    newSharedBy = item.sharedBy.filter(name => name !== personName);
                } else {
                    newSharedBy = [...item.sharedBy, personName];
                }
                
                if (newSharedBy.length === 0 && people.length > 0) {
                    alert("An item must be paid by at least one person.");
                    return item; 
                }

                return { ...item, sharedBy: newSharedBy };
            }
            return item;
        });

        setState({ ...state, items: updatedItems });
    };


    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setState({ ...state, items: newItems });
    };

    const handleAddItem = () => {
        const price = parseFloat(newItemPrice);
        if (newItemName.trim() && !isNaN(price) && price >= 0) {
            const newSharedBy = people.map(p => p.name);
            const newItem = { 
                name: newItemName.trim(), 
                price: price, 
                sharedBy: newSharedBy 
            };
            setState({ ...state, items: [...items, newItem] });
            setNewItemName('');
            setNewItemPrice('');
        }
    };

    const handleTipChange = (e) => {
        const newTip = parseFloat(e.target.value) || 0;
        setState({ ...state, tip: newTip });
    };

    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const totalBeforeTip = subtotal + tax;
    const grandTotal = totalBeforeTip + tip; 

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">🍽️ Receipt Items & charges</h2>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-lg">{item.name}</span>
                            <div className="flex items-center">
                                <span className="text-xl font-bold text-gray-700 mr-4">${item.price.toFixed(2)}</span>
                                <button 
                                    onClick={() => handleRemoveItem(index)} 
                                    className="text-red-500 hover:text-red-700 transition"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                        
                        <div className="border-t pt-2 mt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Shared by:
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {people.map(person => (
                                    <label key={person.name} className={`flex items-center space-x-1 cursor-pointer p-2 rounded border transition duration-150 ${item.sharedBy.includes(person.name) ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-100'}`}>
                                        <input
                                            type="checkbox"
                                            checked={item.sharedBy.includes(person.name)}
                                            onChange={() => handleShareToggle(index, person.name)}
                                            className="form-checkbox text-blue-600"
                                            disabled={people.length < 1} 
                                        />
                                        <span className="text-sm">{person.name}</span>
                                    </label>
                                ))}
                            </div>
                            {people.length === 0 && <p className="text-red-500 text-sm mt-1">Add people in the previous step to assign items.</p>}
                        </div>
                    </div>
                ))}

                <div className="bg-white p-4 rounded shadow border-2 border-dashed border-gray-300">
                    <h3 className="font-semibold mb-2">Add New Item</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Item Name"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="grow p-2 border rounded"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={newItemPrice}
                            onChange={(e) => setNewItemPrice(e.target.value)}
                            className="w-24 p-2 border rounded"
                        />
                        <button onClick={handleAddItem} className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
                            + Add
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded shadow border border-yellow-300">
                <label className="block font-semibold mb-2 text-lg text-yellow-800">
                    💵 Enter Tip Amount:
                </label>
                <input
                    type="number"
                    placeholder="Tip Amount"
                    value={tip || ''}
                    onChange={handleTipChange}
                    className="w-full p-2 border rounded text-lg focus:ring-yellow-500 focus:border-yellow-500"
                    min="0"
                />
            </div>


            <div className="mt-6 p-4 bg-gray-100 rounded shadow-md">
                <div className="flex justify-between font-medium">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-green-700">
                    <span>Tip:</span>
                    <span>${tip.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl border-t mt-2 pt-2">
                    <span>GRAND TOTAL:</span>
                    <span>${grandTotal.toFixed(2)}</span>
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <button 
                    onClick={goBack} 
                    className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition"
                >
                    &larr; Putnew(People)
                </button>
                <button 
                    onClick={goNext} 
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    disabled={items.length === 0 || people.length === 0}
                >
                    Continue to Summary &rarr;
                </button>
            </div>
        </div>
    );
}

export default Items;