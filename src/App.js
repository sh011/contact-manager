import React, { useState, useEffect } from 'react';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import './App.css';

function App() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('http://localhost:3001/contacts');
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      setContacts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setLoading(false);
    }
  };

  const handleAddContact = async (contactData) => {
    try {
      console.log('Attempting to add contact:', contactData);
      const response = await fetch('http://localhost:3001/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });
      
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to add contact: ${response.status} ${responseText}`);
      }
      
      const newContact = JSON.parse(responseText);
      setContacts(prevContacts => [...prevContacts, newContact]);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding contact:', error);
      alert(`Failed to add contact: ${error.message}`);
    }
  };

  const handleUpdateContact = async (contactData) => {
    try {
      const response = await fetch(`http://localhost:3001/contacts/${selectedContact.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update contact');
      }
      
      const updatedContact = await response.json();
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === updatedContact.id ? updatedContact : contact
        )
      );
      setSelectedContact(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Failed to update contact. Please try again.');
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const response = await fetch(`http://localhost:3001/contacts/${contactId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete contact');
        }
        
        setContacts(prevContacts => prevContacts.filter(contact => contact.id !== contactId));
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Failed to delete contact. Please try again.');
      }
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Contact Manager</h1>
        <button 
          className="add-contact-btn"
          onClick={() => {
            setSelectedContact(null);
            setShowForm(true);
          }}
        >
          Add New Contact
        </button>
      </header>

      <main>
        {showForm ? (
          <ContactForm
            contact={selectedContact}
            onSubmit={selectedContact ? handleUpdateContact : handleAddContact}
            onCancel={() => {
              setShowForm(false);
              setSelectedContact(null);
            }}
          />
        ) : (
          <ContactList
            contacts={contacts}
            onSelectContact={(contact) => {
              setSelectedContact(contact);
              setShowForm(true);
            }}
            onDeleteContact={handleDeleteContact}
          />
        )}
      </main>
    </div>
  );
}

export default App;
