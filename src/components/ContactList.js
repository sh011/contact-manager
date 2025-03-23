import React from 'react';
import './ContactList.css';

const ContactList = ({ contacts, onSelectContact, onDeleteContact }) => {
  if (!contacts) {
    return <div className="loading">Loading contacts...</div>;
  }

  return (
    <div className="contact-list">
      <h2>Contacts</h2>
      {contacts.map(contact => (
        <div key={contact.id} className="contact-item">
          <div className="contact-info" onClick={() => onSelectContact(contact)}>
            <h3>{contact.name}</h3>
            <p>{contact.email}</p>
            <p>{contact.phone}</p>
            <p>{contact.address}</p>
          </div>
          <button 
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteContact(contact.id);
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default ContactList; 