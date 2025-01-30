import { useState, useEffect } from 'react';
import { differenceInYears, parseISO } from 'date-fns';
import { Edit2, Trash2, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

interface Person {
  id: string;
  name: string;
  dob: string;
}

export function Dashboard() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editPerson, setEditPerson] = useState<Person | null>(null);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .order('name');

      if (error) throw error;
      setPeople(data || []);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob: string) => {
    return differenceInYears(new Date(), parseISO(dob));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && editPerson) {
        const { error } = await supabase
          .from('people')
          .update({ name, dob })
          .eq('id', editPerson.id);

        if (error) throw error;
        toast.success('Person updated successfully');
      } else {
        const { error } = await supabase
          .from('people')
          .insert([{ name, dob }]);

        if (error) throw error;
        toast.success('Person added successfully');
      }

      setName('');
      setDob('');
      setIsEditing(false);
      setEditPerson(null);
      fetchPeople();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update person' : 'Failed to add person');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (person: Person) => {
    setIsEditing(true);
    setEditPerson(person);
    setName(person.name);
    setDob(person.dob);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this person?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('people')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Person deleted successfully');
      fetchPeople();
    } catch (error) {
      toast.error('Failed to delete person');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !people.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">People</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all people in the system including their name, age, and date of birth.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? (
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
          ) : (
            <Plus className="-ml-1 mr-2 h-4 w-4" />
          )}
          {isEditing ? 'Update Person' : 'Add Person'}
        </button>
      </form>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Age</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date of Birth</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {people.map((person) => (
                    <tr key={person.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{person.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {calculateAge(person.dob)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.dob}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(person)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(person.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}