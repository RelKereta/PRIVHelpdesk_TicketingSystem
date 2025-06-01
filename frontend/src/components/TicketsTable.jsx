import { Link } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import './TicketsTable.css';

function TicketsTable() {
  const { tickets } = useTickets();

  return (
    <section className="tickets-container">

      <div className="action-buttons-container">
        <Link to="/chatbot" className="main-action-button chatbot-button">
          Chat with Bot
        </Link>
        <Link to="/create-ticket" className="main-action-button create-ticket-button">
          Issue New Ticket
        </Link>
      </div>

      <div className="tickets-table-container">
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
            {tickets.length === 0 ? (
              <tr className="empty-table-row">
                <td colSpan="5" className="empty-table-cell">
                  No tickets to display.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td className="subject-cell">{ticket.subject}</td>
                  <td>
                    <span className={`status-indicator status-${ticket.status.toLowerCase()}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="priority-level" title={`Priority: ${ticket.priority}`}>
                    {ticket.priority}
                  </td>
                  <td>{new Date(ticket.createdDate).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TicketsTable;
