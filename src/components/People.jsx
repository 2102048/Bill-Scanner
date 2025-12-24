import { useState } from 'react';

function People({ state, setState, goNext }) {
    const [newName, setNewName] = useState('');
    const { people, items } = state;

    const handleAddPerson = () => {
        const name = newName.trim();
        if (name && !people.some(p => p.name === name)) {
            setState([...people, { name }]);
            setNewName('');
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">👥 Who is sharing?</h2>
            <div className="flex gap-2 mb-4">
                <input 
                    className="border p-2 grow rounded"
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Name"
                />
                <button onClick={handleAddPerson} className="bg-green-500 text-white px-4 rounded">+</button>
            </div>
            <ul className="mb-4">
                {people.map(p => (
                    <li key={p.name} className="flex justify-between border-b py-2">
                        {p.name}
                        <button onClick={() => setState(people.filter(per => per.name !== p.name))} className="text-red-500">🗑️</button>
                    </li>
                ))}
            </ul>
            <button 
                onClick={goNext} 
                disabled={people.length === 0}
                className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
            >
                Continue to Items ({items.length} scanned)
            </button>
        </div>
    );
}
export default People;