import VentaTicket from '../pages/VentaTicket';

export default function VentaTicketModal({ funcionId, onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          width: '90%',
          maxWidth: '1100px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '12px',
          padding: '24px',
          position: 'relative',
        }}
      >
        {/* CERRAR */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            fontSize: '20px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          ❌
        </button>

        <VentaTicket funcionId={funcionId} />
      </div>
    </div>
  );
}
