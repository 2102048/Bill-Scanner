import { useState } from 'react';

function People({ state, setState, goNext }) {
    const { people } = state;
    const [newName, setNewName] = useState('');

    
    const handleAddPerson = () => {
        const trimmedName = newName.trim();
        if (trimmedName && !people.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
            const newPeople = [...people, { name: trimmedName }];
            setState(newPeople); 
            setNewName('');
        }
    };

    const handleRemovePerson = (name) => {
        const newPeople = people.filter(p => p.name !== name);
        setState(newPeople); 
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">👥 Who is Sharing?</h2>

            <div className="bg-white p-4 rounded shadow mb-4">
                <h3 className="font-semibold mb-2">Add Person</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter Name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="grow p-2 border rounded"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddPerson();
                        }}
                    />
                    <button onClick={handleAddPerson} className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
                        + Add
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {people.map((person, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded shadow-sm border border-gray-200">
                        <span className="text-lg">{person.name}</span>
                        <button 
                            onClick={() => handleRemovePerson(person.name)} 
                            className="text-red-500 hover:text-red-700 transition"
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end">
                <button 
                    onClick={goNext} 
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    disabled={people.length === 0 || state.items.length === 0}
                >
                    Continue to Items &rarr;
                </button>
            </div>
        </div>
    );
}

export default People;