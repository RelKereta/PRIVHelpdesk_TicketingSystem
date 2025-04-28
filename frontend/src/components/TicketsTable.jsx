import React from 'react';

function TicketsTable() {
  return (
    <section className="tickets-section">
      <button className="new-ticket-btn">+ Issue New Ticket</button>
      <table className="tickets-table">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {/* No data yet */}
          <tr>
            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
              No tickets to display.
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

export default TicketsTable;
